---
title: "Database dengan Node.js: MongoDB dan Mongoose"
date: "2026-02-15T00:00:00.000Z"
description: "Panduan komprehensif menggunakan MongoDB dengan Node.js melalui Mongoose ODM. Pelajari CRUD operations, schema design, validation, relationships, aggregation, dan best practices database."
category: Node.js
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# Database dengan Node.js: MongoDB dan Mongoose

MongoDB adalah database NoSQL yang populer untuk aplikasi Node.js karena fleksibilitasnya dalam menyimpan data dalam format JSON-like (BSON). Ketika dikombinasikan dengan Mongoose sebagai Object Data Modeling (ODM) library, pengembangan menjadi lebih terstruktur dan powerful.

## Mengapa MongoDB?

MongoDB menawarkan beberapa keunggulan untuk aplikasi modern:

**Schema Fleksibel**: Tidak seperti SQL yang memerlukan schema rigid, MongoDB memungkinkan dokumen dalam satu collection memiliki struktur berbeda.

**Horizontal Scalability**: MongoDB dirancang untuk scale out dengan mudah menggunakan sharding.

**JSON-like Documents**: Data disimpan dalam format BSON yang kompatibel dengan JavaScript object, membuat integrasi dengan Node.js sangat natural.

**Rich Query Language**: Mendukung complex queries, aggregation, dan indexing untuk performa optimal.

## Instalasi dan Setup

Pertama, install MongoDB locally atau gunakan MongoDB Atlas (cloud service). Kemudian install package yang diperlukan:

```bash
npm install mongoose
npm install dotenv
```

Buat file `.env` untuk konfigurasi:

```
MONGODB_URI=mongodb://localhost:27017/myapp
PORT=3000
```

## Koneksi ke MongoDB

Buat file `config/database.js`:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Catatan 2026: useNewUrlParser dan useUnifiedTopology sudah deprecated
    // karena sekarang menjadi default behavior di Mongoose 6+
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

Di file utama aplikasi:

```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

app.use(express.json());

// Routes akan ditambahkan di sini

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Membuat Schema dan Model

Schema mendefinisikan struktur dokumen dalam collection:

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    trim: true,
    maxlength: [50, 'Nama tidak boleh lebih dari 50 karakter']
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Format email tidak valid']
  },
  age: {
    type: Number,
    min: [0, 'Umur tidak boleh negatif'],
    max: [150, 'Umur tidak realistis']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pre-save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method
userSchema.methods.getFullInfo = function() {
  return `${this.name} (${this.email}) - ${this.role}`;
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

module.exports = mongoose.model('User', userSchema);
```

## CRUD Operations

### Create (Membuat Data)

```javascript
const User = require('./models/User');

// Method 1: Create and save
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    console.log('User created:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

// Method 2: Create directly
const createUserDirect = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

// Method 3: Insert many
const createManyUsers = async (usersData) => {
  try {
    const users = await User.insertMany(usersData);
    return users;
  } catch (error) {
    throw error;
  }
};

// Contoh penggunaan
const newUser = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  age: 25,
  role: 'user'
};

createUser(newUser);
```

### Read (Membaca Data)

```javascript
// Find all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw error;
  }
};

// Find by ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Find with conditions
const getActiveUsers = async () => {
  try {
    const users = await User.find({ isActive: true });
    return users;
  } catch (error) {
    throw error;
  }
};

// Find with query operators
const getUsersByAge = async (minAge, maxAge) => {
  try {
    const users = await User.find({
      age: { $gte: minAge, $lte: maxAge }
    });
    return users;
  } catch (error) {
    throw error;
  }
};

// Find with select (projection)
const getUserNames = async () => {
  try {
    const users = await User.find().select('name email');
    return users;
  } catch (error) {
    throw error;
  }
};

// Find with sorting and pagination
const getUsersPaginated = async (page = 1, limit = 10) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await User.countDocuments();
    
    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};
```

### Update (Memperbarui Data)

```javascript
// Update by ID
const updateUser = async (id, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Update with conditions
const activateUser = async (email) => {
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { isActive: true },
      { new: true }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

// Update many
const updateManyUsers = async (condition, update) => {
  try {
    const result = await User.updateMany(condition, update);
    return result;
  } catch (error) {
    throw error;
  }
};
```

### Delete (Menghapus Data)

```javascript
// Delete by ID
const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw error;
  }
};

// Delete with conditions
const deleteInactiveUsers = async () => {
  try {
    const result = await User.deleteMany({ isActive: false });
    return result;
  } catch (error) {
    throw error;
  }
};
```

## Relationships (Relasi)

MongoDB mendukung embedded documents dan references:

```javascript
// models/Post.js
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Populate (mengisi reference)
const getPostsWithAuthor = async () => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('comments.user', 'name');
    return posts;
  } catch (error) {
    throw error;
  }
};

// Create post with reference
const createPost = async (postData) => {
  try {
    const post = await Post.create(postData);
    return post;
  } catch (error) {
    throw error;
  }
};
```

## Validation

Mongoose menyediakan built-in dan custom validators:

```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Price must be a positive number'
    }
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Z]{3}-\d{4}$/, 'SKU format must be XXX-0000']
  },
  category: {
    type: String,
    enum: {
      values: ['electronics', 'clothing', 'food', 'books'],
      message: 'Category must be electronics, clothing, food, or books'
    }
  }
});
```

## Aggregation Pipeline

Aggregation memungkinkan complex data processing:

```javascript
// Get user statistics
const getUserStats = async () => {
  try {
    const stats = await User.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          avgAge: { $avg: '$age' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    return stats;
  } catch (error) {
    throw error;
  }
};

// Get posts with like count
const getPopularPosts = async () => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      {
        $project: {
          title: 1,
          likes: 1,
          authorName: { $arrayElemAt: ['$authorInfo.name', 0] },
          commentCount: { $size: '$comments' }
        }
      },
      {
        $sort: { likes: -1 }
      },
      {
        $limit: 10
      }
    ]);
    return posts;
  } catch (error) {
    throw error;
  }
};
```

## Middleware (Hooks)

Mongoose middleware berjalan pada saat tertentu:

```javascript
// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Post-save middleware
userSchema.post('save', function(doc) {
  console.log(`User ${doc.name} has been saved`);
});

// Pre-remove middleware
userSchema.pre('remove', async function(next) {
  // Delete all posts by this user
  await Post.deleteMany({ author: this._id });
  next();
});
```

## Indexing untuk Performa

Indexing meningkatkan kecepatan query:

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index
userSchema.index({ name: 1, email: 1 });

// Text index untuk search
userSchema.index({ name: 'text', email: 'text' });
```

## Transaction

Untuk operasi yang memerlukan atomicity:

```javascript
const transferFunds = async (fromUserId, toUserId, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Deduct from sender
    await User.findByIdAndUpdate(
      fromUserId,
      { $inc: { balance: -amount } },
      { session }
    );
    
    // Add to receiver
    await User.findByIdAndUpdate(
      toUserId,
      { $inc: { balance: amount } },
      { session }
    );
    
    await session.commitTransaction();
    console.log('Transfer successful');
  } catch (error) {
    await session.abortTransaction();
    console.error('Transfer failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
};
```

## Integrasi dengan Express

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create user
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

## Best Practices

1. **Selalu Handle Error**: Gunakan try-catch untuk semua operasi database.

2. **Gunakan Schema Validation**: Definisikan validation rules di schema untuk data integrity.

3. **Indexing**: Buat index pada field yang sering di-query.

4. **Connection Pooling**: Biarkan Mongoose mengelola connection pooling.

5. **Gunakan Transactions**: Untuk operasi multi-document yang memerlukan atomicity.

6. **Lean Queries**: Gunakan `.lean()` untuk read-only queries yang lebih cepat.

7. **Selective Population**: Hanya populate field yang benar-benar diperlukan.

## Kesimpulan

MongoDB dan Mongoose memberikan kombinasi yang powerful untuk pengembangan aplikasi Node.js. Dengan schema yang fleksibel, rich query language, dan fitur-fitur advanced seperti aggregation dan transactions, Anda dapat membangun aplikasi yang scalable dan maintainable.

Pemahaman yang kuat tentang CRUD operations, relationships, validation, dan best practices akan membantu Anda membangun aplikasi dengan data layer yang robust dan efisien.

Selamat mengembangkan!
