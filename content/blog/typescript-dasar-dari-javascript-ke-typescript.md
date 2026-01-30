---
title: "TypeScript Dasar: Dari JavaScript ke TypeScript"
date: 2026-02-06T00:00:00.000Z
description: "Panduan lengkap memulai TypeScript untuk developer JavaScript. Pelajari dasar-dasar TypeScript, type annotations, dan cara mengkonversi kode JavaScript ke TypeScript."
category: TypeScript
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

TypeScript telah menjadi bahasa pemrograman yang sangat populer di kalangan developer web modern. Sebagai superset dari JavaScript, TypeScript menambahkan sistem tipe statis yang kuat ke dalam JavaScript, membantu developer menangkap bug lebih awal dan meningkatkan kualitas kode secara signifikan. Artikel ini akan membahas dasar-dasar TypeScript secara komprehensif, cocok untuk developer JavaScript yang ingin memulai perjalanan mereka dengan TypeScript.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami dasar-dasar JavaScript. Jika Anda baru memulai dengan JavaScript, silakan baca [Panduan Lengkap JavaScript untuk Pemula](/blog/javascript-dasar-panduan-lengkap-pemula) terlebih dahulu.

## Apa itu TypeScript?

TypeScript adalah bahasa pemrograman open-source yang dikembangkan oleh Microsoft. Dirilis pertama kali pada tahun 2012, TypeScript dirancang sebagai superset dari JavaScript yang menambahkan fitur typing statis opsional. Ini berarti bahwa setiap kode JavaScript yang valid juga merupakan kode TypeScript yang valid, tetapi TypeScript memberikan kemampuan tambahan untuk mendefinisikan tipe data secara eksplisit.

Keunggulan utama TypeScript adalah kemampuannya untuk mendeteksi kesalahan pada saat compile time, bukan runtime. Dalam JavaScript tradisional, banyak kesalahan seperti mengakses properti yang tidak ada atau memanggil fungsi dengan argumen yang salah hanya akan terdeteksi ketika aplikasi berjalan. Dengan TypeScript, kesalahan semacam ini dapat diidentifikasi oleh compiler sebelum kode dieksekusi, menghemat waktu debugging yang berharga.

## Mengapa Beralih ke TypeScript?

Ada beberapa alasan kuat mengapa developer JavaScript harus mempertimbangkan untuk menggunakan TypeScript:

### 1. Deteksi Error Lebih Awal

TypeScript memungkinkan Anda menangkap bug pada saat development, bukan saat production. Sistem tipe yang kuat membantu mencegah kesalahan umum seperti `undefined is not a function` atau `cannot read property of undefined`.

### 2. IntelliSense dan Autocomplete yang Lebih Baik

Editor kode modern seperti VS Code memberikan dukungan IntelliSense yang luar biasa untuk TypeScript. Anda akan mendapatkan autocomplete, dokumentasi inline, dan refactoring tools yang sangat membantu saat bekerja dengan codebase yang besar.

### 3. Dokumentasi yang Lebih Baik

Tipe yang didefinisikan secara eksplisit berfungsi sebagai dokumentasi hidup. Developer lain (atau diri Anda di masa depan) dapat dengan mudah memahami struktur data dan ekspektasi fungsi hanya dengan melihat definisi tipenya.

### 4. Refactoring yang Lebih Aman

Ketika Anda perlu mengubah struktur kode, TypeScript memberikan kepercayaan diri yang lebih besar. Compiler akan memberitahu Anda semua tempat yang perlu diperbarui, mengurangi risiko memperkenalkan bug saat refactoring.

### 5. Skalabilitas

TypeScript sangat cocok untuk proyek besar dengan banyak developer. Sistem modul dan namespace membantu mengorganisir kode dengan lebih baik dan mencegah konflik nama.

## Instalasi dan Setup

Untuk memulai dengan TypeScript, Anda perlu menginstal TypeScript compiler. Berikut adalah langkah-langkahnya:

```bash
# Instal TypeScript secara global
npm install -g typescript

# Atau instal sebagai dev dependency di proyek Anda
npm install --save-dev typescript
```

Setelah instalasi, buat file konfigurasi TypeScript di root proyek Anda:

```bash
npx tsc --init
```

Perintah ini akan membuat file `tsconfig.json` dengan konfigurasi default. Berikut adalah konfigurasi dasar yang direkomendasikan:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Type Annotations Dasar

Sintaks TypeScript yang paling fundamental adalah type annotations. Berikut adalah tipe-tipe dasar yang perlu Anda ketahui:

### Tipe Primitif

```typescript
// String
let nama: string = "Budi Santoso";
let pesan: string = `Halo, ${nama}!`;

// Number
let umur: number = 25;
let harga: number = 150000.50;
let hex: number = 0xff; // hexadecimal
let binary: number = 0b1010; // binary

// Boolean
let isActive: boolean = true;
let isAdmin: boolean = false;

// Undefined dan Null
let tidakTerdefinisi: undefined = undefined;
let kosong: null = null;
```

### Array

Ada dua cara untuk mendefinisikan tipe array:

```typescript
// Cara 1: Menggunakan tipe[]
let angka: number[] = [1, 2, 3, 4, 5];
let namaNama: string[] = ["Andi", "Budi", "Citra"];

// Cara 2: Menggunakan Array<tipe>
let nilai: Array<number> = [85, 90, 78, 92];
let hobbies: Array<string> = ["coding", "reading", "gaming"];

// Array dengan multiple tipe menggunakan union
let campuran: (string | number)[] = ["satu", 2, "tiga", 4];
```

### Tuple

Tuple adalah array dengan jumlah elemen dan tipe yang tetap:

```typescript
// Tuple dengan 2 elemen: string dan number
let user: [string, number] = ["budi", 25];

// Tuple dengan 3 elemen
let koordinat: [number, number, string] = [10.5, 20.3, "lokasi A"];

// Mengakses elemen tuple
console.log(user[0]); // "budi"
console.log(user[1]); // 25

// Error: elemen ke-2 harus number
// let userSalah: [string, number] = ["budi", "dua puluh lima"];
```

### Enum

Enum memungkinkan Anda mendefinisikan sekumpulan konstanta bernama:

```typescript
// Enum numerik
enum StatusPesanan {
  Pending,    // 0
  Processing, // 1
  Shipped,    // 2
  Delivered,  // 3
  Cancelled   // 4
}

let statusPesanan: StatusPesanan = StatusPesanan.Processing;
console.log(statusPesanan); // 1

// Enum dengan nilai eksplisit
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}

// Enum string
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}

let userRole: Role = Role.Admin;
console.log(userRole); // "ADMIN"
```

### Any

Tipe `any` memungkinkan nilai apa pun dan menonaktifkan type checking:

```typescript
let data: any = "string";
data = 123;
data = true;
data = { nama: "Budi" };

// Hindari penggunaan any karena menghilangkan manfaat TypeScript
```

### Unknown

Tipe `unknown` mirip dengan `any` tetapi lebih aman karena memerlukan type checking sebelum digunakan:

```typescript
let input: unknown = "Hello World";

// Error: Object is of type 'unknown'
// console.log(input.toUpperCase());

// Cara yang benar dengan type guard
if (typeof input === "string") {
  console.log(input.toUpperCase()); // "HELLO WORLD"
}
```

### Void

Tipe `void` digunakan untuk fungsi yang tidak mengembalikan nilai:

```typescript
function logMessage(message: string): void {
  console.log(message);
  // tidak ada return statement
}

function processData(): void {
  // melakukan operasi tanpa return
  return; // atau return undefined
}
```

### Never

Tipe `never` merepresentasikan nilai yang tidak pernah terjadi:

```typescript
// Fungsi yang selalu throw error
function throwError(message: string): never {
  throw new Error(message);
}

// Fungsi dengan infinite loop
function infiniteLoop(): never {
  while (true) {
    console.log("Running...");
  }
}
```

## Type Inference

TypeScript memiliki kemampuan type inference yang kuat. Dalam banyak kasus, Anda tidak perlu menulis tipe secara eksplisit karena TypeScript dapat menebak tipe berdasarkan nilai yang diberikan:

```typescript
// TypeScript akan menginfer tipe string
let nama = "Budi"; // tipe: string

// TypeScript akan menginfer tipe number
let umur = 25; // tipe: number

// TypeScript akan menginfer tipe boolean
let aktif = true; // tipe: boolean

// Type inference juga bekerja untuk fungsi
function tambah(a: number, b: number) {
  return a + b; // TypeScript tahu return type adalah number
}

// Type inference untuk array
let angka = [1, 2, 3]; // tipe: number[]
let campuran = [1, "dua", 3]; // tipe: (string | number)[]
```

Meskipun type inference sangat berguna, ada baiknya tetap menulis tipe eksplisit untuk parameter fungsi dan return type, terutama untuk API publik, agar kode lebih mudah dipahami.

## Functions

TypeScript memberikan kemampuan untuk mendefinisikan tipe parameter dan return value fungsi:

### Function Declarations

```typescript
// Fungsi dengan parameter bertipe
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Fungsi dengan multiple parameter
function calculateArea(width: number, height: number): number {
  return width * height;
}

// Fungsi dengan parameter opsional
function createUser(name: string, age?: number): string {
  if (age) {
    return `${name} (${age} tahun)`;
  }
  return name;
}

// Fungsi dengan default parameter
function greetWithDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log(greetWithDefault("Budi")); // "Hello, Budi!"
console.log(greetWithDefault("Budi", "Halo")); // "Halo, Budi!"
```

### Arrow Functions

```typescript
// Arrow function dengan tipe
const multiply = (a: number, b: number): number => a * b;

// Arrow function dengan multiple baris
const formatUser = (name: string, age: number): string => {
  const status = age >= 18 ? "Dewasa" : "Anak-anak";
  return `${name} - ${status}`;
};

// Arrow function sebagai callback
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n: number): number => n * 2);
```

### Function Types

Anda dapat mendefinisikan tipe untuk fungsi itu sendiri:

```typescript
// Mendefinisikan tipe fungsi
type MathOperation = (a: number, b: number) => number;

// Menggunakan tipe fungsi
const add: MathOperation = (x, y) => x + y;
const subtract: MathOperation = (x, y) => x - y;
const multiply: MathOperation = (x, y) => x * y;

// Interface untuk fungsi
interface StringFormatter {
  (input: string): string;
}

const uppercase: StringFormatter = (str) => str.toUpperCase();
const lowercase: StringFormatter = (str) => str.toLowerCase();
```

## Objects

TypeScript memberikan beberapa cara untuk mendefinisikan struktur objek:

### Object Type Annotations

```typescript
// Object dengan tipe eksplisit
let user: {
  name: string;
  age: number;
  isActive: boolean;
} = {
  name: "Budi",
  age: 25,
  isActive: true
};

// Object dengan properti opsional
let product: {
  id: number;
  name: string;
  description?: string; // opsional
  price: number;
} = {
  id: 1,
  name: "Laptop",
  price: 10000000
};

// Object dengan readonly property
let config: {
  readonly apiUrl: string;
  readonly apiKey: string;
  timeout: number;
} = {
  apiUrl: "https://api.example.com",
  apiKey: "secret-key",
  timeout: 5000
};

// Error: Cannot assign to 'apiUrl' because it is a read-only property
// config.apiUrl = "https://other.com";
```

### Type Aliases

Untuk menghindari pengulangan, gunakan type aliases:

```typescript
// Mendefinisikan type alias
type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};

type Point = {
  x: number;
  y: number;
};

// Menggunakan type alias
const user1: User = {
  id: 1,
  name: "Andi",
  email: "andi@example.com",
  isActive: true
};

const user2: User = {
  id: 2,
  name: "Budi",
  email: "budi@example.com",
  isActive: false
};

function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

### Interfaces

Interface adalah cara lain untuk mendefinisikan struktur objek:

```typescript
// Interface dasar
interface Person {
  firstName: string;
  lastName: string;
  age: number;
}

// Menggunakan interface
const person: Person = {
  firstName: "John",
  lastName: "Doe",
  age: 30
};

// Interface dengan method
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Interface dapat di-extend
interface Employee extends Person {
  employeeId: number;
  department: string;
}

const employee: Employee = {
  firstName: "Jane",
  lastName: "Smith",
  age: 28,
  employeeId: 1001,
  department: "IT"
};
```

## Union dan Intersection Types

### Union Types

Union types memungkinkan nilai dengan beberapa tipe yang berbeda:

```typescript
// Union type dengan string | number
let id: string | number;
id = "abc123"; // valid
id = 123; // valid
// id = true; // Error: Type 'boolean' is not assignable

// Union type dalam parameter fungsi
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

printId("user-001");
printId(42);

// Type narrowing dengan union
function processValue(value: string | number): void {
  if (typeof value === "string") {
    // Di sini value bertipe string
    console.log(value.toUpperCase());
  } else {
    // Di sini value bertipe number
    console.log(value.toFixed(2));
  }
}

// Union dengan literal types
type Status = "pending" | "processing" | "completed" | "failed";

function updateStatus(status: Status): void {
  console.log(`Status updated to: ${status}`);
}

updateStatus("completed"); // valid
// updateStatus("unknown"); // Error: Argument of type '"unknown"' is not assignable
```

### Intersection Types

Intersection types menggabungkan multiple tipe menjadi satu:

```typescript
// Intersection type
type HasName = {
  name: string;
};

type HasAge = {
  age: number;
};

type Person = HasName & HasAge;

const person: Person = {
  name: "Budi",
  age: 25
};

// Intersection dengan interface
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
}

interface Document extends Printable, Serializable {
  title: string;
  content: string;
}

const doc: Document = {
  title: "Laporan",
  content: "Isi laporan...",
  print: () => console.log("Printing..."),
  serialize: () => JSON.stringify({ title: "Laporan", content: "Isi..." })
};
```

## Type Assertions

Type assertions memungkinkan Anda memberitahu TypeScript tentang tipe spesifik suatu nilai:

```typescript
// Type assertion dengan 'as'
let someValue: unknown = "ini adalah string";
let strLength: number = (someValue as string).length;

// Type assertion dengan angle bracket syntax
let anotherValue: unknown = "hello";
let anotherLength: number = (<string>anotherValue).length;

// Type assertion dengan DOM
const input = document.getElementById("username") as HTMLInputElement;
console.log(input.value);

// Double assertion (hati-hati menggunakan ini)
let value: unknown = "test";
let num = (value as unknown) as number;
```

## Konversi dari JavaScript ke TypeScript

Mengkonversi proyek JavaScript ke TypeScript dapat dilakukan secara bertahap:

### Langkah 1: Ubah Ekstensi File

Mulai dengan mengubah ekstensi file dari `.js` ke `.ts`:

```bash
mv app.js app.ts
mv utils.js utils.ts
```

### Langkah 2: Tambahkan Type Annotations

Konversi fungsi dan variabel dengan menambahkan tipe:

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity;
}

const user = {
  name: "Budi",
  age: 25
};
```

```typescript
// TypeScript
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Budi",
  age: 25
};
```

### Langkah 3: Handle External Libraries

Untuk library JavaScript tanpa definisi tipe, instal type definitions:

```bash
npm install --save-dev @types/nama-library
```

Atau buat file deklarasi sendiri:

```typescript
// types/nama-library.d.ts
declare module 'nama-library' {
  export function someFunction(): void;
  export const someValue: string;
}
```

### Langkah 4: Konfigurasi Strict Mode

Setelah sebagian besar kode dikonversi, aktifkan strict mode di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## Best Practices

Berikut adalah beberapa best practices saat menggunakan TypeScript:

### 1. Hindari Penggunaan `any`

Penggunaan `any` menghilangkan manfaat TypeScript. Gunakan `unknown` jika Anda tidak tahu tipe spesifiknya:

```typescript
// ❌ Hindari
function processData(data: any): any {
  return data.process();
}

// ✅ Lebih baik
function processData(data: unknown): string {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  throw new Error("Invalid data type");
}
```

### 2. Gunakan Strict Mode

Aktifkan strict mode untuk type checking yang lebih ketat:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 3. Manfaatkan Type Inference

Tidak perlu menulis tipe untuk setiap variabel. Gunakan type inference untuk kode yang lebih bersih:

```typescript
// ❌ Terlalu verbose
const name: string = "Budi";
const age: number = 25;
const isActive: boolean = true;

// ✅ Cukup dengan inference
const name = "Budi";
const age = 25;
const isActive = true;
```

### 4. Gunakan Interface untuk Object Shape

Gunakan interface untuk mendefinisikan bentuk objek, terutama untuk API publik:

```typescript
// ✅ Gunakan interface
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(user: User): void {
  // implementation
}
```

### 5. Dokumentasikan dengan JSDoc

Tambahkan dokumentasi untuk fungsi dan kompleks types:

```typescript
/**
 * Menghitung total harga dengan diskon
 * @param price - Harga asli
 * @param discount - Persentase diskon (0-100)
 * @returns Harga setelah diskon
 */
function calculateDiscount(price: number, discount: number): number {
  return price * (1 - discount / 100);
}
```

## Kesimpulan

TypeScript adalah investasi yang sangat berharga untuk developer JavaScript. Dengan sistem tipe yang kuat, TypeScript membantu Anda menulis kode yang lebih aman, lebih mudah dipelihara, dan lebih scalable. Meskipun ada kurva belajar, manfaat jangka panjangnya jauh melebihi waktu yang diinvestasikan untuk mempelajarinya.

Mulailah dengan dasar-dasar yang telah dibahas dalam artikel ini: type annotations, interfaces, functions, dan objects. Seiring waktu, Anda akan merasa lebih nyaman dengan fitur-fitur lanjutan seperti generics, decorators, dan utility types.

Ingatlah bahwa TypeScript adalah alat untuk membantu Anda, bukan menghalangi Anda. Gunakan fitur-fiturnya secara bijaksana dan sesuaikan dengan kebutuhan proyek Anda.

## Artikel Selanjutnya

Setelah memahami dasar-dasar TypeScript, lanjutkan pembelajaran Anda dengan membaca [TypeScript Configuration: Panduan Lengkap tsconfig.json](/blog/typescript-configuration-panduan-lengkap-tsconfig-json).

Selamat belajar TypeScript!
