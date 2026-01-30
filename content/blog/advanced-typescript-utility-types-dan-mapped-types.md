---
title: "Advanced TypeScript: Utility Types dan Mapped Types"
date: 2026-02-09T00:00:00.000Z
description: "Kuasai utility types bawaan TypeScript dan pelajari cara membuat mapped types sendiri. Transformasi tipe yang powerful untuk kode yang lebih maintainable."
category: TypeScript
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

TypeScript menyediakan serangkaian utility types yang sangat powerful untuk transformasi tipe, serta kemampuan untuk membuat mapped types yang memungkinkan manipulasi tipe secara deklaratif. Artikel ini akan membahas secara mendalam utility types bawaan TypeScript, cara kerja mapped types, dan bagaimana Anda dapat membuat utility types kustom untuk kebutuhan spesifik proyek Anda.

## Pengenalan Utility Types

Utility types adalah generic types bawaan yang disediakan oleh TypeScript untuk melakukan transformasi tipe yang umum. Mereka membantu Anda mengubah tipe yang ada menjadi tipe baru tanpa harus mendefinisikan ulang dari awal.

### Mengapa Utility Types Penting?

```typescript
// Tanpa utility types, Anda harus mendefinisikan ulang
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Membuat versi readonly manual
interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly isActive: boolean;
}

// Membuat versi partial manual
interface PartialUser {
  id?: number;
  name?: string;
  email?: string;
  age?: number;
  isActive?: boolean;
}

// Dengan utility types, cukup satu baris
type ReadonlyUser2 = Readonly<User>;
type PartialUser2 = Partial<User>;
```

## Utility Types Bawaan

### Partial, Required, dan Readonly

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<T> - Membuat semua properti opsional
type PartialUser = Partial<User>;
// Hasil:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
// }

const partialUser: PartialUser = {
  name: "Budi"
  // Properti lain opsional
};

// Required<T> - Membuat semua properti wajib
type RequiredPartial = Required<PartialUser>;
// Hasil: sama dengan User asli, semua properti wajib

// Readonly<T> - Membuat semua properti readonly
type ReadonlyUser = Readonly<User>;
// Hasil:
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
//   readonly age: number;
// }

const readonlyUser: ReadonlyUser = {
  id: 1,
  name: "Budi",
  email: "budi@example.com",
  age: 25
};

// readonlyUser.name = "Andi"; // Error: Cannot assign

// Kombinasi utility types
type ImmutableUser = Readonly<Partial<User>>;
// Semua properti opsional dan readonly
```

### Pick dan Omit

```typescript
// Pick<T, K> - Memilih properti tertentu
type UserBasicInfo = Pick<User, "name" | "email">;
// Hasil:
// {
//   name: string;
//   email: string;
// }

const basicInfo: UserBasicInfo = {
  name: "Budi",
  email: "budi@example.com"
};

// Omit<T, K> - Menghilangkan properti tertentu
type UserWithoutId = Omit<User, "id">;
// Hasil:
// {
//   name: string;
//   email: string;
//   age: number;
// }

const userWithoutId: UserWithoutId = {
  name: "Andi",
  email: "andi@example.com",
  age: 30
};

// Omit multiple properties
type UserMinimal = Omit<User, "id" | "age">;
// Hasil:
// {
//   name: string;
//   email: string;
// }

// Kombinasi Pick dan Omit
type UserForUpdate = Partial<Omit<User, "id">>;
// Untuk update: id tidak boleh diubah, properti lain opsional
```

### Record

```typescript
// Record<K, T> - Membuat tipe dengan keys K dan value T
type UserRoles = Record<string, string[]>;

const roles: UserRoles = {
  admin: ["read", "write", "delete"],
  user: ["read"],
  guest: []
};

// Record dengan literal union keys
type PageRoutes = Record<"home" | "about" | "contact", string>;

const routes: PageRoutes = {
  home: "/",
  about: "/about",
  contact: "/contact"
  // Error jika ada key yang kurang atau berlebih
};

// Record dengan object value
type PageInfo = Record<string, { title: string; path: string }>;

const pages: PageInfo = {
  home: { title: "Home", path: "/" },
  about: { title: "About", path: "/about" }
};

// Record dengan mapped keys dari union
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoints = Record<HttpMethod, string[]>;

const endpoints: ApiEndpoints = {
  GET: ["/users", "/posts"],
  POST: ["/users", "/posts"],
  PUT: ["/users/:id", "/posts/:id"],
  DELETE: ["/users/:id", "/posts/:id"]
};
```

### Exclude, Extract, dan NonNullable

```typescript
// Exclude<T, U> - Menghilangkan tipe dari union
type T0 = Exclude<"a" | "b" | "c", "a">;
// Hasil: "b" | "c"

type T1 = Exclude<string | number | (() => void), Function>;
// Hasil: string | number

type T2 = Exclude<"admin" | "user" | "guest", "guest">;
// Hasil: "admin" | "user"

// Extract<T, U> - Mengekstrak tipe dari union
type T3 = Extract<"a" | "b" | "c", "a" | "f">;
// Hasil: "a"

type T4 = Extract<string | number | (() => void), Function>;
// Hasil: () => void

type T5 = Extract<string | number | boolean, string | number>;
// Hasil: string | number

// NonNullable<T> - Menghilangkan null dan undefined
type T6 = NonNullable<string | number | undefined>;
// Hasil: string | number

type T7 = NonNullable<string[] | null | undefined>;
// Hasil: string[]

type MaybeUser = User | null | undefined;
type DefinitelyUser = NonNullable<MaybeUser>;
// Hasil: User
```

### Parameters dan ReturnType

```typescript
// Parameters<T> - Mendapatkan tipe parameter fungsi
function greet(name: string, age: number): string {
  return `Hello ${name}, you are ${age}`;
}

type GreetParams = Parameters<typeof greet>;
// Hasil: [string, number]

const params: GreetParams = ["Budi", 25];

// ReturnType<T> - Mendapatkan tipe return fungsi
type GreetReturn = ReturnType<typeof greet>;
// Hasil: string

// Penggunaan dengan generic function
async function fetchUser(id: number): Promise<User> {
  // implementation
  return { id, name: "", email: "", age: 0 };
}

type FetchUserReturn = ReturnType<typeof fetchUser>;
// Hasil: Promise<User>

// Unwrap promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type UserType = UnwrapPromise<FetchUserReturn>;
// Hasil: User
```

### InstanceType dan ThisParameterType

```typescript
// InstanceType<T> - Mendapatkan tipe instance dari class
class User {
  constructor(public name: string, public age: number) {}
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

type UserInstance = InstanceType<typeof User>;
// Hasil: User

const userInstance: UserInstance = new User("Budi", 25);

// ThisParameterType<T> - Mendapatkan tipe parameter 'this'
function toHex(this: Number) {
  return this.toString(16);
}

type ToHexThis = ThisParameterType<typeof toHex>;
// Hasil: Number

// OmitThisParameter<T> - Menghilangkan parameter 'this'
type ToHexWithoutThis = OmitThisParameter<typeof toHex>;
// Hasil: () => string
```

### ThisType

```typescript
// ThisType<T> - Menentukan tipe dari 'this' dalam object literal
interface State {
  count: number;
}

interface Actions {
  increment(): void;
  decrement(): void;
  reset(): void;
}

const stateMachine: State & ThisType<State & Actions> = {
  count: 0,
  increment() {
    this.count++; // 'this' bertipe State & Actions
  },
  decrement() {
    this.count--;
  },
  reset() {
    this.count = 0;
  }
};
```

## Mapped Types

Mapped types adalah cara untuk membuat tipe baru dengan memetakan properti dari tipe yang ada. Mereka adalah fondasi dari banyak utility types bawaan.

### Sintaks Dasar Mapped Types

```typescript
// Template mapped type
type Mapped<T> = {
  [P in keyof T]: T[P];
};

// Readonly<T> implementasi manual
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Partial<T> implementasi manual
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// Required<T> implementasi manual
type MyRequired<T> = {
  [P in keyof T]-?: T[P]; // -? menghilangkan optionality
};

// Nullable<T> - custom mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null }
```

### Key Remapping

TypeScript 4.1+ memungkinkan remapping keys dalam mapped types:

```typescript
// Mengubah nama key dengan template literal
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserGetters = Getters<User>;
// Hasil:
// {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }

// Filter keys berdasarkan tipe
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type UserStringProps = StringKeys<User>;
// { name: string; email: string }

// Event payload dengan key remapping
type EventPayloads<T> = {
  [K in keyof T as `${string & K}Changed`]: {
    oldValue: T[K];
    newValue: T[K];
  };
};

type UserEvents = EventPayloads<User>;
// {
//   nameChanged: { oldValue: string; newValue: string };
//   ageChanged: { oldValue: number; newValue: number };
//   emailChanged: { oldValue: string; newValue: string };
// }

// Remove specific keys
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

type UserWithoutStrings = OmitByType<User, string>;
// { age: number }
```

### Mapped Types dengan Modifiers

```typescript
// Readonly modifier
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface NestedUser {
  name: string;
  address: {
    street: string;
    city: string;
  };
}

type ReadonlyNestedUser = DeepReadonly<NestedUser>;
// Semua properti readonly, termasuk yang nested

// Optional modifier dengan kondisi
type OptionalByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]?: T[P];
} & {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

// Remove readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyConfig {
  readonly apiUrl: string;
  readonly timeout: number;
}

type MutableConfig = Mutable<ReadonlyConfig>;
// { apiUrl: string; timeout: number }
```

## Membuat Utility Types Kustom

### Utility Types untuk API Development

```typescript
// API Response types
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type ApiError = {
  error: string;
  status: number;
  details?: Record<string, string[]>;
};

type ApiResult<T> = ApiResponse<T> | ApiError;

// Pagination types
type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// CRUD operation types
type CreateDTO<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
type UpdateDTO<T> = Partial<CreateDTO<T>>;
type QueryParams<T> = Partial<Pick<T, keyof T>> & {
  page?: number;
  pageSize?: number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
};

// Usage
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateUserDTO = CreateDTO<User>;
// { name: string; email: string }

type UpdateUserDTO = UpdateDTO<User>;
// Partial<{ name: string; email: string }>

type UserQueryParams = QueryParams<User>;
// Partial<User> + pagination params
```

### Utility Types untuk Form Handling

```typescript
// Form field types
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
  valid: boolean;
};

type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// Validation types
type ValidationRule<T> = {
  validator: (value: T) => boolean;
  message: string;
};

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Form actions
type FormActions<T> = {
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setError: <K extends keyof T>(key: K, error: string) => void;
  touchField: <K extends keyof T>(key: K) => void;
  validate: () => boolean;
  reset: () => void;
  getValues: () => T;
};

// Usage
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

type LoginFormState = FormState<LoginForm>;
// {
//   email: FormField<string>;
//   password: FormField<string>;
//   rememberMe: FormField<boolean>;
// }
```

### Utility Types untuk State Management

```typescript
// Redux-like state types
type Action<T = any> = {
  type: string;
  payload?: T;
};

type Reducer<S, A extends Action> = (state: S, action: A) => S;

type Store<S, A extends Action> = {
  getState: () => S;
  dispatch: (action: A) => void;
  subscribe: (listener: (state: S) => void) => () => void;
};

// Async action types
type AsyncAction<T> = {
  pending: Action;
  fulfilled: Action<T>;
  rejected: Action<Error>;
};

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

// Selector types
type Selector<S, R> = (state: S) => R;

type MemoizedSelector<S, R> = Selector<S, R> & {
  clearCache: () => void;
};

// Usage
interface AppState {
  users: User[];
  posts: Post[];
  currentUser: User | null;
}

type SelectUsers = Selector<AppState, User[]>;
type SelectCurrentUser = Selector<AppState, User | null>;
```

### Utility Types untuk Testing

```typescript
// Mock types
type Mock<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? jest.Mock<R, A>
    : T[K];
};

// Partial mock untuk testing
type PartialMock<T> = Partial<Mock<T>>;

// Stub types
type Stub<T> = {
  [K in keyof T]?: T[K] extends (...args: any[]) => any
    ? T[K]
    : T[K];
};

// Test fixture types
type Fixture<T> = T | (() => T) | (() => Promise<T>);

type Fixtures<T extends Record<string, any>> = {
  [K in keyof T]: Fixture<T[K]>;
};

// Usage
interface UserService {
  getUser(id: number): Promise<User>;
  saveUser(user: User): Promise<void>;
  deleteUser(id: number): Promise<boolean>;
}

type MockUserService = Mock<UserService>;
// Semua methods menjadi jest.Mock
```

## Conditional Types Lanjutan

### Infer dalam Conditional Types

```typescript
// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Numbers = number[];
type Num = ArrayElement<Numbers>; // number

// Extract promise resolved type
type Awaited<T> = T extends Promise<infer R> ? R : T;

type PromiseString = Promise<string>;
type ResolvedString = Awaited<PromiseString>; // string

// Extract function parameters
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// Extract function return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract constructor parameters
type ConstructorParameters<T> = T extends new (...args: infer P) => any
  ? P
  : never;

class User {
  constructor(name: string, age: number) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
// [string, number]
```

### Nested Conditional Types

```typescript
// Deep partial
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface Company {
  name: string;
  address: {
    street: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

type PartialCompany = DeepPartial<Company>;
// Semua level menjadi optional

// Flatten array type
type Flatten<T> = T extends (infer U)[]
  ? U extends (infer V)[]
    ? Flatten<V>
    : U
  : T;

type Nested = number[][][];
type Flattened = Flatten<Nested>; // number

// Type-safe path
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string | number
        ? `${K}` | `${K}.${Path<T[K]>}`
        : never;
    }[keyof T]
  : never;

type UserPaths = Path<User>;
// "name" | "email" | "age" | "id"
```

### Distributive Conditional Types

```typescript
// Distributive behavior
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// string[] | number[] (bukan (string | number)[])

// Non-distributive (wrap dalam tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type MixedArray = ToArrayNonDist<string | number>;
// (string | number)[]

// Practical example: Nullable properties
type NullableProperties<T> = {
  [K in keyof T]: T[K] extends NonNullable<T[K]>
    ? T[K] | null
    : T[K];
};

// Filter null from union
type NonNull<T> = T extends null ? never : T;
type StringOrNull = string | null;
type JustString = NonNull<StringOrNull>; // string
```

## Template Literal Types

### Dasar Template Literal Types

```typescript
// Template literal dengan string
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"

// Template literal dengan union
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "/users" | "/posts" | "/comments";
type ApiRoute = `${HttpMethod} ${Endpoint}`;

// Hasil: "GET /users" | "GET /posts" | ... | "DELETE /comments"

// Template literal dengan number
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;

const valid1: CSSValue = "100px";
const valid2: CSSValue = "1.5rem";
// const invalid: CSSValue = "abc"; // Error
```

### Template Literal dengan Intrinsic String Manipulation Types

```typescript
// Capitalize<T>
type UppercaseEvent = Capitalize<"click">; // "Click"

// Uncapitalize<T>
type LowercaseProp = Uncapitalize<"UserName">; // "userName"

// Uppercase<T>
type Screaming = Uppercase<"hello">; // "HELLO"

// Lowercase<T>
type Quiet = Lowercase<"HELLO">; // "hello"

// Kombinasi
type GetterName<T extends string> = `get${Capitalize<T>}`;
type SetterName<T extends string> = `set${Capitalize<T>}`;

interface User {
  name: string;
  age: number;
}

type UserGetters = {
  [K in keyof User as GetterName<string & K>]: () => User[K];
};
// { getName: () => string; getAge: () => number }
```

### Advanced Template Literal Patterns

```typescript
// Parse route parameters
type RouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof RouteParams<Rest>]: string }
    : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type UserRoute = RouteParams<"/users/:id/posts/:postId">;
// { id: string; postId: string }

// CSS variable names
type CSSVariable<T extends string> = `--${T}`;
type BrandColor = CSSVariable<"primary" | "secondary" | "accent">;
// "--primary" | "--secondary" | "--accent"

// BEM naming convention
type BEM<
  Block extends string,
  Element extends string | undefined = undefined,
  Modifier extends string | undefined = undefined
> = Element extends string
  ? Modifier extends string
    ? `${Block}__${Element}--${Modifier}`
    : `${Block}__${Element}`
  : Modifier extends string
  ? `${Block}--${Modifier}`
  : Block;

type ButtonClass = BEM<"btn">; // "btn"
type ButtonIconClass = BEM<"btn", "icon">; // "btn__icon"
type ButtonPrimaryClass = BEM<"btn", undefined, "primary">; // "btn--primary"
type ButtonIconPrimaryClass = BEM<"btn", "icon", "primary">; // "btn__icon--primary"
```

## Best Practices

### 1. Komposisi Utility Types

```typescript
// ❌ Utility type yang terlalu spesifik
type UserForUpdate = {
  name?: string;
  email?: string;
  age?: number;
};

// ✅ Komposisi dari utility types yang ada
type UserForUpdate2 = Partial<Omit<User, "id" | "createdAt">>;

// Helper composition
type UpdateDTO<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;
type UserUpdateDTO = UpdateDTO<User>;
type PostUpdateDTO = UpdateDTO<Post>;
```

### 2. Dokumentasikan Complex Types

```typescript
/**
 * Creates a deep immutable version of type T
 * All properties become readonly recursively
 * @template T - The type to make deeply readonly
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

/**
 * Extracts all string literal types from an object type
 * Useful for creating type-safe property accessors
 * @template T - The object type to extract keys from
 * @template Prefix - Optional prefix for the path
 */
type DeepKeys<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T]: K extends string
        ?
            | `${Prefix}${K}`
            | DeepKeys<T[K], `${Prefix}${K}.`>
        : never;
    }[keyof T]
  : never;
```

### 3. Hindari Over-Engineering

```typescript
// ❌ Terlalu kompleks untuk kasus sederhana
type OverEngineered<T, K extends keyof T, U extends T[K]> = T extends {
  [P in K]: U;
}
  ? T
  : never;

// ✅ Sederhana dan readable
type Simple<T extends Record<K, U>, K extends string | number | symbol, U> = T;

// Gunakan type hanya saat memberikan value
function processUser(user: User) {
  // Type inference bekerja di sini
  const name = user.name; // string
  
  // Tidak perlu explicit type
  const upperName: string = name.toUpperCase();
}
```

### 4. Test Your Types

```typescript
// Type-level testing dengan conditional types
type Assert<T, U> = T extends U ? true : false;
type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

// Test cases
type Test1 = AssertEqual<Partial<User>, { name?: string; age?: number }>; // true
type Test2 = Assert<ReturnType<() => string>, string>; // true

// Compile-time assertions
const assert = <T extends true>() => {};
assert<Test1>();
assert<Test2>();
```

### 5. Version Compatibility

```typescript
// Feature detection untuk compatibility
// @ts-ignore
 type MyAwaited<T> = T extends Promise<infer R> ? R : T;

// Atau gunakan conditional untuk feature availability
type TypeScriptVersion = 4.5;

type HasTemplateLiteral = TypeScriptVersion extends 4.1 | 4.2 | 4.3 | 4.4 | 4.5
  ? true
  : false;
```

## Kesimpulan

Utility types dan mapped types adalah fitur fundamental TypeScript yang memungkinkan transformasi tipe yang powerful dan deklaratif. Dengan memahami cara kerja utility types bawaan dan belajar membuat mapped types kustom, Anda dapat meningkatkan produktivitas dan maintainability kode TypeScript Anda secara signifikan.

Kunci penguasaan utility types adalah memahami fondasinya: mapped types, conditional types, dan template literal types. Kombinasi dari ketiga fitur ini memungkinkan Anda membuat abstraksi tipe yang hampir tak terbatas. Namun, penting untuk menggunakan fitur-fitur ini secara bijaksana dan menghindari over-engineering yang dapat membuat kode sulit dipahami.

Praktik terbaik seperti komposisi utility types, dokumentasi yang baik, dan type-level testing akan membantu Anda membangun library types yang robust dan reusable. Ingatlah bahwa tujuan akhirnya adalah membuat kode yang lebih aman dan mudah dipelihara, bukan untuk menunjukkan kecanggihan type system.
