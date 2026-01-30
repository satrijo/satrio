---
title: "Mengenal Array di JavaScript: Operasi dan Metode Lengkap"
date: 2026-01-31T00:00:00.000Z
description: "Pelajari segala sesuatu tentang array di JavaScript. Dari pembuatan array hingga metode-metode canggih seperti map, filter, dan reduce."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

Array adalah struktur data fundamental di JavaScript yang digunakan untuk menyimpan kumpulan data. Bayangkan array seperti lemari dengan banyak laci, di mana setiap laci bisa menyimpan item. Array memungkinkan kita mengelola data secara efisien dan melakukan operasi kompleks dengan mudah.

## Apa itu Array?

Array adalah objek khusus yang menyimpan kumpulan nilai dalam satu variabel. Nilai-nilai ini disebut **element** dan memiliki **index** (posisi) yang dimulai dari 0.

```javascript
// Membuat array
const fruits = ["Apple", "Banana", "Orange"];
const numbers = [1, 2, 3, 4, 5];
const mixed = ["text", 42, true, null, { name: "John" }];

// Array kosong
const empty = [];

// Menggunakan constructor (jarang digunakan)
const arr = new Array(3); // [empty × 3]
const arr2 = new Array(1, 2, 3); // [1, 2, 3]
```

## Mengakses Element Array

```javascript
const colors = ["Red", "Green", "Blue", "Yellow"];

// Mengakses dengan index (dimulai dari 0)
console.log(colors[0]); // "Red"
console.log(colors[1]); // "Green"
console.log(colors[2]); // "Blue"

// Index terakhir
console.log(colors[colors.length - 1]); // "Yellow"

// Mengubah nilai
colors[1] = "Purple";
console.log(colors); // ["Red", "Purple", "Blue", "Yellow"]

// Index yang tidak ada
console.log(colors[10]); // undefined

// Menambah element baru
colors[4] = "Pink";
colors[10] = "Black"; // ["Red", "Purple", "Blue", "Yellow", "Pink", empty × 5, "Black"]
```

## Property dan Method Dasar

### Length Property

```javascript
const items = ["a", "b", "c"];
console.log(items.length); // 3

// Mengubah length (memotong array)
items.length = 2;
console.log(items); // ["a", "b"]
```

### Menambah dan Menghapus Element

```javascript
const stack = [];

// push() - menambah di akhir
stack.push("first");
stack.push("second", "third");
console.log(stack); // ["first", "second", "third"]

// pop() - menghapus dan return element terakhir
const last = stack.pop();
console.log(last); // "third"
console.log(stack); // ["first", "second"]

// unshift() - menambah di awal
stack.unshift("zero");
console.log(stack); // ["zero", "first", "second"]

// shift() - menghapus dan return element pertama
const first = stack.shift();
console.log(first); // "zero"
console.log(stack); // ["first", "second"]
```

### splice() - Method Serbaguna

splice() bisa menambah, menghapus, atau mengganti element:

```javascript
const months = ["Jan", "March", "April", "June"];

// Menghapus element (index 1, hapus 0 element, tambah "Feb")
months.splice(1, 0, "Feb");
console.log(months); // ["Jan", "Feb", "March", "April", "June"]

// Mengganti element (index 4, hapus 1, tambah "May")
months.splice(4, 1, "May");
console.log(months); // ["Jan", "Feb", "March", "April", "May"]

// Menghapus element (index 2, hapus 2)
const removed = months.splice(2, 2);
console.log(removed); // ["March", "April"]
console.log(months); // ["Jan", "Feb", "May"]

// Menambah multiple element
months.splice(2, 0, "March", "April");
console.log(months); // ["Jan", "Feb", "March", "April", "May"]
```

### slice() - Mengambil Sebagian Array

```javascript
const animals = ["ant", "bison", "camel", "duck", "elephant"];

// slice(start, end) - end tidak termasuk
console.log(animals.slice(2)); // ["camel", "duck", "elephant"]
console.log(animals.slice(2, 4)); // ["camel", "duck"]
console.log(animals.slice(1, 5)); // ["bison", "camel", "duck", "elephant"]
console.log(animals.slice(-2)); // ["duck", "elephant"]
console.log(animals.slice(2, -1)); // ["camel", "duck"]

// slice tidak mengubah array asli
console.log(animals); // ["ant", "bison", "camel", "duck", "elephant"]
```

## Metode Pencarian

### indexOf() dan lastIndexOf()

```javascript
const beasts = ["ant", "bison", "camel", "duck", "bison"];

console.log(beasts.indexOf("bison")); // 1
console.log(beasts.indexOf("bison", 2)); // 4 (mulai dari index 2)
console.log(beasts.indexOf("giraffe")); // -1 (tidak ditemukan)

console.log(beasts.lastIndexOf("bison")); // 4
console.log(beasts.lastIndexOf("bison", 3)); // 1 (dari belakang, mulai index 3)
```

### includes()

```javascript
const pets = ["cat", "dog", "bat"];

console.log(pets.includes("cat")); // true
console.log(pets.includes("at")); // false
console.log(pets.includes("dog", 2)); // false (mulai dari index 2)
```

### find() dan findIndex()

```javascript
const users = [
  { id: 1, name: "John", age: 25 },
  { id: 2, name: "Jane", age: 30 },
  { id: 3, name: "Bob", age: 35 }
];

// find() - return element pertama yang memenuhi kondisi
const user = users.find(u => u.age > 28);
console.log(user); // { id: 2, name: "Jane", age: 30 }

const notFound = users.find(u => u.age > 50);
console.log(notFound); // undefined

// findIndex() - return index element pertama
const index = users.findIndex(u => u.name === "Jane");
console.log(index); // 1

const notFoundIndex = users.findIndex(u => u.name === "Alice");
console.log(notFoundIndex); // -1

// findLast() dan findLastIndex() (ES2023)
const lastUser = users.findLast(u => u.age > 28);
console.log(lastUser); // { id: 3, name: "Bob", age: 35 }
```

## Metode Transformasi Array

### map() - Transformasi Setiap Element

map() membuat array baru dengan hasil transformasi setiap element:

```javascript
const numbers = [1, 2, 3, 4, 5];

// Mengalikan setiap angka dengan 2
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Mengubah array objek
const users = [
  { firstName: "John", lastName: "Doe" },
  { firstName: "Jane", lastName: "Smith" }
];

const fullNames = users.map(user => ({
  ...user,
  fullName: `${user.firstName} ${user.lastName}`
}));
console.log(fullNames);
// [
//   { firstName: "John", lastName: "Doe", fullName: "John Doe" },
//   { firstName: "Jane", lastName: "Smith", fullName: "Jane Smith" }
// ]

// Dengan index
const indexed = numbers.map((num, index) => `Index ${index}: ${num}`);
console.log(indexed);
// ["Index 0: 1", "Index 1: 2", "Index 2: 3", "Index 3: 4", "Index 4: 5"]
```

### filter() - Menyaring Array

filter() membuat array baru dengan element yang memenuhi kondisi:

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Hanya angka genap
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Hanya angka > 5
const greaterThanFive = numbers.filter(num => num > 5);
console.log(greaterThanFive); // [6, 7, 8, 9, 10]

// Filter objek
const users = [
  { name: "John", age: 25, active: true },
  { name: "Jane", age: 30, active: false },
  { name: "Bob", age: 35, active: true }
];

const activeUsers = users.filter(u => u.active);
console.log(activeUsers); // [{ name: "John", ... }, { name: "Bob", ... }]

const adults = users.filter(u => u.age >= 30);
console.log(adults); // [{ name: "Jane", ... }, { name: "Bob", ... }]

// Menghapus nilai falsy
const mixed = [0, 1, false, 2, "", 3, null, undefined, NaN];
const truthy = mixed.filter(Boolean);
console.log(truthy); // [1, 2, 3]
```

### reduce() - Mengurangi Array ke Satu Nilai

reduce() adalah method paling powerful untuk mengolah array:

```javascript
const numbers = [1, 2, 3, 4, 5];

// Menjumlahkan semua angka
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 15

// Penjelasan:
// Iterasi 1: acc=0, curr=1 → return 1
// Iterasi 2: acc=1, curr=2 → return 3
// Iterasi 3: acc=3, curr=3 → return 6
// Iterasi 4: acc=6, curr=4 → return 10
// Iterasi 5: acc=10, curr=5 → return 15

// Mengalikan semua angka
const product = numbers.reduce((acc, curr) => acc * curr, 1);
console.log(product); // 120

// Menemukan nilai maksimum
const max = numbers.reduce((acc, curr) => curr > acc ? curr : acc);
console.log(max); // 5

// Mengelompokkan data
const people = [
  { name: "Alice", age: 21, group: "A" },
  { name: "Bob", age: 25, group: "B" },
  { name: "Carol", age: 21, group: "A" },
  { name: "David", age: 25, group: "B" }
];

const groupedByAge = people.reduce((acc, person) => {
  const key = person.age;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(person);
  return acc;
}, {});

console.log(groupedByAge);
// {
//   21: [{ name: "Alice", ... }, { name: "Carol", ... }],
//   25: [{ name: "Bob", ... }, { name: "David", ... }]
// }

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, curr) => acc.concat(curr), []);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, orange: 1 }
```

## Metode Iterasi

### forEach()

```javascript
const colors = ["red", "green", "blue"];

colors.forEach((color, index) => {
  console.log(`${index}: ${color}`);
});
// 0: red
// 1: green
// 2: blue

// Tidak bisa break atau continue
// Gunakan for...of jika perlu break
```

### some() dan every()

```javascript
const numbers = [1, 2, 3, 4, 5];

// some() - true jika ADA element yang memenuhi kondisi
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

const hasNegative = numbers.some(num => num < 0);
console.log(hasNegative); // false

// every() - true jika SEMUA element memenuhi kondisi
const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // false
```

## Sorting Array

### sort()

```javascript
const fruits = ["banana", "apple", "cherry", "date"];

// Default sort (alphabetical)
fruits.sort();
console.log(fruits); // ["apple", "banana", "cherry", "date"]

// Angka - HATI-HATI!
const numbers = [10, 2, 30, 1, 5];
numbers.sort();
console.log(numbers); // [1, 10, 2, 30, 5] - SALAH!

// Sort angka dengan compare function
numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 2, 5, 10, 30] - BENAR

// Descending
numbers.sort((a, b) => b - a);
console.log(numbers); // [30, 10, 5, 2, 1]

// Sort objek
const users = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Bob", age: 35 }
];

users.sort((a, b) => a.age - b.age);
console.log(users);
// [{ name: "Jane", age: 25 }, { name: "John", age: 30 }, { name: "Bob", age: 35 }]

// Sort string case-insensitive
const words = ["Zebra", "apple", "Banana"];
words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
console.log(words); // ["apple", "Banana", "Zebra"]

// toSorted() - tidak mengubah array asli (ES2023)
const original = [3, 1, 4, 1, 5];
const sorted = original.toSorted((a, b) => a - b);
console.log(original); // [3, 1, 4, 1, 5]
console.log(sorted); // [1, 1, 3, 4, 5]
```

## Array Multidimensi

```javascript
// Matrix 2D
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(matrix[0][0]); // 1
console.log(matrix[1][2]); // 6
console.log(matrix[2][1]); // 8

// Looping matrix
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(matrix[i][j]);
  }
}

// Flatten 2D array
const flat = matrix.flat();
console.log(flat); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// flatMap()
const sentences = ["Hello world", "Good morning"];
const words = sentences.flatMap(s => s.split(" "));
console.log(words); // ["Hello", "world", "Good", "morning"]
```

## Destructuring Array

```javascript
const colors = ["red", "green", "blue"];

// Basic destructuring
const [first, second, third] = colors;
console.log(first); // "red"
console.log(second); // "green"

// Skip element
const [, , last] = colors;
console.log(last); // "blue"

// Default value
const [a, b, c, d = "yellow"] = colors;
console.log(d); // "yellow"

// Rest operator
const [primary, ...others] = colors;
console.log(primary); // "red"
console.log(others); // ["green", "blue"]

// Swap variabel
let x = 1;
let y = 2;
[x, y] = [y, x];
console.log(x); // 2
console.log(y); // 1

// Nested destructuring
const nested = [1, [2, 3], 4];
const [one, [two, three], four] = nested;
console.log(two); // 2
console.log(three); // 3
```

## Spread Operator

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Menggabungkan array
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Menambah element di depan/belakang
const withZero = [0, ...arr1];
const withSeven = [...arr1, 7];
console.log(withZero); // [0, 1, 2, 3]
console.log(withSeven); // [1, 2, 3, 7]

// Copy array (shallow)
const copy = [...arr1];
copy.push(4);
console.log(arr1); // [1, 2, 3] - tidak berubah
console.log(copy); // [1, 2, 3, 4]

// Convert iterable ke array
const str = "hello";
const chars = [...str];
console.log(chars); // ["h", "e", "l", "l", "o"]

const set = new Set([1, 2, 3, 3, 3]);
const unique = [...set];
console.log(unique); // [1, 2, 3]
```

## Metode Tambahan ES2023+

```javascript
const arr = [1, 2, 3, 4, 5];

// toReversed() - reverse tanpa mutasi
const reversed = arr.toReversed();
console.log(arr); // [1, 2, 3, 4, 5]
console.log(reversed); // [5, 4, 3, 2, 1]

// toSpliced() - splice tanpa mutasi
const spliced = arr.toSpliced(1, 2, "a", "b");
console.log(arr); // [1, 2, 3, 4, 5]
console.log(spliced); // [1, "a", "b", 4, 5]

// with() - mengganti element tanpa mutasi
const replaced = arr.with(2, "three");
console.log(arr); // [1, 2, 3, 4, 5]
console.log(replaced); // [1, 2, "three", 4, 5]

// Array.from() - membuat array dari iterable
const arrayLike = { 0: "a", 1: "b", length: 2 };
const realArray = Array.from(arrayLike);
console.log(realArray); // ["a", "b"]

// Array.from() dengan mapping
const numbers = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(numbers); // [1, 2, 3, 4, 5]

// Array.isArray()
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray("hello")); // false
console.log(Array.isArray({ length: 5 })); // false
```

## Best Practices

### 1. Gunakan Method yang Tidak Mutasi
```javascript
// ❌ Mutasi array asli
const arr = [3, 1, 2];
arr.sort();

// ✅ Tidak mutasi
const sorted = arr.toSorted();
```

### 2. Prefer map/filter/reduce daripada loop
```javascript
// ❌ Loop tradisional
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}

// ✅ Functional approach
const doubled = numbers.map(n => n * 2);
```

### 3. Gunakan const untuk array
```javascript
// ✅ Array bisa dimodifikasi meskipun const
const arr = [1, 2, 3];
arr.push(4); // ✅ Boleh
// arr = [4, 5, 6]; // ❌ Error
```

### 4. Hati-hati dengan Reference
```javascript
const arr1 = [1, 2, 3];
const arr2 = arr1; // Reference yang sama
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] - ikut berubah!

// ✅ Copy dengan spread
const arr3 = [...arr1];
```

## Kesimpulan

Array adalah struktur data yang sangat powerful di JavaScript. Dengan menguasai metode-metode seperti map, filter, dan reduce, kamu bisa menulis kode yang lebih bersih dan fungsional.

**Metode yang Wajib Dikuasai:**
1. `map()` - Transformasi data
2. `filter()` - Menyaring data
3. `reduce()` - Agregasi data
4. `find()` - Mencari element
5. `sort()` - Mengurutkan data
6. `includes()` - Mengecek keberadaan
7. `splice()` / `slice()` - Manipulasi array

**Tips:**
- Gunakan method chaining untuk operasi kompleks
- Hindari mutasi array asli
- Manfaatkan destructuring dan spread operator
- Pelajari perbedaan shallow vs deep copy

Di tutorial berikutnya, kita akan membahas Object di JavaScript! 🚀
