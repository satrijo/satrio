---
title: "Type System di TypeScript: Type dan Interface"
date: 2026-02-07T00:00:00.000Z
description: "Pelajari perbedaan type dan interface di TypeScript, cara menggunakan union types, intersection types, dan teknik type system lanjutan untuk kode yang lebih robust."
category: TypeScript
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

Sistem tipe TypeScript adalah salah satu fitur paling powerful yang membedakannya dari JavaScript. Dalam artikel ini, kita akan membahas secara mendalam tentang type dan interface, dua konsep fundamental yang menjadi fondasi dari type system TypeScript. Kita juga akan menjelajahi berbagai teknik lanjutan seperti union types, intersection types, dan pola-pola desain yang akan membantu Anda menulis kode TypeScript yang lebih robust dan maintainable.

## Memahami Type System TypeScript

TypeScript menggunakan sistem tipe structural typing, yang berarti type compatibility ditentukan berdasarkan struktur atau bentuk tipe, bukan nama tipe seperti dalam nominal typing. Ini memungkinkan fleksibilitas yang tinggi dalam bekerja dengan objek dan interface.

### Structural Typing vs Nominal Typing

```typescript
// Dalam nominal typing (Java, C#), ini akan error
// Dalam structural typing (TypeScript), ini valid

interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

let point2D: Point2D = { x: 0, y: 0 };
let point3D: Point3D = { x: 0, y: 0, z: 0 };

// Valid: Point3D memiliki semua properti Point2D
point2D = point3D;

// Error: Point2D tidak memiliki properti 'z'
// point3D = point2D;
```

Pendekatan structural typing ini memungkinkan duck typing yang powerful, di mana Anda dapat menggunakan objek apa pun yang memiliki struktur yang cocok tanpa perlu inheritance atau implementasi interface secara eksplisit.

## Type Aliases

Type aliases memberikan nama untuk tipe apa pun, termasuk primitive, union, tuple, dan object types. Mereka sangat berguna untuk membuat kode lebih readable dan reusable.

### Mendefinisikan Type Aliases

```typescript
// Type alias untuk primitive
type UserID = string;
type Age = number;
type IsActive = boolean;

let userId: UserID = "user-123";
let userAge: Age = 25;
let active: IsActive = true;

// Type alias untuk object
type User = {
  id: UserID;
  name: string;
  email: string;
  age: Age;
  isActive: IsActive;
};

// Type alias untuk union
type Status = "pending" | "processing" | "completed" | "failed";
type ID = string | number;

// Type alias untuk tuple
type Point = [number, number];
type UserTuple = [string, number, boolean];

// Type alias untuk function
type MathOperation = (a: number, b: number) => number;
type StringTransformer = (input: string) => string;
```

### Type Aliases dengan Generic

Type aliases dapat bekerja dengan generics untuk membuat tipe yang lebih fleksibel:

```typescript
// Generic type alias
type Container<T> = {
  value: T;
  timestamp: Date;
};

const stringContainer: Container<string> = {
  value: "Hello",
  timestamp: new Date()
};

const numberContainer: Container<number> = {
  value: 42,
  timestamp: new Date()
};

// Generic dengan constraints
type HasLength = {
  length: number;
};

type LengthContainer<T extends HasLength> = {
  data: T;
  length: number;
};

const stringLength: LengthContainer<string> = {
  data: "Hello World",
  length: 11
};

const arrayLength: LengthContainer<number[]> = {
  data: [1, 2, 3, 4, 5],
  length: 5
};
```

## Interfaces

Interface adalah cara utama untuk mendefinisikan kontrak struktural dalam TypeScript. Mereka sangat mirip dengan type aliases untuk object types, tetapi memiliki beberapa fitur tambahan.

### Interface Dasar

```typescript
// Interface sederhana
interface Person {
  firstName: string;
  lastName: string;
  age: number;
}

const person: Person = {
  firstName: "John",
  lastName: "Doe",
  age: 30
};

// Interface dengan readonly properties
interface Config {
  readonly apiUrl: string;
  readonly apiKey: string;
  timeout: number;
}

const config: Config = {
  apiUrl: "https://api.example.com",
  apiKey: "secret-key",
  timeout: 5000
};

// config.apiUrl = "https://other.com"; // Error: Cannot assign

// Interface dengan optional properties
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discount?: number;
}

const product1: Product = {
  id: 1,
  name: "Laptop",
  price: 10000000
};

const product2: Product = {
  id: 2,
  name: "Mouse",
  description: "Wireless mouse",
  price: 250000,
  discount: 10
};
```

### Interface dengan Methods

```typescript
// Interface dengan method signatures
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number | null;
}

const basicCalculator: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : null
};

// Interface dengan method overload
interface StringUtil {
  pad(input: string): string;
  pad(input: string, length: number): string;
  pad(input: string, length: number, char: string): string;
}

const stringUtil: StringUtil = {
  pad(input: string, length: number = 10, char: string = " "): string {
    while (input.length < length) {
      input = char + input;
    }
    return input;
  }
};
```

### Interface Extension

Salah satu fitur paling powerful dari interface adalah kemampuannya untuk di-extend:

```typescript
// Interface dasar
interface Animal {
  name: string;
  age: number;
  makeSound(): void;
}

// Interface extension
interface Dog extends Animal {
  breed: string;
  isTrained: boolean;
  fetch(): void;
}

const myDog: Dog = {
  name: "Buddy",
  age: 3,
  breed: "Golden Retriever",
  isTrained: true,
  makeSound: () => console.log("Woof!"),
  fetch: () => console.log("Fetching ball...")
};

// Multiple interface extension
interface CanFly {
  wingspan: number;
  fly(): void;
}

interface CanSwim {
  swimSpeed: number;
  swim(): void;
}

interface Duck extends Animal, CanFly, CanSwim {
  featherColor: string;
}

const duck: Duck = {
  name: "Donald",
  age: 2,
  wingspan: 1.5,
  swimSpeed: 5,
  featherColor: "white",
  makeSound: () => console.log("Quack!"),
  fly: () => console.log("Flying..."),
  swim: () => console.log("Swimming...")
};
```

### Interface Declaration Merging

Interface mendukung declaration merging, di mana multiple declarations dengan nama yang sama digabungkan menjadi satu:

```typescript
// Declaration 1
interface User {
  name: string;
  email: string;
}

// Declaration 2 - digabung dengan declaration 1
interface User {
  age: number;
  isActive: boolean;
}

// User sekarang memiliki semua properti
const user: User = {
  name: "Budi",
  email: "budi@example.com",
  age: 25,
  isActive: true
};
```

Fitur ini sangat berguna untuk augmenting types dari library eksternal atau untuk modularisasi definisi tipe yang kompleks.

## Perbedaan Type vs Interface

Meskipun type dan interface sering dapat digunakan secara bergantian, ada beberapa perbedaan penting:

### 1. Declaration Merging

```typescript
// Interface mendukung declaration merging
interface Window {
  myLib: any;
}

interface Window {
  customProperty: string;
}

// Window sekarang memiliki myLib dan customProperty

// Type alias TIDAK mendukung declaration merging
type MyType = {
  a: string;
};

// Error: Duplicate identifier 'MyType'
// type MyType = {
//   b: number;
// };
```

### 2. Extends vs Intersection

```typescript
// Interface menggunakan extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Type alias menggunakan intersection
type Animal2 = {
  name: string;
};

type Dog2 = Animal2 & {
  breed: string;
};

// Perbedaan dalam handling conflicts
interface A {
  x: string;
}

interface B extends A {
  x: "specific"; // Override
}

type A2 = {
  x: string;
};

type B2 = A2 & {
  x: "specific"; // Intersection: never
};

const b: B2 = { x: "specific" }; // Error: Type 'string' is not assignable
```

### 3. Union Types

```typescript
// Type alias dapat mendefinisikan union types
type Status = "active" | "inactive" | "pending";
type ID = string | number;
type Result<T> = T | Error;

// Interface tidak dapat langsung mendefinisikan union
// interface StatusUnion = "active" | "inactive"; // Error

// Tetapi interface dapat digunakan dalam union
type StringOrNumber = string | number;
```

### 4. Mapped Types

```typescript
// Type alias mendukung mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Interface tidak mendukung mapped types secara langsung
```

### Kapan Menggunakan Type vs Interface

**Gunakan Interface ketika:**
- Mendefinisikan bentuk objek atau class
- Membutuhkan declaration merging
- Membangun hierarki inheritance yang kompleks
- Mendefinisikan kontrak untuk implementasi

**Gunakan Type ketika:**
- Membutuhkan union types
- Membutuhkan mapped types
- Mendefinisikan tuple atau function types
- Membuat type aliases untuk primitive
- Menggunakan conditional types

## Union Types

Union types memungkinkan nilai dengan beberapa tipe yang berbeda, menggunakan operator pipe (`|`).

### Union Types Dasar

```typescript
// Union dari primitive types
let id: string | number;
id = "abc123"; // valid
id = 123; // valid
// id = true; // Error

// Union dalam parameter fungsi
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

printId("user-001");
printId(42);

// Union dalam return type
function parseInput(input: string): number | null {
  const parsed = parseInt(input, 10);
  return isNaN(parsed) ? null : parsed;
}
```

### Type Narrowing

Ketika bekerja dengan union types, Anda perlu menggunakan type narrowing untuk mengakses properti spesifik:

```typescript
function processValue(value: string | number | boolean): void {
  // Type narrowing dengan typeof
  if (typeof value === "string") {
    // value adalah string di sini
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    // value adalah number di sini
    console.log(value.toFixed(2));
  } else {
    // value adalah boolean di sini
    console.log(value ? "Yes" : "No");
  }
}

// Type narrowing dengan instanceof
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// Type narrowing dengan in operator
interface Car {
  drive(): void;
}

interface Boat {
  sail(): void;
}

function operate(vehicle: Car | Boat): void {
  if ("drive" in vehicle) {
    vehicle.drive();
  } else {
    vehicle.sail();
  }
}
```

### Discriminated Unions

Discriminated unions adalah pola yang sangat berguna untuk state management:

```typescript
// Definisikan tag/discriminant
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: User[];
}

interface ErrorState {
  status: "error";
  error: Error;
}

type State = LoadingState | SuccessState | ErrorState;

// Penggunaan dengan type narrowing
function handleState(state: State): void {
  switch (state.status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      // TypeScript tahu state.data ada di sini
      console.log(`Loaded ${state.data.length} users`);
      break;
    case "error":
      // TypeScript tahu state.error ada di sini
      console.error(state.error.message);
      break;
  }
}
```

### Literal Types dalam Union

Literal types memungkinkan Anda membatasi nilai ke nilai spesifik:

```typescript
// String literal union
type Direction = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type LogLevel = "debug" | "info" | "warn" | "error";

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

move("north"); // valid
// move("up"); // Error

// Number literal union
type StatusCode = 200 | 404 | 500;
type Rating = 1 | 2 | 3 | 4 | 5;

// Boolean literal union (kurang umum)
type FeatureFlag = true | false;
```

## Intersection Types

Intersection types menggabungkan multiple tipe menjadi satu tipe yang memiliki semua properti dari tipe-tipe tersebut.

### Intersection Types Dasar

```typescript
// Intersection dari dua object types
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

// Intersection dengan lebih dari dua tipe
type HasEmail = {
  email: string;
};

type User = HasName & HasAge & HasEmail;

const user: User = {
  name: "Andi",
  age: 30,
  email: "andi@example.com"
};
```

### Intersection dengan Union

Intersection dan union dapat dikombinasikan untuk tipe yang kompleks:

```typescript
// Intersection dari union types
type StringOrNumber = string | number;
type BooleanOrNull = boolean | null;

type Mixed = StringOrNumber & BooleanOrNull;
// Hasil: never (tidak ada nilai yang bisa memenuhi keduanya)

// Union dari intersection types
type Admin = {
  role: "admin";
  permissions: string[];
};

type User2 = {
  role: "user";
  department: string;
};

type Employee = (Admin | User2) & {
  id: number;
  name: string;
};

const adminEmployee: Employee = {
  id: 1,
  name: "Budi",
  role: "admin",
  permissions: ["read", "write", "delete"]
};

const userEmployee: Employee = {
  id: 2,
  name: "Andi",
  role: "user",
  department: "IT"
};
```

### Intersection dengan Conflicting Properties

Ketika tipe yang di-intersect memiliki properti dengan nama sama tetapi tipe berbeda:

```typescript
// Intersection dengan conflicting types
type A = {
  x: string;
};

type B = {
  x: number;
};

type C = A & B;
// x harus bertipe string & number = never

// const c: C = { x: ??? }; // Error

// Intersection dengan compatible types
type D = {
  x: string | number;
};

type E = {
  x: number;
};

type F = D & E;
// x bertipe (string | number) & number = number

const f: F = { x: 42 }; // valid
```

## Advanced Type Techniques

### Index Types

Index types memungkinkan Anda bekerja dengan properti dinamis:

```typescript
// Index signature
type Dictionary = {
  [key: string]: string;
};

const translations: Dictionary = {
  hello: "Halo",
  world: "Dunia",
  goodbye: "Selamat tinggal"
};

// Index signature dengan constraints
type NumberDictionary = {
  [key: string]: number;
};

const scores: NumberDictionary = {
  math: 90,
  science: 85,
  english: 88
};

// Hybrid types
type Hybrid = {
  [key: string]: string | number;
  name: string; // harus sesuai dengan index signature
  age: number;
};
```

### Conditional Types

Conditional types memungkinkan Anda membuat tipe yang bergantung pada kondisi:

```typescript
// Conditional type dasar
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Conditional type dengan infer
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(): string {
  return "Hello";
}

function add(a: number, b: number): number {
  return a + b;
}

type GreetReturn = ReturnType<typeof greet>; // string
type AddReturn = ReturnType<typeof add>; // number

// Conditional type untuk extract array element
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Numbers = number[];
type NumberItem = ArrayElement<Numbers>; // number
```

### Template Literal Types

Template literal types memungkinkan manipulasi string pada level tipe:

```typescript
// Template literal type dasar
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"

// Template literal dengan union
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "/users" | "/posts" | "/comments";
type ApiRoute = `${HttpMethod} ${Endpoint}`;

// Hasil: "GET /users" | "GET /posts" | ... | "DELETE /comments"

// Template literal untuk CSS properties
type MarginSide = "top" | "right" | "bottom" | "left";
type MarginProperty = `margin${Capitalize<MarginSide>}`;
// Hasil: "marginTop" | "marginRight" | "marginBottom" | "marginLeft"
```

### Recursive Types

TypeScript mendukung tipe rekursif untuk struktur data bersarang:

```typescript
// Recursive type untuk tree
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

const tree: TreeNode<string> = {
  value: "root",
  children: [
    {
      value: "child1",
      children: [
        { value: "grandchild1", children: [] },
        { value: "grandchild2", children: [] }
      ]
    },
    {
      value: "child2",
      children: []
    }
  ]
};

// Recursive type untuk linked list
interface LinkedList<T> {
  value: T;
  next: LinkedList<T> | null;
}

const list: LinkedList<number> = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: null
    }
  }
};

// Recursive type untuk JSON
type JSONValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JSONValue[] 
  | { [key: string]: JSONValue };

const jsonData: JSONValue = {
  name: "Budi",
  age: 25,
  hobbies: ["coding", "reading"],
  address: {
    city: "Jakarta",
    country: "Indonesia"
  }
};
```

## Utility Types

TypeScript menyediakan utility types bawaan yang sangat berguna:

### Partial, Required, Readonly

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - membuat semua properti opsional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required - membuat semua properti wajib
type RequiredUser = Required<PartialUser>;
// { id: number; name: string; email: string; age: number }

// Readonly - membuat semua properti readonly
type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; ... }
```

### Pick, Omit, Record

```typescript
// Pick - memilih properti tertentu
type UserBasicInfo = Pick<User, "name" | "email">;
// { name: string; email: string }

// Omit - menghilangkan properti tertentu
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age: number }

// Record - membuat tipe dengan keys dan value type tertentu
type UserRoles = Record<string, string[]>;
const roles: UserRoles = {
  admin: ["read", "write", "delete"],
  user: ["read"]
};

type PageInfo = Record<"home" | "about" | "contact", { title: string; path: string }>;
const pages: PageInfo = {
  home: { title: "Home", path: "/" },
  about: { title: "About", path: "/about" },
  contact: { title: "Contact", path: "/contact" }
};
```

### Exclude, Extract, NonNullable

```typescript
// Exclude - menghilangkan tipe dari union
type T = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type WithoutString = Exclude<string | number | boolean, string>; // number | boolean

// Extract - mengekstrak tipe dari union
type U = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type OnlyString = Extract<string | number | boolean, string>; // string

// NonNullable - menghilangkan null dan undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string
```

### Parameters, ReturnType, InstanceType

```typescript
// Parameters - mendapatkan tipe parameter fungsi
function greet(name: string, age: number): string {
  return `Hello ${name}, you are ${age}`;
}

type GreetParams = Parameters<typeof greet>; // [string, number]

// ReturnType - mendapatkan tipe return fungsi
type GreetReturn = ReturnType<typeof greet>; // string

// InstanceType - mendapatkan tipe instance dari class
class User {
  constructor(public name: string) {}
}

type UserInstance = InstanceType<typeof User>; // User
```

## Best Practices

### 1. Gunakan Interface untuk Public API

```typescript
// ✅ Gunakan interface untuk API publik
interface UserService {
  getUser(id: string): Promise<User>;
  createUser(data: CreateUserDTO): Promise<User>;
  updateUser(id: string, data: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// Implementasi
class UserServiceImpl implements UserService {
  async getUser(id: string): Promise<User> {
    // implementation
  }
  // ... other methods
}
```

### 2. Hindari Any, Gunakan Unknown

```typescript
// ❌ Hindari any
function processData(data: any): any {
  return data.process();
}

// ✅ Gunakan unknown dengan type guards
function processData(data: unknown): string {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  if (Array.isArray(data)) {
    return data.join(", ");
  }
  throw new Error("Unsupported data type");
}
```

### 3. Manfaatkan Type Inference

```typescript
// ❌ Terlalu verbose
const name: string = "Budi";
const age: number = 25;
const isActive: boolean = true;

// ✅ Gunakan type inference
const name = "Budi";
const age = 25;
const isActive = true;

// Tetap tulis tipe untuk API publik
function createUser(name: string, email: string): User {
  // implementation
}
```

### 4. Gunakan Strict Type Checking

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 5. Dokumentasikan Complex Types

```typescript
/**
 * Represents a paginated response from the API
 * @template T - The type of items in the data array
 */
interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
}
```

## Kesimpulan

Memahami type system TypeScript adalah kunci untuk menulis kode yang robust dan maintainable. Type dan interface adalah fondasi dari sistem tipe ini, masing-masing dengan kelebihan dan use case-nya sendiri. Union types dan intersection types memberikan fleksibilitas untuk memodelkan data yang kompleks, sementara teknik-teknik lanjutan seperti conditional types dan template literal types membuka kemungkinan untuk type-level programming yang powerful.

Pilihan antara type dan interface sering kali bergantung pada preferensi dan kebutuhan spesifik proyek Anda. Interface lebih baik untuk OOP patterns dan declaration merging, sementara type lebih fleksibel untuk union types dan mapped types. Yang terpenting adalah konsistensi dalam codebase Anda.

Dengan menguasai konsep-konsep ini, Anda akan dapat memanfaatkan TypeScript secara maksimal untuk membangun aplikasi yang type-safe, mudah di-refactor, dan lebih mudah dipelihara. Ingatlah untuk selalu menggunakan strict mode dan menghindari `any` untuk mendapatkan manfaat penuh dari TypeScript.
