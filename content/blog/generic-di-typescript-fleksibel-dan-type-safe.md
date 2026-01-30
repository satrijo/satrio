---
title: "Generic di TypeScript: Fleksibel dan Type-Safe"
date: 2026-02-08T00:00:00.000Z
description: "Pelajari konsep generic programming di TypeScript. Dari generic dasar hingga advanced patterns seperti conditional types dan mapped types dengan generic."
category: TypeScript
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

Generic adalah salah satu fitur paling powerful dalam TypeScript yang memungkinkan Anda menulis kode yang fleksibel, reusable, dan tetap type-safe. Dengan generic, Anda dapat membuat komponen yang bekerja dengan berbagai tipe data tanpa kehilangan informasi tipe. Artikel ini akan membahas secara komprehensif tentang generic di TypeScript, dari konsep dasar hingga pola-pola lanjutan yang digunakan dalam pengembangan aplikasi modern.

## Apa itu Generic?

Generic memungkinkan Anda membuat komponen yang dapat bekerja dengan berbagai tipe data sambil mempertahankan type safety. Alih-alih menggunakan tipe `any` yang menghilangkan type checking, generic memungkinkan Anda menangkap tipe yang diberikan pengguna dan menggunakan tipe tersebut di seluruh kode Anda.

### Masalah yang Diselesaikan Generic

Tanpa generic, Anda memiliki beberapa opsi, masing-masing dengan kelemahan:

```typescript
// Opsi 1: Menggunakan any (kehilangan type safety)
function identityAny(arg: any): any {
  return arg;
}

const result1 = identityAny("hello");
// result1 bertipe any, kita kehilangan informasi bahwa ini seharusnya string

// Opsi 2: Overloading (verbose dan tidak scalable)
function identityString(arg: string): string {
  return arg;
}

function identityNumber(arg: number): number {
  return arg;
}

// Opsi 3: Union types (terbatas pada tipe yang didefinisikan)
function identityUnion(arg: string | number): string | number {
  return arg;
}
```

Dengan generic, Anda dapat menulis satu implementasi yang bekerja dengan tipe apa pun:

```typescript
// Generic solution
function identity<T>(arg: T): T {
  return arg;
}

const resultString = identity<string>("hello"); // T adalah string
const resultNumber = identity<number>(42); // T adalah number
const resultBoolean = identity(true); // Type inference: T adalah boolean
```

## Generic Dasar

### Generic Functions

Generic functions adalah cara paling umum untuk menggunakan generic:

```typescript
// Generic function dasar
function identity<T>(arg: T): T {
  return arg;
}

// Penggunaan dengan explicit type argument
let output1 = identity<string>("myString");

// Penggunaan dengan type inference
let output2 = identity("myString"); // TypeScript menginfer T sebagai string
let output3 = identity(123); // TypeScript menginfer T sebagai number

// Generic dengan multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>("hello", 42);
// result bertipe [string, number]

// Type inference juga bekerja di sini
const result2 = pair("world", 100); // [string, number]
```

### Generic dengan Constraints

Kadang Anda ingin membatasi tipe yang dapat digunakan dengan generic. Constraints memungkinkan Anda menentukan bahwa tipe harus memiliki properti atau method tertentu:

```typescript
// Constraint dengan extends
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Valid: string memiliki property length
logLength("hello"); 

// Valid: array memiliki property length
logLength([1, 2, 3]);

// Valid: object dengan length property
logLength({ length: 10, value: 100 });

// Error: number tidak memiliki property length
// logLength(123);

// Constraint dengan keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: "Budi",
  age: 25,
  email: "budi@example.com"
};

const userName = getProperty(user, "name"); // string
const userAge = getProperty(user, "age"); // number
// const invalid = getProperty(user, "invalid"); // Error: "invalid" tidak ada di user
```

### Generic Interfaces

Interface dapat menggunakan generic untuk mendefinisikan struktur yang fleksibel:

```typescript
// Generic interface dasar
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(newValue: T): void;
}

// Implementasi untuk string
const stringContainer: Container<string> = {
  value: "hello",
  getValue() {
    return this.value;
  },
  setValue(newValue) {
    this.value = newValue;
  }
};

// Implementasi untuk number
const numberContainer: Container<number> = {
  value: 42,
  getValue() {
    return this.value;
  },
  setValue(newValue) {
    this.value = newValue;
  }
};

// Generic interface dengan multiple parameters
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const pair1: KeyValuePair<string, number> = {
  key: "id",
  value: 123
};

const pair2: KeyValuePair<number, string> = {
  key: 1,
  value: "satu"
};

// Generic interface dengan default type
interface Response<T = any> {
  data: T;
  status: number;
  message: string;
}

// Menggunakan default type
const genericResponse: Response = {
  data: { anything: "goes" },
  status: 200,
  message: "Success"
};

// Mengoverride default type
const userResponse: Response<User> = {
  data: { id: 1, name: "Budi" },
  status: 200,
  message: "User found"
};
```

### Generic Classes

Class juga dapat menggunakan generic, memungkinkan Anda membuat struktur data yang reusable:

```typescript
// Generic class untuk Stack
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Stack untuk number
const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push(20);
numberStack.push(30);
console.log(numberStack.pop()); // 30

// Stack untuk string
const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
console.log(stringStack.peek()); // "world"

// Generic class dengan constraints
interface Entity {
  id: string | number;
}

class Repository<T extends Entity> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: T["id"]): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  delete(id: T["id"]): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Menggunakan Repository
interface User extends Entity {
  id: number;
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: "Budi", email: "budi@example.com" });
userRepo.add({ id: 2, name: "Andi", email: "andi@example.com" });

const user = userRepo.findById(1);
console.log(user?.name); // "Budi"
```

### Generic Type Aliases

Type aliases dapat menggunakan generic untuk membuat tipe yang lebih kompleks:

```typescript
// Generic type alias
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

let maybeString: Maybe<string> = "hello";
maybeString = null;
maybeString = undefined;

// Generic type alias untuk function
type Mapper<T, U> = (item: T) => U;
type Predicate<T> = (item: T) => boolean;
type Comparator<T> = (a: T, b: T) => number;

// Menggunakan type aliases
const stringToLength: Mapper<string, number> = (str) => str.length;
const isPositive: Predicate<number> = (num) => num > 0;
const compareNumbers: Comparator<number> = (a, b) => a - b;

// Generic type alias untuk object
type ApiResponse<T> = {
  data: T;
  status: number;
  error?: string;
};

type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
```

## Generic dengan Array dan Promise

### Generic Array Operations

```typescript
// Generic function untuk array operations
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function groupBy<T, K extends keyof any>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

// Penggunaan
const numbers = [1, 2, 3, 4, 5];
console.log(first(numbers)); // 1
console.log(last(numbers)); // 5

const nested = [[1, 2], [3, 4], [5, 6]];
console.log(flatten(nested)); // [1, 2, 3, 4, 5, 6]

const duplicates = [1, 2, 2, 3, 3, 3];
console.log(unique(duplicates)); // [1, 2, 3]

interface Product {
  category: string;
  name: string;
  price: number;
}

const products: Product[] = [
  { category: "electronics", name: "Laptop", price: 1000 },
  { category: "electronics", name: "Phone", price: 500 },
  { category: "clothing", name: "Shirt", price: 50 }
];

const grouped = groupBy(products, p => p.category);
// { electronics: [...], clothing: [...] }
```

### Generic dengan Promise

```typescript
// Generic async function
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

async function loadUser(userId: number): Promise<User> {
  return fetchData<User>(`/api/users/${userId}`);
}

// Generic Promise utilities
type PromiseValue<T> = T extends Promise<infer V> ? V : T;

async function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await delay(delayMs, undefined);
      }
    }
  }
  
  throw lastError!;
}

// Generic Promise.all dengan proper typing
async function allTyped<T extends readonly unknown[]>(
  promises: readonly [...{ [K in keyof T]: Promise<T[K]> }]
): Promise<T> {
  return Promise.all(promises) as Promise<T>;
}

// Usage
const [users, posts, comments] = await allTyped([
  fetchData<User[]>("/api/users"),
  fetchData<Post[]>("/api/posts"),
  fetchData<Comment[]>("/api/comments")
]);
// users: User[], posts: Post[], comments: Comment[]
```

## Advanced Generic Patterns

### Conditional Types dengan Generic

Conditional types memungkinkan Anda membuat tipe yang berubah berdasarkan kondisi:

```typescript
// Conditional type dasar
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<number[]>; // true
type B = IsArray<string>; // false

// Conditional type dengan infer
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type C = ArrayElement<number[]>; // number
type D = ArrayElement<string[]>; // string

// Conditional type untuk unwrap promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type E = UnwrapPromise<Promise<string>>; // string
type F = UnwrapPromise<number>; // number

// Conditional type untuk function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function greet(name: string, age: number): string {
  return `Hello ${name}, you are ${age}`;
}

type GreetReturn = ReturnType<typeof greet>; // string
type GreetParams = Parameters<typeof greet>; // [string, number]

// Conditional type untuk memilih tipe
type NonNullable<T> = T extends null | undefined ? never : T;

type G = NonNullable<string | null | undefined>; // string

// Nested conditional types
type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

interface NestedObject {
  a: {
    b: {
      c: string;
      d: number[];
    };
  };
}

type ReadonlyNested = DeepReadonly<NestedObject>;
// Semua properti sekarang readonly, termasuk yang nested
```

### Mapped Types dengan Generic

Mapped types memungkinkan Anda membuat tipe baru dengan memetakan properti dari tipe yang ada:

```typescript
// Mapped type dasar
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Mapped type dengan key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; getEmail: () => string }

// Mapped type dengan filter
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type StringProperties = PickByType<User, string>;
// { name: string; email: string }

// Mapped type dengan transformasi nilai
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type Stringify<T> = {
  [P in keyof T]: string;
};

// Complex mapped type
type EventPayload<T> = {
  [K in keyof T as `${string & K}Changed`]: {
    oldValue: T[K];
    newValue: T[K];
  };
};

type UserEvents = EventPayload<User>;
// { nameChanged: { oldValue: string; newValue: string }; ... }
```

### Generic dengan Class dan Inheritance

```typescript
// Generic base class
abstract class Service<T extends Entity> {
  protected abstract endpoint: string;

  async findById(id: T["id"]): Promise<T | null> {
    const response = await fetch(`${this.endpoint}/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async findAll(): Promise<T[]> {
    const response = await fetch(this.endpoint);
    return response.json();
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// Concrete implementations
interface User extends Entity {
  id: number;
  name: string;
  email: string;
}

interface Product extends Entity {
  id: string;
  name: string;
  price: number;
  stock: number;
}

class UserService extends Service<User> {
  protected endpoint = "/api/users";

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(u => u.email === email) || null;
  }
}

class ProductService extends Service<Product> {
  protected endpoint = "/api/products";

  async findInStock(): Promise<Product[]> {
    const products = await this.findAll();
    return products.filter(p => p.stock > 0);
  }
}

// Generic mixin pattern
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();

    updateTimestamp() {
      this.updatedAt = new Date();
    }
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = true;

    activate() {
      this.isActive = true;
    }

    deactivate() {
      this.isActive = false;
    }
  };
}

// Compose mixins
class User {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User);
const ActivatableTimestampedUser = Activatable(TimestampedUser);

const user = new ActivatableTimestampedUser("Budi");
console.log(user.createdAt); // Date
console.log(user.isActive); // true
```

### Generic Constraints Lanjutan

```typescript
// Multiple constraints dengan intersection
type HasId = { id: string | number };
type HasTimestamp = { createdAt: Date; updatedAt: Date };
type HasName = { name: string };

function processEntity<T extends HasId & HasTimestamp & HasName>(
  entity: T
): void {
  console.log(`Processing ${entity.name} (ID: ${entity.id})`);
  console.log(`Created: ${entity.createdAt}`);
}

// Constraint dengan conditional types
type StringKeyOf<T> = keyof T extends string ? keyof T : never;

function getStringKeys<T extends Record<string, any>>(obj: T): StringKeyOf<T>[] {
  return Object.keys(obj) as StringKeyOf<T>[];
}

// Constraint dengan default type
interface PaginationOptions<T = any> {
  page: number;
  pageSize: number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
}

function paginate<T>(
  items: T[],
  options: PaginationOptions<T>
): { items: T[]; total: number } {
  const { page, pageSize, sortBy, sortOrder } = options;
  
  let result = [...items];
  
  if (sortBy) {
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }
  
  const start = (page - 1) * pageSize;
  const paginatedItems = result.slice(start, start + pageSize);
  
  return {
    items: paginatedItems,
    total: items.length
  };
}

// Recursive constraint
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

function traverseTree<T>(
  node: TreeNode<T>,
  callback: (value: T) => void
): void {
  callback(node.value);
  if (node.children) {
    node.children.forEach(child => traverseTree(child, callback));
  }
}
```

## Generic dalam Praktik Nyata

### API Client Generic

```typescript
// Generic API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    const response = await fetch(`${this.baseUrl}${endpoint}${queryString}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async post<T, U>(endpoint: string, data: T): Promise<U> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async put<T, U>(endpoint: string, data: T): Promise<U> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}

// Usage
const api = new ApiClient("https://api.example.com");

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserDTO {
  name: string;
  email: string;
}

// Type-safe API calls
const users = await api.get<User[]>("/users");
const user = await api.get<User>("/users/1");
const newUser = await api.post<CreateUserDTO, User>("/users", {
  name: "Budi",
  email: "budi@example.com"
});
const updatedUser = await api.put<Partial<User>, User>("/users/1", {
  name: "Budi Santoso"
});
```

### State Management Generic

```typescript
// Generic state management
type Action<T = any> = {
  type: string;
  payload?: T;
};

type Reducer<S, A extends Action> = (state: S, action: A) => S;

type Listener<S> = (state: S) => void;

class Store<S, A extends Action> {
  private state: S;
  private reducer: Reducer<S, A>;
  private listeners: Set<Listener<S>> = new Set();

  constructor(reducer: Reducer<S, A>, initialState: S) {
    this.reducer = reducer;
    this.state = initialState;
  }

  getState(): S {
    return this.state;
  }

  dispatch(action: A): void {
    this.state = this.reducer(this.state, action);
    this.notify();
  }

  subscribe(listener: Listener<S>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Usage
interface CounterState {
  count: number;
}

interface CounterAction extends Action {
  type: "INCREMENT" | "DECREMENT" | "RESET";
  payload?: number;
}

const counterReducer: Reducer<CounterState, CounterAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + (action.payload || 1) };
    case "DECREMENT":
      return { count: state.count - (action.payload || 1) };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
};

const store = new Store(counterReducer, { count: 0 });

store.subscribe(state => console.log(`Count: ${state.count}`));

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT", payload: 5 });
store.dispatch({ type: "DECREMENT" });
```

### Generic Form Handler

```typescript
// Generic form handler
type ValidationRule<T> = {
  validator: (value: T) => boolean;
  message: string;
};

type FormField<T> = {
  value: T;
  errors: string[];
  touched: boolean;
  rules: ValidationRule<T>[];
};

type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

class FormHandler<T extends Record<string, any>> {
  private state: FormState<T>;

  constructor(initialValues: T, rules: { [K in keyof T]: ValidationRule<T[K]>[] }) {
    this.state = {} as FormState<T>;
    
    for (const key in initialValues) {
      this.state[key] = {
        value: initialValues[key],
        errors: [],
        touched: false,
        rules: rules[key] || []
      };
    }
  }

  getState(): FormState<T> {
    return this.state;
  }

  setValue<K extends keyof T>(key: K, value: T[K]): void {
    this.state[key].value = value;
    this.validateField(key);
  }

  touchField<K extends keyof T>(key: K): void {
    this.state[key].touched = true;
    this.validateField(key);
  }

  private validateField<K extends keyof T>(key: K): void {
    const field = this.state[key];
    field.errors = [];

    for (const rule of field.rules) {
      if (!rule.validator(field.value)) {
        field.errors.push(rule.message);
      }
    }
  }

  validateAll(): boolean {
    for (const key in this.state) {
      this.touchField(key);
    }
    return this.isValid();
  }

  isValid(): boolean {
    return Object.values(this.state).every(
      field => field.errors.length === 0
    );
  }

  getValues(): T {
    const values = {} as T;
    for (const key in this.state) {
      values[key] = this.state[key].value;
    }
    return values;
  }
}

// Usage
interface LoginForm {
  email: string;
  password: string;
}

const loginForm = new FormHandler<LoginForm>(
  { email: "", password: "" },
  {
    email: [
      { validator: v => v.length > 0, message: "Email is required" },
      { validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Invalid email" }
    ],
    password: [
      { validator: v => v.length > 0, message: "Password is required" },
      { validator: v => v.length >= 8, message: "Password must be at least 8 characters" }
    ]
  }
);

loginForm.setValue("email", "budi@example.com");
loginForm.setValue("password", "password123");

if (loginForm.validateAll()) {
  console.log("Form is valid:", loginForm.getValues());
}
```

## Best Practices untuk Generic

### 1. Gunakan Nama Type Parameter yang Bermakna

```typescript
// ❌ Nama yang tidak bermakna
function process<T, U, V>(a: T, b: U): V {
  // implementation
}

// ✅ Nama yang deskriptif
function transform<Input, Output>(
  input: Input,
  transformer: (item: Input) => Output
): Output {
  return transformer(input);
}

// Konvensi umum:
// T = Type
// K = Key
// V = Value
// E = Element
// R = Return
```

### 2. Gunakan Constraints dengan Bijak

```typescript
// ❌ Terlalu longgar
function process<T>(item: T): T {
  // item bisa apa saja, tidak ada yang bisa dilakukan
  return item;
}

// ✅ Constraint yang tepat
interface Comparable {
  compareTo(other: this): number;
}

function findMax<T extends Comparable>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  
  let max = items[0];
  for (let i = 1; i < items.length; i++) {
    if (items[i].compareTo(max) > 0) {
      max = items[i];
    }
  }
  return max;
}
```

### 3. Hindari Generic yang Terlalu Kompleks

```typescript
// ❌ Terlalu kompleks dan sulit dibaca
type Complex<T, U, V, W, X> = T extends U
  ? V extends W
    ? X
    : never
  : never;

// ✅ Pisahkan menjadi type yang lebih kecil
type Step1<T, U> = T extends U ? true : false;
type Step2<V, W> = V extends W ? true : false;
type Combined<T, U, V, W, X> = Step1<T, U> extends true
  ? Step2<V, W> extends true
    ? X
    : never
  : never;
```

### 4. Dokumentasikan Generic Types

```typescript
/**
 * Creates a paginated response from an array of items
 * @template T - The type of items being paginated
 * @param items - The full array of items
 * @param page - The current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated result with metadata
 */
function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  
  return { data, total, page, pageSize, totalPages };
}
```

### 5. Manfaatkan Type Inference

```typescript
// ❌ Explicit type arguments yang tidak perlu
const result = identity<string>("hello");

// ✅ Biarkan TypeScript menginfer tipe
const result = identity("hello");

// Explicit type arguments hanya saat diperlukan
const numbers = [1, 2, 3, 4, 5];
const strings = numbers.map<String>(n => n.toString());
```

## Kesimpulan

Generic adalah fitur fundamental TypeScript yang memungkinkan Anda menulis kode yang fleksibel, reusable, dan type-safe. Dengan menguasai generic, Anda dapat membuat abstraksi yang powerful tanpa mengorbankan type safety.

Dari generic functions dan classes hingga advanced patterns seperti conditional types dan mapped types, generic menyediakan fondasi untuk banyak fitur TypeScript yang lebih canggih. Praktik terbaik seperti penggunaan constraints yang tepat, nama type parameter yang bermakna, dan pemanfaatan type inference akan membantu Anda menulis kode generic yang bersih dan mudah dipelihara.

Ingatlah bahwa tujuan dari generic adalah untuk membuat kode lebih reusable sambil mempertahankan type safety. Gunakan generic ketika Anda melihat pola yang berulang dengan tipe yang berbeda, tetapi hindari over-engineering dengan membuat generic yang terlalu kompleks untuk kasus yang sederhana.
