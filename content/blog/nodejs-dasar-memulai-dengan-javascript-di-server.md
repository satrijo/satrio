---
title: "Node.js Dasar: Memulai dengan JavaScript di Server"
date: "2026-02-13T00:00:00.000Z"
description: "Panduan lengkap untuk memulai belajar Node.js dari nol. Pelajari dasar-dasar JavaScript di server-side, memahami event loop, modul sistem, dan membangun aplikasi pertama Anda dengan Node.js."
category: Node.js
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# Node.js Dasar: Memulai dengan JavaScript di Server

Node.js telah merevolusi cara pengembang membangun aplikasi web dengan memungkinkan JavaScript berjalan di sisi server. Artikel ini akan membimbing Anda dari nol hingga mampu membangun aplikasi Node.js pertama Anda.

## Apa Itu Node.js?

Node.js adalah runtime environment yang memungkinkan eksekusi kode JavaScript di luar browser. Dibangun di atas mesin V8 JavaScript milik Google Chrome, Node.js menyediakan arsitektur event-driven dan non-blocking I/O yang membuatnya ringan dan efisien.

Berbeda dengan bahasa server-side tradisional seperti PHP atau Ruby yang menggunakan model thread-per-request, Node.js menggunakan single-threaded event loop. Ini berarti Node.js dapat menangani ribuan koneksi simultan tanpa membebani memori sistem.

## Mengapa Memilih Node.js?

Ada beberapa alasan kuat mengapa Node.js menjadi pilihan populer:

**JavaScript Everywhere**: Dengan Node.js, Anda menggunakan satu bahasa untuk frontend dan backend. Ini mengurangi konteks switching dan memungkinkan code sharing antara client dan server.

**Performa Tinggi**: Berkat mesin V8 dan arsitektur non-blocking, Node.js mampu menangani beban tinggi dengan sumber daya yang lebih sedikit.

**Ekosistem yang Kaya**: NPM (Node Package Manager) menyediakan lebih dari 1 juta package yang dapat mempercepat pengembangan aplikasi Anda.

**Komunitas Besar**: Dokumentasi yang lengkap, tutorial melimpah, dan komunitas aktif membuat pembelajaran lebih mudah.

## Instalasi Node.js

Untuk memulai, Anda perlu menginstal Node.js di komputer Anda. Kunjungi [nodejs.org](https://nodejs.org) dan unduh versi LTS (Long Term Support) yang direkomendasikan.

Setelah instalasi selesai, verifikasi dengan perintah:

```bash
node --version
npm --version
```

Anda akan melihat versi Node.js dan NPM yang terinstal.

## Membuat Proyek Pertama

Buat direktori baru untuk proyek Anda dan inisialisasi proyek Node.js:

```bash
mkdir my-first-node-app
cd my-first-node-app
npm init -y
```

Perintah `npm init -y` akan membuat file `package.json` dengan konfigurasi default. File ini berisi metadata proyek dan daftar dependencies.

## Hello World dengan Node.js

Buat file `index.js` dengan konten berikut:

```javascript
console.log('Hello, Node.js!');
```

Jalankan dengan perintah:

```bash
node index.js
```

Anda akan melihat output "Hello, Node.js!" di terminal.

## Memahami Module System

Node.js menggunakan sistem modul CommonJS. Setiap file JavaScript dianggap sebagai modul terpisah. Untuk mengekspor fungsi atau variabel dari modul, gunakan `module.exports`:

```javascript
// math.js
function tambah(a, b) {
  return a + b;
}

function kurang(a, b) {
  return a - b;
}

module.exports = { tambah, kurang };
```

Untuk mengimpor modul, gunakan `require`:

```javascript
// app.js
const math = require('./math');

console.log(math.tambah(5, 3));  // Output: 8
console.log(math.kurang(5, 3));  // Output: 2
```

## Membangun HTTP Server

Salah satu fitur utama Node.js adalah kemampuannya membuat server web. Berikut contoh server HTTP sederhana:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Selamat datang di server Node.js!\n');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

Server ini akan merespons setiap request dengan pesan "Selamat datang di server Node.js!".

## Memahami Event Loop

Event loop adalah inti dari arsitektur Node.js. Ini memungkinkan Node.js melakukan operasi non-blocking I/O meskipun JavaScript itu sendiri single-threaded.

```javascript
console.log('Mulai');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('Selesai');
```

Outputnya akan:
```
Mulai
Selesai
Timeout 1
Timeout 2
```

Ini menunjukkan bahwa operasi asynchronous tidak memblokir eksekusi kode lain.

## File System Operations

Node.js menyediakan modul `fs` untuk bekerja dengan file system:

```javascript
const fs = require('fs');

// Membaca file secara synchronous
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// Membaca file secara asynchronous (direkomendasikan)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error membaca file:', err);
    return;
  }
  console.log(data);
});

// Menulis file
fs.writeFile('output.txt', 'Hello World!', (err) => {
  if (err) throw err;
  console.log('File berhasil disimpan!');
});
```

## Working with JSON

Node.js memiliki dukungan bawaan untuk JSON:

```javascript
const data = {
  nama: 'Budi',
  umur: 25,
  pekerjaan: 'Developer'
};

// Konversi objek ke JSON string
const jsonString = JSON.stringify(data, null, 2);
console.log(jsonString);

// Parse JSON string ke objek
const parsedData = JSON.parse(jsonString);
console.log(parsedData.nama); // Output: Budi
```

## Environment Variables

Environment variables berguna untuk menyimpan konfigurasi sensitif:

```javascript
// Menggunakan variabel lingkungan
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST || 'localhost';

console.log(`Server akan berjalan di port ${port}`);
console.log(`Database host: ${dbHost}`);
```

Anda dapat mengatur environment variables saat menjalankan aplikasi:

```bash
PORT=8080 DB_HOST=prod.db.com node app.js
```

Atau menggunakan file `.env` dengan package `dotenv`.

## Error Handling

Penanganan error yang baik sangat penting dalam aplikasi Node.js:

```javascript
// Try-catch untuk synchronous code
try {
  const data = JSON.parse(invalidJson);
} catch (error) {
  console.error('Error parsing JSON:', error.message);
}

// Error handling untuk asynchronous code dengan callback
fs.readFile('nonexistent.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('File tidak ditemukan:', err.message);
    return;
  }
  console.log(data);
});

// Error handling dengan Promise
const fsPromises = require('fs').promises;

async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Best Practices

Berikut beberapa best practices saat mengembangkan dengan Node.js:

1. **Gunakan Asynchronous API**: Hindari synchronous methods yang dapat memblokir event loop.

2. **Handle Errors Properly**: Selalu tangani error dan jangan biarkan aplikasi crash tanpa alasan.

3. **Gunakan Linter**: Tools seperti ESLint membantu menjaga kualitas kode.

4. **Struktur Proyek yang Baik**: Organisir kode dengan folder yang jelas seperti `routes/`, `controllers/`, `models/`, `utils/`.

5. **Gunakan Environment Variables**: Jangan hardcode konfigurasi sensitif di kode.

## Kesimpulan

Node.js membuka dunia baru bagi pengembang JavaScript dengan memungkinkan eksekusi di sisi server. Dengan memahami konsep dasar seperti module system, event loop, dan non-blocking I/O, Anda telah membangun fondasi yang kuat untuk pengembangan aplikasi yang lebih kompleks.

Langkah selanjutnya adalah mempelajari framework seperti Express.js untuk membangun REST API, berinteraksi dengan database, dan mengimplementasikan authentication. Tetapi dengan pemahaman dasar yang kuat dari artikel ini, Anda sudah siap untuk mengeksplorasi lebih jauh.

Selamat coding!
