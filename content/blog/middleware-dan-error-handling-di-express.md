---
title: "Middleware dan Error Handling di Express"
date: "2026-02-17T00:00:00.000Z"
description: "Panduan mendalam tentang middleware dan error handling di Express.js. Pelajari cara membuat custom middleware, error handling patterns, async error handling, dan best practices untuk aplikasi yang robust."
category: Node.js
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# Middleware dan Error Handling di Express

Middleware adalah konsep fundamental dalam Express.js yang memungkinkan Anda memodifikasi request dan response objects, mengakhiri request-response cycle, atau memanggil middleware function berikutnya. Pemahaman yang baik tentang middleware dan error handling sangat penting untuk membangun aplikasi Express yang scalable dan maintainable.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami dasar-dasar Express.js. Jika Anda baru memulai dengan Express, silakan baca [Express.js Framework: Membangun REST API](/blog/expressjs-framework-membangun-rest-api) terlebih dahulu.

## Apa Itu Middleware?

Middleware adalah function yang dieksekusi selama request-response cycle. Middleware memiliki akses ke:
- Request object (req)
- Response object (res)
- Next middleware function (next)

Middleware dapat melakukan tugas-tugas berikut:
- Eksekusi kode apapun
- Memodifikasi request dan response objects
- Mengakhiri request-response cycle
- Memanggil middleware berikutnya dalam stack

Jika middleware function tidak mengakhiri request-response cycle, maka harus memanggil `next()` untuk meneruskan kontrol ke middleware berikutnya. Jika tidak, request akan hang.

## Jenis-jenis Middleware

### 1. Application-level Middleware

Middleware yang di-bind ke instance aplikasi Express menggunakan `app.use()` atau `app.METHOD()`:

```javascript
const express = require('express');
const app = express();

// Middleware tanpa path - dijalankan untuk setiap request
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// Middleware dengan path
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});

// Middleware untuk specific HTTP method
app.get('/user/:id', (req, res, next) => {
  res.send('USER');
});
```

### 2. Router-level Middleware

Mirip dengan application-level middleware, tapi di-bind ke instance `express.Router()`:

```javascript
const express = require('express');
const router = express.Router();

// Middleware specific untuk router ini
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

router.get('/', (req, res) => {
  res.send('Router Home');
});

module.exports = router;
```

### 3. Error-handling Middleware

Middleware khusus untuk menangani error dengan 4 parameter:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### 4. Built-in Middleware

Express menyediakan beberapa middleware bawaan:

```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
```

### 5. Third-party Middleware

Middleware dari npm packages:

```bash
npm install cors helmet morgan compression
```

```javascript
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

app.use(helmet());        // Security headers
app.use(cors());          // Enable CORS
app.use(morgan('dev'));   // Request logging
app.use(compression());   // Compress responses
```

## Membuat Custom Middleware

### Logging Middleware

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Calculate response time
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = logger;
```

### Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

### Validation Middleware

```javascript
// middleware/validator.js
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateUser, validatePost };
```

### Rate Limiting Middleware

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter limit for auth endpoints
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  }
});

module.exports = { apiLimiter, authLimiter };
```

### Request ID Middleware

```javascript
// middleware/requestId.js
const { v4: uuidv4 } = require('uuid');

const requestId = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
};

module.exports = requestId;
```

## Error Handling Patterns

### 1. Basic Error Handling

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  console.error(err);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }
  
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

### 2. Custom Error Class

```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

### 3. Async Handler Wrapper

```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

### 4. Using Custom Error Class

```javascript
// controllers/userController.js
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.json({
    success: true,
    data: user
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }
  
  const user = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    data: user
  });
});
```

## Complete Application Structure

```javascript
// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const logger = require('./middleware/logger');
const requestId = require('./middleware/requestId');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Request ID middleware
app.use(requestId);

// Logging middleware
app.use(morgan('dev'));
app.use(logger);

// Rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
```

## Middleware Execution Order

Order sangat penting dalam Express:

```javascript
// 1. Security and parsing middleware first
app.use(helmet());
app.use(express.json());

// 2. Logging and tracking
app.use(requestId);
app.use(logger);

// 3. Rate limiting
app.use(rateLimit());

// 4. Routes
app.use('/api', routes);

// 5. Error handling (always last)
app.use(errorHandler);
```

## Conditional Middleware

```javascript
// middleware/conditional.js
const conditional = (condition, middleware) => {
  return (req, res, next) => {
    if (condition(req)) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
};

// Usage
app.use(conditional(
  (req) => req.path.startsWith('/api'),
  apiMiddleware
));
```

## Middleware Composition

```javascript
// middleware/compose.js
const compose = (...middlewares) => {
  return (req, res, next) => {
    let index = 0;
    
    const dispatch = (i) => {
      if (i >= middlewares.length) return next();
      
      const middleware = middlewares[i];
      middleware(req, res, () => dispatch(i + 1));
    };
    
    dispatch(0);
  };
};

// Usage
const validateAndLog = compose(
  validateUser,
  logger,
  authenticate
);

app.post('/users', validateAndLog, createUser);
```

## Testing Middleware

```javascript
// tests/middleware/auth.test.js
const request = require('supertest');
const express = require('express');
const { authenticate } = require('../../middleware/auth');

describe('Authentication Middleware', () => {
  let app;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/protected', authenticate, (req, res) => {
      res.json({ user: req.user });
    });
  });
  
  it('should deny access without token', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
  
  it('should deny access with invalid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });
});
```

## Best Practices

1. **Order Matters**: Selalu letakkan error handling middleware di akhir.

2. **Use next()**: Jangan lupa memanggil `next()` kecuali Anda mengakhiri response.

3. **Async Middleware**: Untuk async middleware, gunakan try-catch atau asyncHandler wrapper.

4. **Single Responsibility**: Setiap middleware sebaiknya hanya melakukan satu tugas.

5. **Error Propagation**: Lempar error ke error handling middleware dengan `next(error)`.

6. **Security First**: Selalu gunakan security middleware seperti helmet dan cors.

7. **Logging**: Implementasikan logging untuk debugging dan monitoring.

8. **Rate Limiting**: Lindungi API dari abuse dengan rate limiting.

## Kesimpulan

Middleware adalah inti dari Express.js yang memberikan fleksibilitas dan modularitas. Dengan memahami berbagai jenis middleware dan patterns error handling, Anda dapat membangun aplikasi yang robust, secure, dan maintainable.

Pemahaman yang baik tentang execution order, error propagation, dan best practices akan membantu Anda menghindari common pitfalls dan membuat kode yang lebih bersih.

## Artikel Selanjutnya

Setelah memahami middleware dan error handling di Express.js, lanjutkan pembelajaran Anda dengan membaca [Authentication JWT di Node.js: Login dan Register](/blog/authentication-jwt-di-nodejs-login-dan-register).

Selamat mengembangkan!
