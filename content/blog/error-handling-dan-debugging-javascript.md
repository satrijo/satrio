---
title: "Error Handling dan Debugging JavaScript"
date: "2026-02-05T00:00:00.000Z"
description: "Panduan komprehensif tentang error handling, debugging, dan troubleshooting JavaScript dengan teknik-teknik praktis dan best practices dalam bahasa Indonesia"
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# Error Handling dan Debugging JavaScript

Error adalah bagian tak terpisahkan dari proses pengembangan software. Kemampuan untuk menangani error dengan baik dan melakukan debugging secara efektif merupakan keterampilan penting bagi setiap developer JavaScript. Artikel ini akan membahas berbagai jenis error, teknik error handling, debugging tools, dan best practices untuk menulis kode yang robust.

## Memahami Error dalam JavaScript

### Jenis-Jenis Error

JavaScript memiliki beberapa built-in error types yang masing-masing menunjukkan masalah spesifik:

```javascript
// 1. SyntaxError - Kesalahan sintaks
try {
  eval('var x = ;'); // SyntaxError: Unexpected token ';'
} catch (e) {
  console.log(e.name, ':', e.message);
}

// 2. ReferenceError - Mengakses variabel yang tidak didefinisikan
try {
  console.log(undefinedVariable);
} catch (e) {
  console.log(e.name, ':', e.message);
  // ReferenceError: undefinedVariable is not defined
}

// 3. TypeError - Operasi pada tipe data yang tidak sesuai
try {
  const num = 42;
  num.toUpperCase(); // TypeError: num.toUpperCase is not a function
} catch (e) {
  console.log(e.name, ':', e.message);
}

// 4. RangeError - Nilai di luar rentang yang valid
try {
  const arr = new Array(-1); // RangeError: Invalid array length
} catch (e) {
  console.log(e.name, ':', e.message);
}

// 5. URIError - Kesalahan encode/decode URI
try {
  decodeURIComponent('%'); // URIError: URI malformed
} catch (e) {
  console.log(e.name, ':', e.message);
}

// 6. EvalError - Kesalahan dalam eval() (jarang digunakan di JS modern)
try {
  // Hampir tidak terjadi di JavaScript modern
} catch (e) {
  console.log(e.name, ':', e.message);
}
```

### Error Object

```javascript
try {
  throw new Error('Terjadi kesalahan!');
} catch (error) {
  console.log('Name:', error.name);         // Error
  console.log('Message:', error.message);   // Terjadi kesalahan!
  console.log('Stack:', error.stack);       // Stack trace
  
  // Custom properties
  console.log('Type:', typeof error);       // object
}
```

## Try...Catch...Finally

### Sintaks Dasar

```javascript
try {
  // Kode yang mungkin menghasilkan error
  const hasil = operasiBerisiko();
  console.log(hasil);
} catch (error) {
  // Tangani error di sini
  console.error('Error:', error.message);
} finally {
  // Selalu dieksekusi, baik ada error maupun tidak
  console.log('Operasi selesai');
}
```

### Contoh Penggunaan

```javascript
function bagi(a, b) {
  try {
    if (b === 0) {
      throw new Error('Pembagian dengan nol tidak diperbolehkan');
    }
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Parameter harus berupa angka');
    }
    
    return a / b;
  } catch (error) {
    console.error(`[${error.name}] ${error.message}`);
    return null;
  } finally {
    console.log(`Operasi: ${a} / ${b}`);
  }
}

console.log(bagi(10, 2));    // Output: 5
console.log(bagi(10, 0));    // Output: null (dengan error message)
console.log(bagi('10', 2));  // Output: null (dengan error message)
```

### Optional Catch Binding (ES2019)

```javascript
// Tanpa menggunakan error object
try {
  JSON.parse('{invalid json}');
} catch {
  // Tidak perlu mendefinisikan error parameter
  console.log('JSON parsing gagal');
}
```

### Nested Try...Catch

```javascript
function prosesDataKompleks(data) {
  try {
    // Level 1: Validasi input
    if (!data) {
      throw new Error('Data tidak boleh kosong');
    }
    
    try {
      // Level 2: Parsing JSON
      const parsed = JSON.parse(data);
      
      try {
        // Level 3: Proses data
        if (!parsed.items || !Array.isArray(parsed.items)) {
          throw new Error('Format data tidak valid');
        }
        
        return parsed.items.map(item => item.value * 2);
      } catch (processingError) {
        console.error('Error processing:', processingError.message);
        throw processingError;
      }
    } catch (parseError) {
      console.error('Error parsing:', parseError.message);
      return [];
    }
  } catch (validationError) {
    console.error('Error validation:', validationError.message);
    return null;
  }
}
```

## Custom Error Classes

### Membuat Custom Error

```javascript
// Base custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} tidak ditemukan`, 404);
    this.name = 'NotFoundError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Autentikasi gagal') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

// Penggunaan
function getUserById(id) {
  if (!id) {
    throw new ValidationError('ID user harus disediakan');
  }
  
  const user = database.findUser(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  return user;
}

try {
  const user = getUserById('invalid-id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('User tidak ditemukan, tampilkan halaman 404');
  } else if (error instanceof ValidationError) {
    console.log('Validasi gagal:', error.message);
  } else {
    console.log('Error tidak terduga:', error);
  }
}
```

### Error dengan Metadata

```javascript
class APIError extends Error {
  constructor(message, { statusCode, endpoint, method, timestamp = new Date() } = {}) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.method = method;
    this.timestamp = timestamp;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      endpoint: this.endpoint,
      method: this.method,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

// Penggunaan
async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new APIError('Request gagal', {
        statusCode: response.status,
        endpoint,
        method: 'GET'
      });
    }
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      console.error('API Error:', error.toJSON());
    }
    throw error;
  }
}
```

## Error Handling dalam Asynchronous Code

### Callback Pattern

```javascript
function readFileAsync(path, callback) {
  setTimeout(() => {
    const files = {
      'data.txt': 'Konten file',
      'config.json': '{"port": 3000}'
    };
    
    if (files[path]) {
      callback(null, files[path]);
    } else {
      callback(new Error(`File ${path} tidak ditemukan`), null);
    }
  }, 100);
}

// Penggunaan dengan error handling
readFileAsync('data.txt', (error, data) => {
  if (error) {
    console.error('Error membaca file:', error.message);
    return;
  }
  console.log('Data:', data);
});
```

### Promise

```javascript
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject(new ValidationError('User ID harus lebih dari 0'));
      } else if (userId > 100) {
        reject(new NotFoundError('User'));
      } else {
        resolve({ id: userId, name: 'John Doe' });
      }
    }, 100);
  });
}

// Dengan .catch()
fetchUserData(150)
  .then(user => console.log(user))
  .catch(error => {
    if (error instanceof NotFoundError) {
      console.log('User tidak ditemukan');
    } else if (error instanceof ValidationError) {
      console.log('Validasi gagal:', error.message);
    } else {
      console.error('Error:', error);
    }
  });

// Dengan .then() dua parameter
fetchUserData(-1).then(
  user => console.log(user),
  error => console.log('Error:', error.message)
);
```

### Async/Await

```javascript
async function getUserWithPosts(userId) {
  try {
    const user = await fetchUserData(userId);
    const posts = await fetchUserPosts(userId);
    return { user, posts };
  } catch (error) {
    // Tangani error spesifik
    if (error instanceof NotFoundError) {
      console.log('User tidak ditemukan, redirect ke halaman login');
      return null;
    }
    
    // Re-throw error lainnya
    throw error;
  }
}

// Penggunaan
try {
  const result = await getUserWithPosts(1);
  console.log(result);
} catch (error) {
  console.error('Error tidak tertangani:', error);
}

// Multiple async operations dengan error handling individual
async function processMultipleUsers(userIds) {
  const results = await Promise.allSettled(
    userIds.map(async (id) => {
      try {
        return await fetchUserData(id);
      } catch (error) {
        console.error(`Error fetching user ${id}:`, error.message);
        return null;
      }
    })
  );
  
  return results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)
    .filter(user => user !== null);
}
```

## Debugging Techniques

### Console Methods

```javascript
const data = { name: 'John', age: 30, items: [1, 2, 3] };

// console.log - Output umum
console.log('Data:', data);

// console.info - Informasi
console.info('Aplikasi dimulai');

// console.warn - Peringatan
console.warn('Fitur ini akan deprecated');

// console.error - Error
console.error('Terjadi kesalahan');

// console.table - Tabel untuk array/object
console.table(data);
console.table([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]);

// console.dir - Detail object
console.dir(document.body);

// console.group - Grouping output
console.group('User Data');
console.log('Name:', data.name);
console.log('Age:', data.age);
console.groupEnd();

// console.time - Timing
console.time('Operasi');
// ... operasi berat
console.timeEnd('Operasi');

// console.assert - Assertion
console.assert(data.age > 18, 'User harus di atas 18 tahun');

// console.trace - Stack trace
function a() { b(); }
function b() { c(); }
function c() { console.trace('Trace dari sini'); }
a();

// console.count - Counter
console.count('Iterasi');
console.count('Iterasi');
console.countReset('Iterasi');
```

### Debugger Statement

```javascript
function calculateTotal(items) {
  let total = 0;
  
  for (const item of items) {
    // Eksekusi akan pause di sini jika DevTools terbuka
    debugger;
    
    total += item.price * item.quantity;
  }
  
  return total;
}

// Conditional debugger
function processData(data) {
  if (data.error) {
    debugger; // Hanya pause jika ada error
  }
  return data.value;
}
```

### Stack Trace

```javascript
function functionA() {
  functionB();
}

function functionB() {
  functionC();
}

function functionC() {
  const error = new Error('Terjadi error');
  console.log(error.stack);
  /* Output:
    Error: Terjadi error
        at functionC (<anonymous>:10:17)
        at functionB (<anonymous>:6:3)
        at functionA (<anonymous>:2:3)
        at <anonymous>:13:1
  */
}

functionA();
```

## Error Boundary (React Pattern)

```javascript
// Konsep Error Boundary untuk vanilla JS
class ErrorBoundary {
  constructor(component) {
    this.component = component;
    this.hasError = false;
  }
  
  static wrap(fn, errorHandler) {
    return function(...args) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        errorHandler(error);
        return null;
      }
    };
  }
  
  static asyncWrap(fn, errorHandler) {
    return async function(...args) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        errorHandler(error);
        return null;
      }
    };
  }
}

// Penggunaan
const safeParseJSON = ErrorBoundary.wrap(
  JSON.parse,
  (error) => console.error('JSON Parse Error:', error.message)
);

const data = safeParseJSON('invalid json'); // Tidak throw error
```

## Global Error Handling

### Window.onerror

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global Error:', {
    message,
    source,
    lineno,
    colno,
    error: error?.stack
  });
  
  // Kirim ke error tracking service
  reportError({
    message,
    source,
    lineno,
    colno,
    stack: error?.stack,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
  
  // Return true untuk mencegah default browser error handling
  return true;
};
```

### Unhandled Promise Rejection

```javascript
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  
  // Log atau report error
  reportError({
    type: 'unhandledrejection',
    reason: event.reason,
    stack: event.reason?.stack
  });
  
  // Prevent default handling
  event.preventDefault();
});

// Rejection yang ditangani kemudian
window.addEventListener('rejectionhandled', function(event) {
  console.log('Promise rejection ditangani:', event.reason);
});
```

## Best Practices

### 1. Fail Fast

```javascript
// ✅ Validasi di awal function
function processPayment(amount, currency) {
  // Fail fast
  if (!amount || amount <= 0) {
    throw new ValidationError('Jumlah pembayaran tidak valid');
  }
  
  if (!currency) {
    throw new ValidationError('Mata uang harus ditentukan');
  }
  
  const validCurrencies = ['IDR', 'USD', 'EUR'];
  if (!validCurrencies.includes(currency)) {
    throw new ValidationError(`Mata uang ${currency} tidak didukung`);
  }
  
  // Lanjutkan proses...
}
```

### 2. Error Messages yang Informatif

```javascript
// ❌ Error message yang kurang informatif
throw new Error('Error');

// ✅ Error message yang deskriptif
throw new Error(`Failed to fetch user with ID ${userId}: User not found in database`);

// ✅ Dengan context tambahan
class BusinessError extends Error {
  constructor(message, context) {
    super(message);
    this.context = context;
  }
}

throw new BusinessError(
  'Order processing failed',
  { orderId: 123, userId: 456, step: 'payment' }
);
```

### 3. Jangan Swallow Errors

```javascript
// ❌ Menelan error tanpa handling
try {
  riskyOperation();
} catch (e) {
  // Kosong! Error hilang tanpa jejak
}

// ✅ Minimal log error
try {
  riskyOperation();
} catch (e) {
  console.error('Operation failed:', e);
  // Atau re-throw
  throw e;
}

// ✅ Handle dengan proper fallback
try {
  const data = fetchData();
} catch (e) {
  console.error('Fetch failed, using cache:', e);
  return getFromCache();
}
```

### 4. Gunakan Error Monitoring Tools

```javascript
// Integrasi dengan Sentry/Rollbar/Bugsnag
class ErrorReporter {
  static capture(error, context = {}) {
    console.error('Error captured:', error);
    
    // Kirim ke monitoring service
    if (window.Sentry) {
      Sentry.captureException(error, {
        extra: context
      });
    }
    
    // Log ke server
    this.logToServer({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }
  
  static logToServer(data) {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(e => console.error('Failed to log error:', e));
  }
}

// Penggunaan
try {
  await riskyOperation();
} catch (error) {
  ErrorReporter.capture(error, { userId: 123, action: 'checkout' });
}
```

### 5. Graceful Degradation

```javascript
async function loadFeature(featureName) {
  try {
    const module = await import(`./features/${featureName}.js`);
    return module.default;
  } catch (error) {
    console.warn(`Feature ${featureName} tidak tersedia, menggunakan fallback`);
    
    // Fallback behavior
    return {
      render: () => {
        console.log('Feature tidak tersedia');
        return null;
      }
    };
  }
}
```

## Kesimpulan

Error handling dan debugging adalah aspek krusial dalam pengembangan aplikasi JavaScript yang robust. Poin-poin penting:

- Gunakan custom error classes untuk error yang lebih deskriptif
- Implementasikan try...catch di tempat yang strategis
- Manfaatkan console methods untuk debugging efektif
- Gunakan debugger statement untuk investigasi mendalam
- Implementasikan global error handling untuk error yang tidak tertangani
- Selalu log error untuk monitoring dan debugging
- Terapkan graceful degradation untuk fitur non-kritis

Dengan menguasai teknik-teknik ini, Anda dapat membangun aplikasi yang lebih stabil, mudah di-debug, dan memberikan pengalaman pengguna yang lebih baik.
