---
title: "JavaScript Dasar: Panduan Lengkap untuk Pemula"
date: 2026-01-30T00:00:00.000Z
description: "Pelajari fundamental JavaScript dari nol. Panduan lengkap untuk pemula yang mencakup variabel, tipe data, operator, dan konsep dasar lainnya."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

JavaScript adalah bahasa pemrograman yang paling populer di dunia web. Setiap website modern menggunakan JavaScript untuk membuat halaman menjadi interaktif dan dinamis. Jika kamu baru memulai perjalanan programming, JavaScript adalah pilihan yang sempurna karena mudah dipelajari dan memiliki komunitas yang sangat besar.

## Apa itu JavaScript?

JavaScript dibuat oleh Brendan Eich pada tahun 1995 dalam waktu hanya 10 hari. Awalnya bernama Mocha, kemudian LiveScript, dan akhirnya menjadi JavaScript. Meskipun namanya mirip dengan Java, keduanya adalah bahasa yang sangat berbeda.

JavaScript adalah bahasa pemrograman yang:
- **High-level**: Kamu tidak perlu mengelola memori secara manual
- **Just-in-time compiled**: Kode di-compile saat runtime untuk performa optimal
- **Multi-paradigm**: Mendukung programming style functional, object-oriented, dan event-driven
- **Single-threaded**: Menjalankan satu task pada satu waktu dengan event loop

## Menyiapkan Environment

Sebelum mulai coding, kamu perlu menyiapkan environment. Ada beberapa cara:

### 1. Browser Console (Cepat untuk Testing)
Buka browser apa saja, tekan F12, lalu pilih tab Console. Kamu bisa langsung menulis kode JavaScript di sana.

### 2. Node.js (Untuk Development Serius)
Install Node.js dari nodejs.org, kemudian buat file dengan ekstensi `.js` dan jalankan dengan command:

```bash
node namafile.js
```

### 3. Code Editor
Gunakan VS Code, WebStorm, atau editor lainnya dengan ekstensi JavaScript untuk pengalaman development yang lebih baik.

## Variabel dan Tipe Data

Variabel adalah container untuk menyimpan data. Di JavaScript modern, gunakan `let` dan `const`:

```javascript
// const untuk nilai yang tidak berubah
const nama = "Budi";
const PI = 3.14159;

// let untuk nilai yang bisa berubah
let umur = 25;
umur = 26; // ✅ Bisa diubah

// ❌ Jangan gunakan var (deprecated)
var oldWay = "jangan pakai ini";
```

### Tipe Data Primitif

JavaScript memiliki 7 tipe data primitif:

```javascript
// 1. String - teks
const nama = "John Doe";
const pesan = 'Hello World';
const template = `Halo ${nama}`; // Template literal

// 2. Number - angka (integer dan float)
const umur = 25;
const harga = 99.99;
const infinity = Infinity;
const notANumber = NaN;

// 3. Boolean - true/false
const isActive = true;
const isDeleted = false;

// 4. Undefined - belum didefinisikan
let belumDiisi;
console.log(belumDiisi); // undefined

// 5. Null - sengaja kosong
const data = null;

// 6. Symbol - identifier unik
const id = Symbol('id');

// 7. BigInt - angka besar
const besar = 123456789012345678901234567890n;
```

### Typeof Operator

Gunakan `typeof` untuk mengecek tipe data:

```javascript
console.log(typeof "Hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (bug historis!)
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"
console.log(typeof function(){}); // "function"
```

## Operator

### Operator Aritmatika

```javascript
const a = 10;
const b = 3;

console.log(a + b);  // 13 (penjumlahan)
console.log(a - b);  // 7 (pengurangan)
console.log(a * b);  // 30 (perkalian)
console.log(a / b);  // 3.333... (pembagian)
console.log(a % b);  // 1 (modulo/sisa bagi)
console.log(a ** b); // 1000 (pangkat)

// Increment dan Decrement
let count = 0;
count++; // count = 1 (post-increment)
++count; // count = 2 (pre-increment)
count--; // count = 1 (decrement)
```

### Operator Perbandingan

```javascript
// Loose equality (==) - hati-hati!
console.log(5 == "5");   // true (type coercion)
console.log(0 == false); // true

// Strict equality (===) - selalu gunakan ini!
console.log(5 === "5");  // false (tipe berbeda)
console.log(5 === 5);    // true

// Perbandingan lainnya
console.log(10 > 5);     // true
console.log(10 < 5);     // false
console.log(10 >= 10);   // true
console.log(10 <= 9);    // false
console.log(10 !== "10"); // true
```

### Operator Logika

```javascript
const isLoggedIn = true;
const isAdmin = false;

// AND (&&) - kedua kondisi harus true
console.log(isLoggedIn && isAdmin); // false

// OR (||) - salah satu kondisi true
console.log(isLoggedIn || isAdmin); // true

// NOT (!) - negasi
console.log(!isLoggedIn); // false

// Short-circuit evaluation
const user = null;
const username = user || "Guest"; // "Guest"

// Optional chaining
const data = { user: { name: "John" } };
console.log(data?.user?.name); // "John"
console.log(data?.profile?.age); // undefined (tidak error)
```

## String dan Metode String

String adalah tipe data untuk teks. JavaScript memiliki banyak metode bawaan:

```javascript
const text = "Hello, World!";

// Property
console.log(text.length); // 13

// Mengubah case
console.log(text.toUpperCase()); // "HELLO, WORLD!"
console.log(text.toLowerCase()); // "hello, world!"

// Mencari substring
console.log(text.indexOf("World")); // 7
console.log(text.includes("Hello")); // true
console.log(text.startsWith("Hello")); // true
console.log(text.endsWith("!")); // true

// Mengambil substring
console.log(text.slice(0, 5)); // "Hello"
console.log(text.substring(7, 12)); // "World"
console.log(text.substr(7, 5)); // "World" (deprecated)

// Replace
console.log(text.replace("World", "JavaScript")); // "Hello, JavaScript!"

// Split dan Join
const words = text.split(", "); // ["Hello", "World!"]
const joined = words.join(" - "); // "Hello - World!"

// Trim (menghapus whitespace)
const padded = "   Hello   ";
console.log(padded.trim()); // "Hello"
console.log(padded.trimStart()); // "Hello   "
console.log(padded.trimEnd()); // "   Hello"

// Template Literals (ES6+)
const name = "Alice";
const age = 30;
const greeting = `Halo, nama saya ${name} dan saya ${age} tahun.`;
// Multi-line string
const html = `
  <div>
    <h1>${name}</h1>
    <p>Umur: ${age}</p>
  </div>
`;
```

## Number dan Math

```javascript
// Konversi string ke number
const str = "42";
console.log(Number(str)); // 42
console.log(parseInt("42px")); // 42
console.log(parseFloat("3.14")); // 3.14
console.log(+("42")); // 42 (unary plus)

// Konversi number ke string
const num = 42;
console.log(String(num)); // "42"
console.log(num.toString()); // "42"
console.log(num.toString(2)); // "101010" (binary)

// Memeriksa number
console.log(Number.isNaN(NaN)); // true
console.log(Number.isFinite(42)); // true
console.log(Number.isInteger(42.0)); // true

// Pembulatan
console.log(Math.round(3.7)); // 4
console.log(Math.floor(3.7)); // 3
console.log(Math.ceil(3.2)); // 4
console.log(Math.trunc(3.7)); // 3

// Math utilities
console.log(Math.random()); // 0.0 - 1.0
console.log(Math.max(1, 5, 3)); // 5
console.log(Math.min(1, 5, 3)); // 1
console.log(Math.abs(-42)); // 42
console.log(Math.sqrt(16)); // 4
console.log(Math.pow(2, 3)); // 8

// Random integer antara min dan max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(randomInt(1, 10)); // 1-10

// Format number
const price = 1234567.89;
console.log(price.toFixed(2)); // "1234567.89"
console.log(price.toLocaleString('id-ID')); // "1.234.567,89"
```

## Control Flow: If/Else

Control flow mengatur eksekusi kode berdasarkan kondisi:

```javascript
const age = 18;

// If sederhana
if (age >= 18) {
  console.log("Dewasa");
}

// If-else
if (age >= 18) {
  console.log("Dewasa");
} else {
  console.log("Anak-anak");
}

// If-else if-else
const score = 85;
if (score >= 90) {
  console.log("Grade A");
} else if (score >= 80) {
  console.log("Grade B");
} else if (score >= 70) {
  console.log("Grade C");
} else if (score >= 60) {
  console.log("Grade D");
} else {
  console.log("Grade F");
}

// Ternary operator (shorthand if-else)
const status = age >= 18 ? "Dewasa" : "Anak-anak";

// Nested ternary (gunakan dengan hati-hati)
const category = age < 13 ? "Anak-anak" : 
                 age < 20 ? "Remaja" : 
                 age < 60 ? "Dewasa" : "Lansia";

// Truthy dan Falsy
// Falsy: false, 0, "", null, undefined, NaN
// Truthy: everything else
const value = "";
if (value) {
  console.log("Truthy");
} else {
  console.log("Falsy"); // Ini yang dijalankan
}
```

## Switch Statement

Switch adalah alternatif untuk multiple if-else:

```javascript
const day = 3;
let dayName;

switch (day) {
  case 1:
    dayName = "Senin";
    break;
  case 2:
    dayName = "Selasa";
    break;
  case 3:
    dayName = "Rabu";
    break;
  case 4:
    dayName = "Kamis";
    break;
  case 5:
    dayName = "Jumat";
    break;
  case 6:
    dayName = "Sabtu";
    break;
  case 7:
    dayName = "Minggu";
    break;
  default:
    dayName = "Hari tidak valid";
}

console.log(dayName); // "Rabu"

// Multiple case (fall-through)
const grade = "B";
switch (grade) {
  case "A":
  case "B":
  case "C":
    console.log("Lulus");
    break;
  case "D":
  case "F":
    console.log("Tidak lulus");
    break;
  default:
    console.log("Grade tidak valid");
}
```

## Best Practices

### 1. Gunakan Strict Equality (===)
Selalu gunakan `===` dan `!==` untuk menghindari bug type coercion.

### 2. Deklarasikan Variabel di Awal Scope
```javascript
// ❌ Jangan
defunction example() {
  console.log(x); // undefined (hoisting)
  var x = 10;
}

// ✅ Do
function example() {
  const x = 10;
  console.log(x); // 10
}
```

### 3. Gunakan const Secara Default
Gunakan `const` kecuali kamu benar-benar perlu mengubah nilai.

### 4. Nama Variabel yang Deskriptif
```javascript
// ❌ Jangan
const x = 10;
const y = 20;

// ✅ Do
const width = 10;
const height = 20;
```

### 5. Hindari Global Variables
Semua variabel yang dideklarasikan tanpa `const`, `let`, atau `var` menjadi global.

## Kesimpulan

Kamu sudah mempelajari fundamental JavaScript:
- Variabel dengan `let` dan `const`
- 7 tipe data primitif
- Operator aritmatika, perbandingan, dan logika
- String manipulation
- Number dan Math utilities
- Control flow dengan if/else dan switch

Ini adalah fondasi yang kuat. Di tutorial berikutnya, kita akan membahas array, object, function, dan konsep lanjutan lainnya.

**Tips Belajar:**
1. Praktikkan setiap kode di console browser
2. Buat project kecil seperti kalkulator sederhana
3. Jangan hanya membaca, tulis kode sendiri
4. Gunakan debugger untuk memahami flow program

Selamat coding! 🚀
