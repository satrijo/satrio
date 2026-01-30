---
title: "Authentication JWT di Node.js: Login dan Register"
date: "2026-02-16T00:00:00.000Z"
description: "Tutorial lengkap implementasi authentication menggunakan JWT (JSON Web Token) di Node.js. Pelajari cara membuat sistem login, register, protected routes, refresh token, dan best practices keamanan."
category: Node.js
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# Authentication JWT di Node.js: Login dan Register

Authentication adalah aspek krusial dalam pengembangan aplikasi modern. JSON Web Token (JWT) telah menjadi standar industri untuk implementasi authentication yang stateless dan scalable. Artikel ini akan membimbing Anda membangun sistem authentication lengkap dengan Node.js dan Express.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami dasar-dasar Express.js dan middleware. Jika Anda belum familiar dengan Express, silakan baca [Express.js Framework: Membangun REST API](/blog/expressjs-framework-membangun-rest-api) dan [Middleware dan Error Handling di Express](/blog/middleware-dan-error-handling-di-express) terlebih dahulu.

## Apa Itu JWT?

JWT (JSON Web Token) adalah standar terbuka (RFC 7519) yang mendefinisikan cara kompak dan self-contained untuk mengirimkan informasi antar pihak sebagai objek JSON. Token ini dapat diverifikasi dan dipercaya karena ditandatangani secara digital.

Struktur JWT terdiri dari tiga bagian yang dipisahkan oleh titik:

1. **Header**: Berisi tipe token (JWT) dan algoritma signing (HS256, RS256, dll)
2. **Payload**: Berisi claims (data user, expiration time, dll)
3. **Signature**: Hash dari header dan payload yang ditandatangani dengan secret key

Contoh JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMe...
```

## Mengapa Menggunakan JWT?

**Stateless**: Server tidak perlu menyimpan session state, membuat aplikasi lebih scalable.

**Cross-Domain**: JWT dapat digunakan di berbagai domain dan platform.

**Self-Contained**: Semua informasi ada di dalam token itu sendiri.

**Performa**: Tidak perlu query database untuk verifikasi setiap request.

## Setup Proyek

```bash
mkdir jwt-auth-app
cd jwt-auth-app
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
```

Struktur folder:
```
jwt-auth-app/
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── .env
└── app.js
```

## Konfigurasi Environment

File `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jwt-auth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

## Membuat User Model

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username harus diisi'],
    unique: true,
    trim: true,
    minlength: [3, 'Username minimal 3 karakter'],
    maxlength: [30, 'Username maksimal 30 karakter']
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Format email tidak valid']
  },
  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    minlength: [6, 'Password minimal 6 karakter'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password sebelum save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

## Controller Authentication

```javascript
// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
  
  return { accessToken, refreshToken };
};

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }
    
    // Cek apakah user sudah ada
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email atau username sudah terdaftar'
      });
    }
    
    // Buat user baru
    const user = await User.create({
      username,
      email,
      password
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Simpan refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi'
      });
    }
    
    // Cari user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
    
    // Verifikasi password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Simpan refresh token
    user.refreshTokens.push({ token: refreshToken });
    
    // Batasi jumlah refresh token (misal: max 5)
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login'
    });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token diperlukan'
      });
    }
    
    // Verifikasi refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Cari user dengan refresh token tersebut
    const user = await User.findOne({
      _id: decoded.userId,
      'refreshTokens.token': refreshToken
    });
    
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Refresh token tidak valid'
      });
    }
    
    // Generate tokens baru
    const tokens = generateTokens(user._id);
    
    // Hapus refresh token lama dan simpan yang baru
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();
    
    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({
      success: false,
      message: 'Refresh token tidak valid atau sudah expired'
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.userId;
    
    // Hapus refresh token dari database
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
    
    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat logout'
    });
  }
};

// Logout from all devices
exports.logoutAll = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Hapus semua refresh token
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] }
    });
    
    res.json({
      success: true,
      message: 'Logout dari semua perangkat berhasil'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan'
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan'
    });
  }
};
```

## Middleware Authentication

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify access token
exports.authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Cek header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan'
      });
    }
    
    try {
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Cek apakah user masih ada
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token tidak valid - User tidak ditemukan'
        });
      }
      
      // Attach user ke request
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan'
    });
  }
};

// Check role
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk melakukan ini'
        });
      }
      
      next();
    } catch (error) {
      console.error('Authorize error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan'
      });
    }
  };
};
```

## Routes

```javascript
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
```

## Protected Routes Example

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Route yang hanya bisa diakses user yang login
router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Ini adalah profile user',
    userId: req.user.userId
  });
});

// Route yang hanya bisa diakses admin
router.get('/admin-only', authenticate, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Ini adalah halaman admin'
  });
});

// Route yang bisa diakses admin dan moderator
router.get('/moderator-area', authenticate, authorize('admin', 'moderator'), (req, res) => {
  res.json({
    success: true,
    message: 'Ini adalah area moderator'
  });
});

module.exports = router;
```

## Main Application

```javascript
// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing dengan cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Access protected route
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Security Best Practices

1. **Gunakan HTTPS**: Selalu gunakan HTTPS di production untuk mencegah token dicuri.

2. **Strong Secret Keys**: Gunakan secret keys yang panjang dan kompleks.

3. **Short-lived Access Tokens**: Access token sebaiknya expire dalam waktu singkat (15-30 menit).

4. **Secure Storage**: Di client, simpan token di httpOnly cookies, bukan localStorage.

5. **Rate Limiting**: Implementasikan rate limiting pada endpoint login untuk mencegah brute force.

6. **Input Validation**: Validasi semua input untuk mencegah injection attacks.

7. **CORS Configuration**: Konfigurasi CORS dengan whitelist domain yang diizinkan.

8. **Token Blacklist**: Untuk logout yang lebih aman, implementasikan token blacklist.

## Kesimpulan

JWT authentication memberikan solusi yang scalable dan stateless untuk aplikasi Node.js. Dengan memahami konsep access token dan refresh token, Anda dapat membangun sistem authentication yang aman dan user-friendly.

Implementasi yang baik mencakup validasi input, password hashing, token rotation, dan proper error handling. Dengan mengikuti best practices keamanan, Anda dapat melindungi aplikasi dari ancaman umum.

## Artikel Selanjutnya

Setelah memahami authentication dengan JWT, lanjutkan pembelajaran Anda dengan membaca [Database dengan Node.js: MongoDB dan Mongoose](/blog/database-dengan-nodejs-mongodb-dan-mongoose).

Selamat mengamankan aplikasi Anda!
