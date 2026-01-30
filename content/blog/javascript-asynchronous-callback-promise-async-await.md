---
title: "JavaScript Asynchronous: Callback, Promise, Async/Await"
date: "2026-02-03T00:00:00.000Z"
description: "Panduan lengkap pemrograman asynchronous JavaScript mulai dari callback, Promise, hingga async/await dengan contoh praktis dalam bahasa Indonesia"
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# JavaScript Asynchronous: Callback, Promise, Async/Await

JavaScript adalah bahasa pemrograman single-threaded yang berarti hanya dapat mengeksekusi satu tugas pada satu waktu. Namun, dengan kemampuan asynchronous programming, JavaScript dapat menangani operasi yang membutuhkan waktu (seperti request API, membaca file, atau timer) tanpa memblokir eksekusi kode lainnya. Artikel ini akan membahas tiga pendekatan utama dalam penanganan operasi asynchronous: Callback, Promise, dan Async/Await.

## Memahami JavaScript Asynchronous

### Synchronous vs Asynchronous

```javascript
// Contoh kode Synchronous (Blocking)
console.log("Mulai");
const hasil = operasiBerat(); // Memblokir eksekusi sampai selesai
console.log(hasil);
console.log("Selesai");

// Contoh kode Asynchronous (Non-blocking)
console.log("Mulai");
operasiAsync(() => {
  console.log("Operasi selesai");
});
console.log("Lanjut eksekusi tanpa menunggu");
console.log("Selesai");
```

### Call Stack dan Event Loop

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");

// Output:
// 1
// 3
// 2

// Meski timeout 0ms, callback masuk ke Event Loop
// dan dieksekusi setelah call stack kosong
```

## Callback Functions

Callback adalah function yang dipassing sebagai argument ke function lain dan dieksekusi setelah operasi selesai.

### Callback Dasar

```javascript
function prosesData(data, callback) {
  console.log("Memproses data...");
  setTimeout(() => {
    const hasil = data.toUpperCase();
    callback(hasil);
  }, 1000);
}

prosesData("hello world", function(hasil) {
  console.log("Hasil:", hasil);
});
// Output setelah 1 detik: Hasil: HELLO WORLD
```

### Callback dengan Error Handling

```javascript
function bacaFile(namaFile, callback) {
  setTimeout(() => {
    const files = {
      "data.txt": "Ini adalah konten file",
      "config.json": '{"port": 3000}'
    };
    
    if (files[namaFile]) {
      callback(null, files[namaFile]);
    } else {
      callback(new Error(`File ${namaFile} tidak ditemukan`), null);
    }
  }, 500);
}

// Penggunaan dengan error handling
bacaFile("data.txt", (error, data) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log("Data:", data);
});

bacaFile("tidak-ada.txt", (error, data) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log("Data:", data);
});
```

### Callback Hell (Pyramid of Doom)

```javascript
// Contoh callback yang terlalu banyak bersarang
function autentikasiUser(username, password, callback) {
  setTimeout(() => {
    if (username === "admin" && password === "123") {
      callback(null, { id: 1, username: "admin" });
    } else {
      callback(new Error("Login gagal"), null);
    }
  }, 500);
}

function ambilDataUser(userId, callback) {
  setTimeout(() => {
    callback(null, { id: userId, nama: "John Doe", email: "john@example.com" });
  }, 500);
}

function ambilPesananUser(userId, callback) {
  setTimeout(() => {
    callback(null, [
      { id: 1, total: 150000 },
      { id: 2, total: 230000 }
    ]);
  }, 500);
}

// Callback Hell - sulit dibaca dan dipelihara
autentikasiUser("admin", "123", (err, user) => {
  if (err) {
    console.error(err);
    return;
  }
  
  ambilDataUser(user.id, (err, dataUser) => {
    if (err) {
      console.error(err);
      return;
    }
    
    ambilPesananUser(user.id, (err, pesanan) => {
      if (err) {
        console.error(err);
        return;
      }
      
      console.log("Data User:", dataUser);
      console.log("Pesanan:", pesanan);
    });
  });
});
```

## Promise

Promise adalah object yang merepresentasikan hasil dari operasi asynchronous yang belum selesai, tetapi akan menghasilkan nilai di masa depan.

### Membuat Promise

```javascript
const janji = new Promise((resolve, reject) => {
  const berhasil = true;
  
  if (berhasil) {
    resolve("Operasi berhasil!");
  } else {
    reject(new Error("Operasi gagal!"));
  }
});

// Menggunakan Promise
janji
  .then(hasil => {
    console.log(hasil);
  })
  .catch(error => {
    console.error(error.message);
  });
```

### Promise dengan Operasi Asynchronous

```javascript
function unduhData(url) {
  return new Promise((resolve, reject) => {
    console.log(`Mengunduh data dari ${url}...`);
    
    setTimeout(() => {
      const sukses = Math.random() > 0.3; // 70% chance sukses
      
      if (sukses) {
        resolve({
          url: url,
          data: "Data dari server",
          ukuran: 1024,
          waktu: new Date().toISOString()
        });
      } else {
        reject(new Error(`Gagal mengunduh dari ${url}`));
      }
    }, 1500);
  });
}

// Penggunaan
unduhData("https://api.example.com/data")
  .then(response => {
    console.log("Berhasil:", response);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
```

### Promise Chaining

```javascript
function prosesLangkah1(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Langkah 1 selesai");
      resolve({ ...data, langkah1: true });
    }, 500);
  });
}

function prosesLangkah2(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Langkah 2 selesai");
      resolve({ ...data, langkah2: true });
    }, 500);
  });
}

function prosesLangkah3(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Langkah 3 selesai");
      resolve({ ...data, langkah3: true });
    }, 500);
  });
}

// Chaining Promise - lebih rapi dari callback hell
prosesLangkah1({ mulai: true })
  .then(data => prosesLangkah2(data))
  .then(data => prosesLangkah3(data))
  .then(data => {
    console.log("Semua langkah selesai:", data);
  })
  .catch(error => {
    console.error("Terjadi error:", error);
  });

// Output:
// Langkah 1 selesai
// Langkah 2 selesai
// Langkah 3 selesai
// Semua langkah selesai: { mulai: true, langkah1: true, langkah2: true, langkah3: true }
```

### Promise.all()

```javascript
function ambilDataUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, nama: `User ${id}` }), 500);
  });
}

function ambilDataProduk(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, nama: `Produk ${id}`, harga: 100000 * id }), 500);
  });
}

function ambilDataPesanan(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, total: 500000 * id }), 500);
  });
}

// Menjalankan multiple Promise secara paralel
Promise.all([
  ambilDataUser(1),
  ambilDataProduk(1),
  ambilDataPesanan(1)
])
  .then(([user, produk, pesanan]) => {
    console.log("User:", user);
    console.log("Produk:", produk);
    console.log("Pesanan:", pesanan);
  })
  .catch(error => {
    console.error("Salah satu Promise gagal:", error);
  });
```

### Promise.race()

```javascript
function requestCepat() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Response cepat"), 500);
  });
}

function requestLambat() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Response lambat"), 2000);
  });
}

function requestTimeout() {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout!")), 1000);
  });
}

// Mengambil Promise yang selesai pertama
Promise.race([requestCepat(), requestLambat()])
  .then(hasil => {
    console.log("Pemenang:", hasil);
    // Output: Pemenang: Response cepat
  });

// Implementasi timeout
Promise.race([requestLambat(), requestTimeout()])
  .then(hasil => console.log(hasil))
  .catch(error => console.error(error.message));
  // Output: Timeout!
```

### Promise.allSettled()

```javascript
const promises = [
  Promise.resolve("Sukses 1"),
  Promise.reject(new Error("Gagal 1")),
  Promise.resolve("Sukses 2"),
  Promise.reject(new Error("Gagal 2"))
];

Promise.allSettled(promises)
  .then(hasil => {
    hasil.forEach((item, index) => {
      if (item.status === "fulfilled") {
        console.log(`Promise ${index}: Sukses -`, item.value);
      } else {
        console.log(`Promise ${index}: Gagal -`, item.reason.message);
      }
    });
  });

// Output:
// Promise 0: Sukses - Sukses 1
// Promise 1: Gagal - Gagal 1
// Promise 2: Sukses - Sukses 2
// Promise 3: Gagal - Gagal 2
```

## Async/Await

Async/Await adalah sintaks yang diperkenalkan di ES2017 untuk menulis kode asynchronous dengan cara yang lebih mirip synchronous, membuatnya lebih mudah dibaca dan dipelihara.

### Sintaks Dasar

```javascript
// Function dengan keyword async selalu mengembalikan Promise
async function namaFunction() {
  // Keyword await hanya bisa digunakan di dalam async function
  const hasil = await promise;
  return hasil;
}
```

### Contoh Penggunaan

```javascript
function ambilDataDariServer(endpoint) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = {
        "/users": [{ id: 1, nama: "John" }, { id: 2, nama: "Jane" }],
        "/products": [{ id: 1, nama: "Laptop" }, { id: 2, nama: "Mouse" }]
      };
      
      if (data[endpoint]) {
        resolve(data[endpoint]);
      } else {
        reject(new Error(`Endpoint ${endpoint} tidak ditemukan`));
      }
    }, 1000);
  });
}

// Menggunakan async/await
async function tampilkanData() {
  try {
    console.log("Mengambil data users...");
    const users = await ambilDataDariServer("/users");
    console.log("Users:", users);
    
    console.log("Mengambil data products...");
    const products = await ambilDataDariServer("/products");
    console.log("Products:", products);
    
    return { users, products };
  } catch (error) {
    console.error("Terjadi error:", error.message);
    throw error;
  }
}

// Memanggil async function
tampilkanData()
  .then(data => console.log("Semua data:", data))
  .catch(error => console.error("Error final:", error));
```

### Error Handling dengan Try/Catch

```javascript
async function prosesPembayaran(userId, jumlah) {
  try {
    // Validasi
    if (jumlah <= 0) {
      throw new Error("Jumlah pembayaran harus lebih dari 0");
    }
    
    // Simulasi cek saldo
    const saldo = await cekSaldo(userId);
    
    if (saldo < jumlah) {
      throw new Error("Saldo tidak mencukupi");
    }
    
    // Proses pembayaran
    const hasil = await lakukanPembayaran(userId, jumlah);
    
    // Kirim notifikasi
    await kirimNotifikasi(userId, `Pembayaran Rp ${jumlah} berhasil`);
    
    return hasil;
    
  } catch (error) {
    console.error("Pembayaran gagal:", error.message);
    // Re-throw error agar bisa ditangani di level lebih tinggi
    throw error;
  }
}

function cekSaldo(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve(1000000), 500);
  });
}

function lakukanPembayaran(userId, jumlah) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ 
      id: Math.random().toString(36), 
      jumlah, 
      waktu: new Date() 
    }), 500);
  });
}

function kirimNotifikasi(userId, pesan) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ userId, pesan, terkirim: true }), 300);
  });
}

// Penggunaan
prosesPembayaran(1, 500000)
  .then(hasil => console.log("Sukses:", hasil))
  .catch(error => console.error("Gagal:", error.message));
```

### Sequential vs Parallel dengan Async/Await

```javascript
// Sequential - menunggu satu per satu
async function ambilDataSequential() {
  console.time("Sequential");
  
  const user = await ambilDataDariServer("/users");
  const product = await ambilDataDariServer("/products");
  const order = await ambilDataDariServer("/orders");
  
  console.timeEnd("Sequential");
  return { user, product, order };
}

// Parallel - menjalankan bersamaan
async function ambilDataParallel() {
  console.time("Parallel");
  
  const [user, product, order] = await Promise.all([
    ambilDataDariServer("/users"),
    ambilDataDariServer("/products"),
    ambilDataDariServer("/orders")
  ]);
  
  console.timeEnd("Parallel");
  return { user, product, order };
}

// Penggunaan
ambilDataSequential(); // Lebih lambat (~3 detik)
ambilDataParallel();   // Lebih cepat (~1 detik)
```

### Async/Await dengan Loop

```javascript
// Sequential loop dengan for...of
async function prosesDataSequential(dataArray) {
  const hasil = [];
  
  for (const item of dataArray) {
    const processed = await prosesItem(item);
    hasil.push(processed);
  }
  
  return hasil;
}

// Parallel loop dengan Promise.all dan map
async function prosesDataParallel(dataArray) {
  const promises = dataArray.map(item => prosesItem(item));
  const hasil = await Promise.all(promises);
  return hasil;
}

function prosesItem(item) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ...item, diproses: true, waktu: new Date() });
    }, 500);
  });
}

// Penggunaan
const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
prosesDataSequential(data).then(console.log); // Sequential
prosesDataParallel(data).then(console.log);    // Parallel
```

## Konversi Callback ke Promise

### Manual Promisification

```javascript
// Callback-style function
function bacaFileCallback(namaFile, callback) {
  setTimeout(() => {
    if (namaFile.endsWith(".txt")) {
      callback(null, `Konten file ${namaFile}`);
    } else {
      callback(new Error("Format file tidak didukung"), null);
    }
  }, 500);
}

// Konversi ke Promise
function bacaFilePromise(namaFile) {
  return new Promise((resolve, reject) => {
    bacaFileCallback(namaFile, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

// Penggunaan dengan async/await
async function bacaBeberapaFile(files) {
  try {
    for (const file of files) {
      const konten = await bacaFilePromise(file);
      console.log(konten);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

bacaBeberapaFile(["data1.txt", "data2.txt", "data3.pdf"]);
```

### Util.promisify (Node.js)

```javascript
const util = require('util');
const fs = require('fs');

// Konversi callback-based API ke Promise
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function prosesFile() {
  try {
    const data = await readFileAsync('input.txt', 'utf8');
    const processed = data.toUpperCase();
    await writeFileAsync('output.txt', processed);
    console.log("File berhasil diproses");
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## Praktik Terbaik

### 1. Hindari Callback Hell dengan Promise atau Async/Await

```javascript
// ❌ Jangan lakukan ini (Callback Hell)
getData(id, (err, data) => {
  if (err) { /* handle */ }
  processData(data, (err, processed) => {
    if (err) { /* handle */ }
    saveData(processed, (err, saved) => {
      if (err) { /* handle */ }
      // ... dan seterusnya
    });
  });
});

// ✅ Lakukan ini dengan async/await
try {
  const data = await getData(id);
  const processed = await processData(data);
  const saved = await saveData(processed);
} catch (error) {
  console.error(error);
}
```

### 2. Selalu Handle Error

```javascript
// ❌ Tanpa error handling
const data = await fetchData();

// ✅ Dengan error handling
try {
  const data = await fetchData();
} catch (error) {
  console.error("Gagal mengambil data:", error);
  // Fallback atau retry logic
}

// ✅ Atau dengan .catch()
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3. Gunakan Promise.all untuk Operasi Paralel

```javascript
// ❌ Sequential (lambat)
const user = await getUser();
const posts = await getPosts();
const comments = await getComments();

// ✅ Parallel (cepat)
const [user, posts, comments] = await Promise.all([
  getUser(),
  getPosts(),
  getComments()
]);
```

### 4. Implementasikan Timeout

```javascript
function denganTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout setelah ${ms}ms`)), ms);
  });
  
  return Promise.race([promise, timeout]);
}

// Penggunaan
try {
  const data = await denganTimeout(fetchData(), 5000);
} catch (error) {
  console.error("Request timeout atau error:", error.message);
}
```

### 5. Gunakan Promise.allSettled untuk Multiple Request

```javascript
// ✅ Mendapatkan hasil semua Promise meski ada yang gagal
const hasil = await Promise.allSettled([
  fetchUser(),
  fetchPosts(),
  fetchComments()
]);

hasil.forEach((item, index) => {
  if (item.status === "fulfilled") {
    console.log(`Request ${index} sukses:`, item.value);
  } else {
    console.error(`Request ${index} gagal:`, item.reason);
  }
});
```

## Kesimpulan

Pemrograman asynchronous adalah konsep fundamental dalam JavaScript modern. Perkembangan dari Callback ke Promise hingga Async/Await menunjukkan evolusi JavaScript dalam menangani operasi asynchronous:

- **Callback**: Pendekatan dasar, namun bisa menyebabkan callback hell
- **Promise**: Solusi yang lebih rapi dengan chaining dan error handling yang lebih baik
- **Async/Await**: Sintaks yang paling mudah dibaca dan dipelihara, terutama untuk kode yang kompleks

Pemahaman mendalam tentang ketiga pendekatan ini sangat penting untuk mengembangkan aplikasi JavaScript yang efisien, terutama saat bekerja dengan API, database, file system, atau operasi I/O lainnya.
