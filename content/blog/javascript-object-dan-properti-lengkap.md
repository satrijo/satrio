---
title: "JavaScript Object dan Properti Lengkap"
date: "2026-02-01T00:00:00.000Z"
description: "Panduan lengkap tentang JavaScript Object, properti, method, constructor, prototype, dan berbagai teknik manipulasi object dalam bahasa Indonesia"
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# JavaScript Object dan Properti Lengkap

Object merupakan salah satu tipe data fundamental dalam JavaScript yang memungkinkan kita untuk menyimpan koleksi data dan fungsi terkait dalam satu entitas. Berbeda dengan tipe data primitif seperti string, number, atau boolean yang hanya menyimpan satu nilai, object dapat menyimpan multiple nilai dalam bentuk pasangan key-value.

## Apa Itu Object dalam JavaScript?

Object dalam JavaScript adalah kumpulan properti yang terdiri dari nama (key) dan nilai (value). Object digunakan untuk merepresentasikan entitas dunia nyata dalam kode program, seperti pengguna, produk, transaksi, atau konsep abstrak lainnya.

```javascript
// Membuat object dengan object literal
const mahasiswa = {
  nama: "Budi Santoso",
  umur: 21,
  jurusan: "Teknik Informatika",
  ipk: 3.75,
  aktif: true
};

console.log(mahasiswa.nama); // Output: Budi Santoso
console.log(mahasiswa.umur); // Output: 21
```

## Cara Membuat Object

### 1. Object Literal

Cara paling sederhana dan umum untuk membuat object adalah menggunakan object literal dengan sintaks kurung kurawal.

```javascript
const buku = {
  judul: "JavaScript Lanjutan",
  penulis: "John Doe",
  tahun: 2024,
  harga: 150000,
  tersedia: true
};

// Mengakses properti dengan dot notation
console.log(buku.judul);

// Mengakses properti dengan bracket notation
console.log(buku["penulis"]);
```

### 2. Constructor Function

Constructor function digunakan untuk membuat multiple object dengan struktur yang sama.

```javascript
function Mahasiswa(nama, umur, jurusan) {
  this.nama = nama;
  this.umur = umur;
  this.jurusan = jurusan;
  
  this.perkenalan = function() {
    return `Halo, saya ${this.nama}, mahasiswa ${this.jurusan}`;
  };
}

const mhs1 = new Mahasiswa("Ani", 20, "Sistem Informasi");
const mhs2 = new Mahasiswa("Budi", 22, "Teknik Komputer");

console.log(mhs1.perkenalan());
console.log(mhs2.perkenalan());
```

### 3. Object.create()

Method ini membuat object baru dengan prototype yang ditentukan.

```javascript
const prototipeMobil = {
  hidupkanMesin: function() {
    console.log("Mesin dinyalakan");
  },
  matikanMesin: function() {
    console.log("Mesin dimatikan");
  }
};

const mobilToyota = Object.create(prototipeMobil);
mobilToyota.merek = "Toyota";
mobilToyota.model = "Camry";
mobilToyota.tahun = 2024;

mobilToyota.hidupkanMesin(); // Output: Mesin dinyalakan
```

### 4. ES6 Class

Class menyediakan sintaks yang lebih bersih untuk membuat constructor dan method.

```javascript
class Produk {
  constructor(nama, harga, stok) {
    this.nama = nama;
    this.harga = harga;
    this.stok = stok;
  }
  
  hitungTotal(quantity) {
    return this.harga * quantity;
  }
  
  cekKetersediaan() {
    return this.stok > 0 ? "Tersedia" : "Habis";
  }
}

const laptop = new Produk("Laptop Gaming", 15000000, 10);
console.log(laptop.hitungTotal(2)); // Output: 30000000
console.log(laptop.cekKetersediaan()); // Output: Tersedia
```

## Properti Object

### Properti Data

Properti data terdiri dari key dan value sederhana.

```javascript
const pengguna = {
  id: 1,
  username: "johndoe",
  email: "john@example.com",
  loginTerakhir: new Date()
};
```

### Properti Accessor (Getter dan Setter)

Getter dan setter memungkinkan kita mengontrol akses ke properti object.

```javascript
const rekeningBank = {
  _saldo: 1000000, // konvensi private dengan underscore
  
  get saldo() {
    return `Rp ${this._saldo.toLocaleString('id-ID')}`;
  },
  
  set saldo(nominal) {
    if (nominal < 0) {
      console.error("Saldo tidak boleh negatif");
      return;
    }
    this._saldo = nominal;
    console.log(`Saldo diubah menjadi Rp ${nominal.toLocaleString('id-ID')}`);
  }
};

console.log(rekeningBank.saldo); // Output: Rp 1.000.000
rekeningBank.saldo = 2000000; // Output: Saldo diubah menjadi Rp 2.000.000
rekeningBank.saldo = -500000; // Output: Saldo tidak boleh negatif
```

### Properti Computed

Properti computed memungkinkan kita menggunakan ekspresi sebagai nama properti.

```javascript
const prefix = "user";
const id = 123;

const dataPengguna = {
  [`${prefix}_${id}`]: "John Doe",
  [`${prefix}_${id}_email`]: "john@example.com",
  [`${prefix}_${id}_role`]: "admin"
};

console.log(dataPengguna.user_123); // Output: John Doe
```

## Method dalam Object

Method adalah fungsi yang menjadi properti dari object.

```javascript
const kalkulator = {
  hasil: 0,
  
  tambah(a, b) {
    this.hasil = a + b;
    return this;
  },
  
  kurang(a, b) {
    this.hasil = a - b;
    return this;
  },
  
  kali(a, b) {
    this.hasil = a * b;
    return this;
  },
  
  bagi(a, b) {
    if (b === 0) {
      console.error("Tidak bisa dibagi dengan nol");
      return this;
    }
    this.hasil = a / b;
    return this;
  },
  
  reset() {
    this.hasil = 0;
    return this;
  },
  
  getHasil() {
    return this.hasil;
  }
};

// Method chaining
const hasil = kalkulator.tambah(10, 5).kali(2).getHasil();
console.log(hasil); // Output: 30
```

## Manipulasi Object

### Menambah Properti

```javascript
const siswa = { nama: "Dewi" };

// Menambah properti baru
siswa.umur = 17;
siswa["kelas"] = "XI IPA 1";
siswa.nilai = { matematika: 90, fisika: 85, kimia: 88 };

console.log(siswa);
// Output: { nama: "Dewi", umur: 17, kelas: "XI IPA 1", nilai: {...} }
```

### Mengubah Properti

```javascript
const konfigurasi = {
  tema: "light",
  bahasa: "id",
  notifikasi: true
};

// Mengubah nilai properti
konfigurasi.tema = "dark";
konfigurasi["bahasa"] = "en";

console.log(konfigurasi.tema); // Output: dark
```

### Menghapus Properti

```javascript
const data = {
  nama: "Test",
  password: "secret123",
  email: "test@example.com",
  temp: "data sementara"
};

// Menghapus properti
delete data.password;
delete data["temp"];

console.log(data);
// Output: { nama: "Test", email: "test@example.com" }
```

### Mengecek Keberadaan Properti

```javascript
const mobil = { merek: "Honda", model: "Civic" };

console.log("merek" in mobil); // Output: true
console.log("tahun" in mobil); // Output: false

console.log(mobil.hasOwnProperty("model")); // Output: true
console.log(mobil.hasOwnProperty("toString")); // Output: false
```

## Iterasi Object

### for...in Loop

```javascript
const pegawai = {
  nama: "Siti Aminah",
  jabatan: "Manager",
  departemen: "IT",
  gaji: 15000000
};

for (let key in pegawai) {
  console.log(`${key}: ${pegawai[key]}`);
}
// Output:
// nama: Siti Aminah
// jabatan: Manager
// departemen: IT
// gaji: 15000000
```

### Object.keys()

```javascript
const produk = { id: 1, nama: "Laptop", harga: 10000000 };
const keys = Object.keys(produk);
console.log(keys); // Output: ["id", "nama", "harga"]

// Iterasi dengan forEach
keys.forEach(key => {
  console.log(`${key}: ${produk[key]}`);
});
```

### Object.values()

```javascript
const nilai = { matematika: 90, fisika: 85, kimia: 88 };
const values = Object.values(nilai);
console.log(values); // Output: [90, 85, 88]

// Menghitung rata-rata
const rataRata = values.reduce((a, b) => a + b, 0) / values.length;
console.log(`Rata-rata: ${rataRata}`); // Output: Rata-rata: 87.666...
```

### Object.entries()

```javascript
const pengaturan = { tema: "dark", fontSize: 14, autoSave: true };
const entries = Object.entries(pengaturan);
console.log(entries);
// Output: [["tema", "dark"], ["fontSize", 14], ["autoSave", true]]

// Mengubah object menjadi Map
const mapPengaturan = new Map(entries);
console.log(mapPengaturan.get("tema")); // Output: dark
```

## Prototype dan Pewarisan

### Prototype Chain

Setiap object dalam JavaScript memiliki prototype yang menjadi sumber pewarisan properti dan method.

```javascript
function Hewan(nama) {
  this.nama = nama;
}

Hewan.prototype.bersuara = function() {
  console.log(`${this.nama} bersuara`);
};

const kucing = new Hewan("Kitty");
kucing.bersuara(); // Output: Kitty bersuara

console.log(kucing.__proto__ === Hewan.prototype); // Output: true
```

### Pewarisan dengan Class

```javascript
class Kendaraan {
  constructor(merek, model) {
    this.merek = merek;
    this.model = model;
  }
  
  info() {
    return `${this.merek} ${this.model}`;
  }
}

class Mobil extends Kendaraan {
  constructor(merek, model, jumlahPintu) {
    super(merek, model);
    this.jumlahPintu = jumlahPintu;
  }
  
  infoLengkap() {
    return `${this.info()} - ${this.jumlahPintu} pintu`;
  }
}

const avanza = new Mobil("Toyota", "Avanza", 5);
console.log(avanza.infoLengkap()); // Output: Toyota Avanza - 5 pintu
```

## Object Destructuring

Destructuring memungkinkan ekstraksi properti object ke variabel terpisah.

```javascript
const pelanggan = {
  nama: "Budi Santoso",
  email: "budi@example.com",
  alamat: {
    jalan: "Jl. Merdeka No. 123",
    kota: "Jakarta",
    kodePos: "10110"
  },
  pesanan: ["Laptop", "Mouse", "Keyboard"]
};

// Basic destructuring
const { nama, email } = pelanggan;
console.log(nama, email);

// Destructuring dengan default value
const { telepon = "Tidak tersedia" } = pelanggan;
console.log(telepon); // Output: Tidak tersedia

// Nested destructuring
const { alamat: { kota, kodePos } } = pelanggan;
console.log(kota, kodePos); // Output: Jakarta 10110

// Destructuring dengan alias
const { nama: namaPelanggan, email: emailPelanggan } = pelanggan;
console.log(namaPelanggan); // Output: Budi Santoso

// Destructuring di parameter fungsi
function tampilkanInfo({ nama, email, alamat: { kota } }) {
  console.log(`${nama} (${email}) dari ${kota}`);
}

tampilkanInfo(pelanggan);
// Output: Budi Santoso (budi@example.com) dari Jakarta
```

## Spread dan Rest Operator

### Spread Operator untuk Object

```javascript
const defaultConfig = {
  tema: "light",
  bahasa: "id",
  notifikasi: true
};

const userConfig = {
  tema: "dark",
  fontSize: 16
};

// Menggabungkan object
const finalConfig = { ...defaultConfig, ...userConfig };
console.log(finalConfig);
// Output: { tema: "dark", bahasa: "id", notifikasi: true, fontSize: 16 }

// Menambah properti baru
const configDenganFitur = { ...finalConfig, autoSave: true, backup: false };
```

### Rest Parameter untuk Object

```javascript
const pengguna = {
  id: 1,
  nama: "John Doe",
  email: "john@example.com",
  role: "admin",
  departemen: "IT",
  aktif: true
};

// Mengambil beberapa properti, sisanya ke variabel lain
const { id, nama, ...detailLainnya } = pengguna;
console.log(id); // Output: 1
console.log(nama); // Output: John Doe
console.log(detailLainnya);
// Output: { email: "john@example.com", role: "admin", ... }
```

## Object Method Lanjutan

### Object.assign()

```javascript
const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { d: 5 };

const hasil = Object.assign(target, source1, source2);
console.log(hasil); // Output: { a: 1, b: 3, c: 4, d: 5 }
console.log(target === hasil); // Output: true (target dimodifikasi)

// Cara aman tanpa memodifikasi object asli
const hasilBaru = Object.assign({}, target, source1);
```

### Object.freeze() dan Object.seal()

```javascript
const konfigurasiDasar = { apiUrl: "https://api.example.com", timeout: 5000 };

// Object.freeze() - Membuat object immutable
Object.freeze(konfigurasiDasar);
konfigurasiDasar.apiUrl = "https://new-api.com"; // Tidak berhasil
konfigurasiDasar.newProp = "value"; // Tidak berhasil
delete konfigurasiDasar.timeout; // Tidak berhasil
console.log(Object.isFrozen(konfigurasiDasar)); // Output: true

const dataUser = { nama: "Budi", umur: 25 };

// Object.seal() - Bisa ubah nilai, tapi tidak bisa tambah/hapus properti
Object.seal(dataUser);
dataUser.umur = 26; // Berhasil
dataUser.alamat = "Jakarta"; // Tidak berhasil
delete dataUser.nama; // Tidak berhasil
console.log(Object.isSealed(dataUser)); // Output: true
```

### Object.defineProperty()

```javascript
const produk = {};

Object.defineProperty(produk, 'nama', {
  value: 'Laptop Gaming',
  writable: true,
  enumerable: true,
  configurable: true
});

Object.defineProperty(produk, 'harga', {
  value: 15000000,
  writable: false, // Tidak bisa diubah
  enumerable: true,
  configurable: false
});

produk.nama = "Laptop Office"; // Berhasil
produk.harga = 12000000; // Gagal (strict mode akan error)

console.log(produk);
```

## Best Practices

1. **Gunakan const untuk deklarasi object** untuk mencegah reassignment
2. **Gunakan method shorthand** untuk kode yang lebih bersih
3. **Gunakan computed property names** saat nama properti dinamis
4. **Manfaatkan destructuring** untuk ekstraksi properti
5. **Gunakan spread operator** untuk menggabungkan object
6. **Gunakan Object.freeze()** untuk konstanta yang tidak boleh diubah
7. **Gunakan class** untuk struktur yang kompleks dan pewarisan

## Kesimpulan

Object adalah komponen fundamental dalam JavaScript yang memungkinkan kita memodelkan data dan perilaku dalam program. Memahami berbagai cara membuat, mengakses, dan memanipulasi object sangat penting untuk menjadi developer JavaScript yang handal. Dengan menguasai konsep prototype, class, destructuring, dan method object, Anda dapat menulis kode yang lebih terstruktur, modular, dan mudah dipelihara.

Pemahaman mendalam tentang object juga menjadi dasar penting sebelum mempelajari konsep lebih lanjut seperti module, design pattern, dan framework JavaScript modern seperti React, Vue, atau Angular.

## Artikel Selanjutnya

Setelah memahami Object dalam JavaScript, lanjutkan pembelajaran Anda dengan membaca [Function di JavaScript: Declaration, Expression, dan Arrow Function](/blog/javascript-function-declaration-expression-arrow).
