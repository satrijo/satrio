---
title: "Function di JavaScript: Declaration, Expression, Arrow"
date: "2026-02-02T00:00:00.000Z"
description: "Pelajari perbedaan function declaration, function expression, dan arrow function dalam JavaScript beserta use case dan best practices"
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# Function di JavaScript: Declaration, Expression, Arrow

Function merupakan blok kode yang dirancang untuk melakukan tugas tertentu dan dapat dipanggil berulang kali. Dalam JavaScript, terdapat beberapa cara untuk mendefinisikan function, masing-masing dengan karakteristik dan use case yang berbeda. Artikel ini akan membahas tiga cara utama mendefinisikan function: Function Declaration, Function Expression, dan Arrow Function.

## Function Declaration

Function Declaration adalah cara paling tradisional untuk mendefinisikan function dalam JavaScript. Function yang dideklarasikan dengan cara ini memiliki karakteristik hoisting, yang berarti function dapat dipanggil sebelum dideklarasikan dalam kode.

### Sintaks Dasar

```javascript
function namaFunction(parameter1, parameter2) {
  // blok kode
  return nilai;
}
```

### Contoh Penggunaan

```javascript
// Function declaration sederhana
function sapaPengguna(nama) {
  return `Halo, ${nama}! Selamat datang.`;
}

console.log(sapaPengguna("Budi"));
// Output: Halo, Budi! Selamat datang.

// Function dengan multiple parameter
function hitungLuasPersegiPanjang(panjang, lebar) {
  return panjang * lebar;
}

console.log(hitungLuasPersegiPanjang(10, 5));
// Output: 50

// Function dengan default parameter
function buatPengguna(nama, umur = 18, aktif = true) {
  return {
    nama: nama,
    umur: umur,
    aktif: aktif
  };
}

console.log(buatPengguna("Ani"));
// Output: { nama: "Ani", umur: 18, aktif: true }

console.log(buatPengguna("Budi", 25, false));
// Output: { nama: "Budi", umur: 25, aktif: false }
```

### Karakteristik Function Declaration

#### 1. Hoisting

```javascript
// Function dipanggil SEBELUM dideklarasikan - BERHASIL
console.log(hitungVolumeKubus(5));
// Output: 125

function hitungVolumeKubus(sisi) {
  return Math.pow(sisi, 3);
}

// Function tetap bisa dipanggil setelah deklarasi
console.log(hitungVolumeKubus(3));
// Output: 27
```

#### 2. Function sebagai Object

```javascript
function salam() {
  console.log("Selamat pagi!");
}

// Function memiliki property dan method
console.log(salam.name); // Output: salam
console.log(salam.length); // Output: 0 (jumlah parameter)

// Menambahkan custom property
salam.bahasa = "Indonesia";
salam.deskripsi = "Function untuk menyapa";

console.log(salam.bahasa); // Output: Indonesia
```

#### 3. Function Scope

```javascript
let variabelGlobal = "Saya global";

function contohScope() {
  let variabelLokal = "Saya lokal";
  console.log(variabelGlobal); // Bisa akses global
  console.log(variabelLokal);  // Bisa akses lokal
}

contohScope();
// Output: Saya global
// Output: Saya lokal

console.log(variabelGlobal); // Output: Saya global
// console.log(variabelLokal); // Error! variabelLokal is not defined
```

## Function Expression

Function Expression mendefinisikan function dan menyimpannya ke dalam variabel. Berbeda dengan Function Declaration, Function Expression tidak dihoist, sehingga harus didefinisikan sebelum dipanggil.

### Sintaks Dasar

```javascript
const namaVariabel = function(parameter1, parameter2) {
  // blok kode
  return nilai;
};
```

### Contoh Penggunaan

```javascript
// Function expression sederhana
const hitungLuasLingkaran = function(jariJari) {
  return Math.PI * jariJari * jariJari;
};

console.log(hitungLuasLingkaran(7).toFixed(2));
// Output: 153.94

// Named function expression
const faktorial = function hitungFaktorial(n) {
  if (n <= 1) return 1;
  return n * hitungFaktorial(n - 1); // Bisa rekursi dengan nama internal
};

console.log(faktorial(5));
// Output: 120

// Function expression dengan callback
const prosesData = function(data, callback) {
  const hasil = data.map(callback);
  return hasil;
};

const angka = [1, 2, 3, 4, 5];
const hasilKaliDua = prosesData(angka, function(item) {
  return item * 2;
});

console.log(hasilKaliDua);
// Output: [2, 4, 6, 8, 10]
```

### Perbedaan dengan Function Declaration

```javascript
// Function Declaration - BISA dihoist
console.log(deklarasi());
function deklarasi() {
  return "Function Declaration";
}

// Function Expression - TIDAK BISA dihoist
// console.log(ekspresi()); // Error! Cannot access 'ekspresi' before initialization
const ekspresi = function() {
  return "Function Expression";
};
console.log(ekspresi()); // Baru bisa dipanggil setelah definisi
```

### Anonymous vs Named Function Expression

```javascript
// Anonymous function expression
const tambah = function(a, b) {
  return a + b;
};

// Named function expression
const kurang = function pengurangan(a, b) {
  // Nama 'pengurangan' hanya tersedia di dalam scope function
  console.log(pengurangan.name); // Output: pengurangan
  return a - b;
};

console.log(tambah.name); // Output: tambah (nama variabel)
console.log(kurang.name); // Output: pengurangan (nama function)

// console.log(pengurangan); // Error! pengurangan is not defined (di luar scope)
```

## Arrow Function

Arrow Function diperkenalkan di ES6 (ES2015) dan menyediakan sintaks yang lebih ringkas untuk menulis function expression. Arrow function juga memiliki perilaku `this` yang berbeda dibandingkan function biasa.

### Sintaks Dasar

```javascript
// Bentuk lengkap
const namaFunction = (parameter1, parameter2) => {
  // blok kode
  return nilai;
};

// Implicit return (tanpa kurung kurawal)
const namaFunction = (parameter) => nilai;

// Single parameter (tanpa tanda kurung)
const namaFunction = parameter => nilai;
```

### Contoh Penggunaan

```javascript
// Arrow function sederhana
const kaliDua = (angka) => angka * 2;
console.log(kaliDua(5)); // Output: 10

// Multiple parameter
const hitungLuasSegitiga = (alas, tinggi) => (alas * tinggi) / 2;
console.log(hitungLuasSegitiga(10, 8)); // Output: 40

// Multiple statement (perlu kurung kurawal dan return)
const prosesAngka = (angka) => {
  const hasil = angka * 2;
  const pesan = `Hasil: ${hasil}`;
  return pesan;
};
console.log(prosesAngka(7)); // Output: Hasil: 14

// Tanpa parameter
const tampilkanWaktu = () => {
  const sekarang = new Date();
  return sekarang.toLocaleTimeString('id-ID');
};
console.log(tampilkanWaktu()); // Output: 14:30:45 (contoh)

// Return object (perlu tanda kurung)
const buatPengguna = (nama, umur) => ({ nama, umur });
console.log(buatPengguna("Dewi", 22));
// Output: { nama: "Dewi", umur: 22 }
```

### Arrow Function dengan Array Method

```javascript
const produk = [
  { nama: "Laptop", harga: 10000000 },
  { nama: "Mouse", harga: 150000 },
  { nama: "Keyboard", harga: 500000 },
  { nama: "Monitor", harga: 2500000 }
];

// map()
const namaProduk = produk.map(item => item.nama);
console.log(namaProduk);
// Output: ["Laptop", "Mouse", "Keyboard", "Monitor"]

// filter()
const produkMurah = produk.filter(item => item.harga < 1000000);
console.log(produkMurah);
// Output: [{ nama: "Mouse", ... }, { nama: "Keyboard", ... }]

// reduce()
const totalHarga = produk.reduce((total, item) => total + item.harga, 0);
console.log(totalHarga); // Output: 13150000

// forEach()
produk.forEach((item, index) => {
  console.log(`${index + 1}. ${item.nama}: Rp ${item.harga.toLocaleString()}`);
});
```

### Arrow Function dan Konteks `this`

Perbedaan paling signifikan antara arrow function dan function biasa adalah bagaimana mereka menangani keyword `this`.

```javascript
// Function biasa - 'this' bergantung pada cara pemanggilan
const objekBiasa = {
  nama: "Objek Biasa",
  nilai: 42,
  tampilkanNilai: function() {
    console.log(`${this.nama}: ${this.nilai}`);
  },
  tampilkanDenganDelay: function() {
    setTimeout(function() {
      // 'this' di sini mengacu ke global object (window/browser)
      // atau undefined (strict mode), BUKAN objekBiasa
      console.log(this.nilai); // Output: undefined
    }, 100);
  }
};

objekBiasa.tampilkanNilai(); // Output: Objek Biasa: 42
objekBiasa.tampilkanDenganDelay(); // Output: undefined

// Solusi dengan arrow function
const objekArrow = {
  nama: "Objek Arrow",
  nilai: 100,
  tampilkanNilai: function() {
    console.log(`${this.nama}: ${this.nilai}`);
  },
  tampilkanDenganDelay: function() {
    setTimeout(() => {
      // Arrow function mewarisi 'this' dari scope parent
      console.log(`${this.nama}: ${this.nilai}`);
    }, 100);
  }
};

objekArrow.tampilkanDenganDelay(); 
// Output: Objek Arrow: 100 (setelah 100ms)
```

### Arrow Function dalam Class

```javascript
class Kalkulator {
  constructor() {
    this.hasil = 0;
  }

  // Method biasa
  tambah(angka) {
    this.hasil += angka;
    return this;
  }

  // Arrow function sebagai property
  kurang = (angka) => {
    this.hasil -= angka;
    return this;
  }

  // Arrow function untuk callback
  prosesArray = (arr, operasi) => {
    return arr.map(operasi);
  }

  getHasil() {
    return this.hasil;
  }
}

const calc = new Kalkulator();
calc.tambah(10).kurang(3);
console.log(calc.getHasil()); // Output: 7

const hasilKali = calc.prosesArray([1, 2, 3, 4], x => x * 2);
console.log(hasilKali); // Output: [2, 4, 6, 8]
```

## Perbandingan Ketiga Jenis Function

### Sintaks

```javascript
// Function Declaration
function tambahDeklarasi(a, b) {
  return a + b;
}

// Function Expression
const tambahEkspresi = function(a, b) {
  return a + b;
};

// Arrow Function
const tambahArrow = (a, b) => a + b;

// Arrow Function dengan multiple statement
const tambahArrowPanjang = (a, b) => {
  const hasil = a + b;
  return hasil;
};

console.log(tambahDeklarasi(2, 3));  // Output: 5
console.log(tambahEkspresi(2, 3));   // Output: 5
console.log(tambahArrow(2, 3));      // Output: 5
```

### Hoisting

```javascript
// Function Declaration - Di-hoist
console.log(deklarasiHoist(5)); // Output: 25

function deklarasiHoist(x) {
  return x * x;
}

// Function Expression - TIDAK di-hoist
// console.log(ekspresiHoist(5)); // Error!

const ekspresiHoist = function(x) {
  return x * x;
};

// Arrow Function - TIDAK di-hoist
// console.log(arrowHoist(5)); // Error!

const arrowHoist = (x) => x * x;
```

### Konteks `this`

```javascript
const pengguna = {
  nama: "John",
  
  // Function biasa - 'this' mengacu ke pengguna
  sapaBiasa: function() {
    console.log(`Halo, ${this.nama}`);
  },
  
  // Arrow function - 'this' mengacu ke scope luar (window/undefined)
  sapaArrow: () => {
    console.log(`Halo, ${this.nama}`); // this.nama = undefined
  },
  
  // Method dengan arrow function di dalamnya
  sapaDenganDelay: function() {
    setTimeout(() => {
      console.log(`Halo setelah delay, ${this.nama}`);
    }, 100);
  }
};

pengguna.sapaBiasa();      // Output: Halo, John
pengguna.sapaArrow();      // Output: Halo, undefined
pengguna.sapaDenganDelay(); // Output: Halo setelah delay, John
```

### Penggunaan sebagai Constructor

```javascript
// Function Declaration - Bisa digunakan sebagai constructor
function OrangDeklarasi(nama) {
  this.nama = nama;
}
const orang1 = new OrangDeklarasi("Budi");
console.log(orang1.nama); // Output: Budi

// Function Expression - Bisa digunakan sebagai constructor
const OrangEkspresi = function(nama) {
  this.nama = nama;
};
const orang2 = new OrangEkspresi("Ani");
console.log(orang2.nama); // Output: Ani

// Arrow Function - TIDAK bisa digunakan sebagai constructor
const OrangArrow = (nama) => {
  this.nama = nama;
};
// const orang3 = new OrangArrow("Dewi"); // TypeError: OrangArrow is not a constructor
```

### Arguments Object

```javascript
// Function biasa memiliki arguments object
function jumlahkanBiasa() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
console.log(jumlahkanBiasa(1, 2, 3, 4, 5)); // Output: 15

// Arrow function TIDAK memiliki arguments object
const jumlahkanArrow = () => {
  // console.log(arguments); // Error! arguments is not defined
  // Solusi: gunakan rest parameter
};

// Solusi dengan rest parameter untuk arrow function
const jumlahkanArrowFix = (...angka) => {
  return angka.reduce((total, num) => total + num, 0);
};
console.log(jumlahkanArrowFix(1, 2, 3, 4, 5)); // Output: 15
```

## Use Cases dan Best Practices

### Kapan Menggunakan Function Declaration?

```javascript
// 1. Ketika function perlu di-hoist
hitungLuas(10, 5);

function hitungLuas(panjang, lebar) {
  return panjang * lebar;
}

// 2. Untuk utility functions yang sering digunakan
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(angka);
}

// 3. Untuk constructor functions (meski sekarang lebih disarankan class)
function Mahasiswa(nama, nim) {
  this.nama = nama;
  this.nim = nim;
}
```

### Kapan Menggunakan Function Expression?

```javascript
// 1. Ketika function hanya digunakan di satu tempat
const validasiEmail = function(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 2. Untuk callback functions
const angka = [1, 2, 3, 4, 5];
const hasil = angka.filter(function(n) {
  return n % 2 === 0;
});

// 3. Untuk IIFE (Immediately Invoked Function Expression)
const konfigurasi = (function() {
  const apiKey = "secret-key";
  const baseUrl = "https://api.example.com";
  
  return {
    getBaseUrl: () => baseUrl,
    getApiKey: () => apiKey
  };
})();
```

### Kapan Menggunakan Arrow Function?

```javascript
// 1. Untuk callback functions yang sederhana
const angka = [1, 2, 3, 4, 5];
const doubled = angka.map(n => n * 2);
const even = angka.filter(n => n % 2 === 0);
const sum = angka.reduce((acc, n) => acc + n, 0);

// 2. Ketika perlu mempertahankan konteks 'this'
class Timer {
  constructor() {
    this.detik = 0;
  }
  
  mulai() {
    setInterval(() => {
      this.detik++;
      console.log(`Detik: ${this.detik}`);
    }, 1000);
  }
}

// 3. Untuk function yang mengembalikan object
const buatPengguna = (id, nama) => ({ id, nama, aktif: true });

// 4. Untuk chaining method
const prosesData = data => data
  .filter(item => item.aktif)
  .map(item => item.nama)
  .sort();

// 5. Untuk event handler yang perlu konteks 'this'
const komponen = {
  nilai: 0,
  init() {
    document.getElementById('tombol').addEventListener('click', () => {
      this.nilai++;
      console.log(this.nilai);
    });
  }
};
```

## Higher-Order Functions

Function yang menerima function sebagai parameter atau mengembalikan function.

```javascript
// Function yang menerima function sebagai parameter
function prosesArray(array, callback) {
  const hasil = [];
  for (let i = 0; i < array.length; i++) {
    hasil.push(callback(array[i], i, array));
  }
  return hasil;
}

const angka = [1, 2, 3, 4, 5];
const kaliTiga = prosesArray(angka, x => x * 3);
console.log(kaliTiga); // Output: [3, 6, 9, 12, 15]

// Function yang mengembalikan function (Closure)
function buatPengali(faktor) {
  return function(angka) {
    return angka * faktor;
  };
}

const kaliDua = buatPengali(2);
const kaliLima = buatPengali(5);

console.log(kaliDua(10));  // Output: 20
console.log(kaliLima(10)); // Output: 50

// Dengan arrow function
const buatPenambah = tambahan => angka => angka + tambahan;

const tambahSepuluh = buatPenambah(10);
console.log(tambahSepuluh(5)); // Output: 15
```

## Recursive Functions

Function yang memanggil dirinya sendiri.

```javascript
// Function declaration - Faktorial
function faktorial(n) {
  if (n <= 1) return 1;
  return n * faktorial(n - 1);
}
console.log(faktorial(5)); // Output: 120

// Function expression - Fibonacci
const fibonacci = function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};
console.log(fibonacci(10)); // Output: 55

// Arrow function - Sum array
const sumArray = (arr, index = 0) => {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
};
console.log(sumArray([1, 2, 3, 4, 5])); // Output: 15
```

## Kesimpulan

Memahami perbedaan antara Function Declaration, Function Expression, dan Arrow Function sangat penting untuk menulis kode JavaScript yang efektif dan efisien. Setiap jenis function memiliki karakteristik unik:

- **Function Declaration**: Cocok untuk function yang perlu di-hoist atau digunakan sebagai constructor
- **Function Expression**: Ideal untuk callback, IIFE, dan function yang disimpan dalam variabel
- **Arrow Function**: Pilihan terbaik untuk callback sederhana dan saat perlu mempertahankan konteks `this`

Pemilihan jenis function yang tepat bergantung pada kebutuhan spesifik kode Anda, termasuk hoisting, konteks `this`, dan readability. Dengan menguasai ketiga jenis function ini, Anda akan lebih fleksibel dalam menyelesaikan berbagai masalah pemrograman dengan JavaScript.
