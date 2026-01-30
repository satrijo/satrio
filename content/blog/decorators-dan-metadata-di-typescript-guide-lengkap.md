---
title: "Decorators dan Metadata di TypeScript: Guide Lengkap"
date: 2026-02-11T00:00:00.000Z
description: "Pelajari decorators dan metadata reflection di TypeScript. Fitur experimental yang powerful untuk metaprogramming dan framework development."
category: TypeScript
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

Decorators adalah fitur experimental di TypeScript yang memungkinkan kita menambahkan metadata dan perilaku tambahan ke class, method, property, dan parameter. Fitur ini banyak digunakan oleh framework modern seperti Angular, NestJS, dan TypeORM. Dalam artikel ini, kita akan membahas decorators secara mendalam.

## Apa itu Decorators?

Decorators adalah special kind of declaration yang bisa diattach ke class declarations, methods, accessors, properties, atau parameters. Decorators menggunakan sintaks `@expression`, di mana `expression` harus mengevaluasi ke function yang akan dipanggil saat runtime dengan informasi tentang decorated declaration.

```typescript
// Decorator sederhana
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log(`Method ${key} decorated`);
}

class Example {
  @log
  greet() {
    console.log('Hello!');
  }
}
```

## Mengaktifkan Decorators

Decorators adalah fitur experimental, jadi perlu diaktifkan di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Jenis-Jenis Decorators

### 1. Class Decorators

Class decorators dideklarasikan sebelum class declaration. Class decorator diterapkan ke constructor class dan bisa digunakan untuk mengamati, memodifikasi, atau mengganti class definition.

```typescript
// Decorator sederhana
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

@Logger
class Person {
  name = 'Max';
  
  constructor() {
    console.log('Creating person object...');
  }
}

const person = new Person();
// Output:
// Logging...
// [Function: Person]
// Creating person object...
```

### Decorator Factory

Decorator factory adalah function yang mengembalikan decorator function. Ini memungkinkan kita mengkonfigurasi decorator dengan parameter.

```typescript
function Logger(logString: string) {
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

@Logger('LOGGING - PERSON')
class Person {
  name = 'Max';
  
  constructor() {
    console.log('Creating person object...');
  }
}
```

### Decorator yang Mengembalikan Class Baru

```typescript
function WithTemplate(template: string, hookId: string) {
  return function(constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}

@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Max';
  
  constructor() {
    console.log('Creating person object...');
  }
}
```

### 2. Property Decorators

Property decorators dideklarasikan sebelum property declaration.

```typescript
function LogProperty(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

class Product {
  @LogProperty
  title: string;
  private _price: number;
  
  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  
  @LogProperty
  get price() {
    return this._price;
  }
}
```

### 3. Method Decorators

Method decorators dideklarasikan sebelum method declaration.

```typescript
function LogMethod(
  target: any,
  propertyName: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log('Method decorator!');
  console.log(target);
  console.log(propertyName);
  console.log(descriptor);
}

class Product {
  title: string;
  private _price: number;
  
  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  
  @LogMethod
  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

### Autobind Decorator

```typescript
function Autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

class Printer {
  message = 'This works!';
  
  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage); // This akan tetap mengacu ke Printer
```

### 4. Parameter Decorators

Parameter decorators dideklarasikan sebelum parameter declaration.

```typescript
function LogParameter(
  target: any,
  methodName: string | Symbol,
  parameterIndex: number
) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(methodName);
  console.log(parameterIndex);
}

class Product {
  getPriceWithTax(@LogParameter tax: number) {
    return this._price * (1 + tax);
  }
}
```

## Decorator Composition

Multiple decorators bisa diterapkan ke declaration yang sama:

```typescript
@Logger('LOGGING')
@WithTemplate('<h1>My Person</h1>', 'app')
class Person {
  // ...
}
```

**Execution Order:**
1. Decorator factories dieksekusi dari atas ke bawah
2. Decorator dieksekusi dari bawah ke atas (LogMethod2 dulu, baru LogMethod1)

## Validation dengan Decorators

```typescript
interface ValidatorConfig {
  [property: string]: string[];
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['required']
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['positive']
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }
  
  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  
  @PositiveNumber
  price: number;
  
  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;
  
  const title = titleEl.value;
  const price = +priceEl.value;
  
  const createdCourse = new Course(title, price);
  
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  
  console.log(createdCourse);
});
```

## Metadata Reflection

Metadata reflection memungkinkan kita menyimpan dan mengambil metadata pada runtime.

```typescript
import 'reflect-metadata';

const metadataKey = Symbol('design:paramtypes');

// Menyimpan metadata
Reflect.defineMetadata(metadataKey, ['String', 'Number'], MyClass);

// Mengambil metadata
const types = Reflect.getMetadata(metadataKey, MyClass);
console.log(types); // ['String', 'Number']
```

### Dependency Injection dengan Decorators

```typescript
import 'reflect-metadata';

const Injectable = (): ClassDecorator => {
  return target => {
    // Register class ke container
  };
};

const Inject = (token: any): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    const existingParams = Reflect.getMetadata('design:paramtypes', target) || [];
    existingParams[parameterIndex] = token;
    Reflect.defineMetadata('design:paramtypes', existingParams, target);
  };
};

@Injectable()
class DatabaseService {
  connect() {
    console.log('Connected to database');
  }
}

@Injectable()
class UserService {
  constructor(@Inject(DatabaseService) private db: DatabaseService) {}
  
  getUsers() {
    this.db.connect();
    return ['User1', 'User2'];
  }
}
```

## Real-World Example: Routing Decorator

```typescript
// Decorator untuk routing
const routes: { [key: string]: Function } = {};

function Route(path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    routes[path] = descriptor.value;
  };
}

class UserController {
  @Route('/users')
  getUsers() {
    return ['User1', 'User2'];
  }
  
  @Route('/users/:id')
  getUser(id: string) {
    return { id, name: 'John' };
  }
}

// Router sederhana
function handleRequest(path: string) {
  const handler = routes[path];
  if (handler) {
    return handler();
  }
  return '404 Not Found';
}

console.log(handleRequest('/users')); // ['User1', 'User2']
```

## Logging Decorator

```typescript
function LogExecutionTime(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyName} executed in ${end - start} milliseconds`);
    return result;
  };
  
  return descriptor;
}

class DataProcessor {
  @LogExecutionTime
  processLargeData(data: number[]) {
    return data.map(x => x * 2).filter(x => x > 10);
  }
}

const processor = new DataProcessor();
processor.processLargeData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// Output: processLargeData executed in 0.123 milliseconds
```

## Memoization Decorator

```typescript
function Memoize(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Returning cached result');
      return cache.get(key);
    }
    
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const calc = new Calculator();
console.log(calc.fibonacci(40)); // Lambat pertama kali
console.log(calc.fibonacci(40)); // Instan (dari cache)
```

## Best Practices

### 1. Gunakan Decorator Factory untuk Konfigurasi
```typescript
// ✅ Gunakan factory jika butuh parameter
@Log('Creating user')
class User {}

// ❌ Hindari hardcode
@Log
class User {}
```

### 2. Document Decorator Behavior
```typescript
/**
 * Autobind decorator ensures 'this' context is preserved
 * when method is passed as callback
 */
function Autobind(...)
```

### 3. Jangan Overuse Decorators
```typescript
// ❌ Terlalu banyak decorators
@Singleton
@Injectable
@Controller('/api')
@Middleware(auth)
@Validate
class UserController {}

// ✅ Gunakan secukupnya
@Controller('/api/users')
class UserController {}
```

### 4. Type Safety
```typescript
// ✅ Gunakan tipe yang spesifik
function LogMethod(
  target: any,
  propertyName: string | Symbol,
  descriptor: PropertyDescriptor
) { }
```

## Kesimpulan

Decorators adalah fitur powerful di TypeScript yang memungkinkan metaprogramming dan membuat kode lebih declarative. Beberapa use case umum:

1. **Dependency Injection** - NestJS, Angular
2. **ORM** - TypeORM, Sequelize
3. **Validation** - class-validator
4. **Logging** - Aspect-oriented programming
5. **Routing** - Express decorators
6. **Caching** - Memoization

Meskipun masih experimental, decorators sudah banyak digunakan di production dan akan menjadi standar JavaScript di masa depan.

**Catatan Penting:**
- Selalu aktifkan `experimentalDecorators` dan `emitDecoratorMetadata`
- Install `reflect-metadata` jika menggunakan metadata reflection
- Decorators dieksekusi saat class didefinisikan, bukan saat instance dibuat
- Urutan eksekusi: Factory (top-down), Decorator (bottom-up)

Selamat mencoba! 🚀
