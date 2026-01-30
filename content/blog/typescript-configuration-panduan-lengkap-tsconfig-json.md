---
title: "TypeScript Configuration: Panduan Lengkap tsconfig.json"
date: 2026-02-12T00:00:00.000Z
description: "Pelajari segala sesuatu tentang konfigurasi TypeScript. Dari compiler options, project references, hingga setup untuk berbagai environment."
category: TypeScript
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

File `tsconfig.json` adalah jantung dari setiap project TypeScript. File ini mengontrol bagaimana TypeScript compiler (tsc) mengcompile kode, melakukan type checking, dan mengatur berbagai aspek project. Dalam artikel ini, kita akan membahas semua aspek konfigurasi TypeScript secara mendalam.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami dasar-dasar TypeScript. Jika Anda baru memulai dengan TypeScript, silakan baca [TypeScript Dasar: Dari JavaScript ke TypeScript](/blog/typescript-dasar-dari-javascript-ke-typescript) terlebih dahulu.

## Apa itu tsconfig.json?

`tsconfig.json` adalah file konfigurasi JSON yang menentukan root directory dari project TypeScript dan mengatur compiler options. Keberadaan file ini di directory menandakan bahwa directory tersebut adalah root dari project TypeScript.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true
  }
}
```

## Membuat tsconfig.json

```bash
# Generate tsconfig.json dengan default
npx tsc --init

# Generate dengan komentar penjelasan
npx tsc --init --showConfig
```

## Struktur Dasar

```json
{
  "compilerOptions": {
    // Compiler settings
  },
  "include": [
    // File yang di-include
  ],
  "exclude": [
    // File yang di-exclude
  ],
  "extends": "./base.json",
  "files": [
    // File spesifik
  ],
  "references": [
    // Project references
  ]
}
```

## Compiler Options Penting

### Target dan Module

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

**Target Options:**
- `"ES3"` - Kompatible dengan browser lama
- `"ES5"` - Standar lama, masih banyak digunakan
- `"ES2015"` - ES6 features
- `"ES2020"` - BigInt, optional chaining, nullish coalescing
- `"ESNext"` - Fitur terbaru JavaScript

**Module Options:**
- `"commonjs"` - Node.js default
- `"ESNext"` - ES modules
- `"AMD"` - Asynchronous Module Definition
- `"UMD"` - Universal Module Definition
- `"System"` - SystemJS modules

### Strict Type Checking

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

**Penjelasan:**
- `"strict": true` - Mengaktifkan semua strict type checking options
- `"noImplicitAny"` - Error saat TypeScript infer tipe `any`
- `"strictNullChecks"` - `null` dan `undefined` harus ditangani secara eksplisit
- `"strictFunctionTypes"` - Parameter function harus compatible
- `"strictPropertyInitialization"` - Property class harus diinisialisasi

### Output Configuration

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationDir": "./dist/types",
    "sourceMap": true,
    "inlineSourceMap": false,
    "inlineSources": false,
    "removeComments": true,
    "noEmit": false,
    "noEmitOnError": true
  }
}
```

**Penjelasan:**
- `"outDir"` - Directory output untuk file JavaScript
- `"rootDir"` - Root directory source files
- `"declaration"` - Generate `.d.ts` files
- `"sourceMap"` - Generate source maps untuk debugging
- `"noEmit"` - Type check saja, tidak generate output

### Path Mapping

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

**Penggunaan:**
```typescript
// Tanpa path mapping
import { Button } from '../../../components/Button';

// Dengan path mapping
import { Button } from '@components/Button';
import { User } from '@types/User';
```

### Decorators dan Experimental Features

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react"
  }
}
```

**JSX Options:**
- `"preserve"` - Keep JSX syntax
- `"react"` - Transform ke React.createElement
- `"react-jsx"` - Transform ke jsx runtime (React 17+)
- `"react-native"` - Preserve untuk React Native

### Advanced Options

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "importHelpers": true,
    "downlevelIteration": true
  }
}
```

**Penjelasan:**
- `"esModuleInterop"` - Better interoperability dengan CommonJS modules
- `"skipLibCheck"` - Skip type checking declaration files (faster compile)
- `"resolveJsonModule"` - Allow import JSON files
- `"isolatedModules"` - Ensure file bisa ditranspile secara terpisah

## Konfigurasi untuk Berbagai Environment

### Node.js Project

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### React Project

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

### Library Project

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./lib",
    "rootDir": "./src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src"],
  "exclude": ["node_modules", "lib", "**/*.test.ts"]
}
```

### Monorepo dengan Project References

**tsconfig.json (root):**
```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/ui" }
  ]
}
```

**packages/core/tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../utils" }
  ]
}
```

**tsconfig.base.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Include dan Exclude

```json
{
  "include": [
    "src/**/*",
    "types/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/__tests__/**"
  ],
  "files": [
    "src/main.ts",
    "src/types.d.ts"
  ]
}
```

**Perbedaan:**
- `"include"` - Pattern file yang di-include
- `"exclude"` - Pattern file yang di-exclude (override include)
- `"files"` - File spesifik (tidak support pattern)

## Extends dan Inheritance

```json
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Preset yang tersedia:**
- `@tsconfig/recommended` - Recommended defaults
- `@tsconfig/node18` - Untuk Node.js 18
- `@tsconfig/node20` - Untuk Node.js 20
- `@tsconfig/strictest` - Strictest possible configuration

## Watch Mode dan Incremental Compilation

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

**Penggunaan:**
```bash
# Watch mode
npx tsc --watch

# Incremental build
npx tsc --incremental

# Build info
npx tsc --build --force
```

## Type Checking Only

```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

**Use case:**
- CI/CD pipeline untuk type checking
- Pre-commit hooks
- IDE type checking

## Common Issues dan Solusi

### 1. Cannot find module

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### 2. Path alias tidak berfungsi

Pastikan bundler (webpack, vite, etc.) juga dikonfigurasi:

**vite.config.ts:**
```typescript
export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}
```

### 3. Decorators tidak berfungsi

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 4. JSX errors

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

## Best Practices

### 1. Selalu Gunakan Strict Mode
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 2. Enable Source Maps untuk Development
```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

### 3. Exclude Test Files dari Build
```json
{
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### 4. Gunakan Project References untuk Monorepo
```json
{
  "references": [
    { "path": "./packages/shared" }
  ]
}
```

### 5. Separate Config untuk Dev dan Prod

**tsconfig.json:**
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "sourceMap": true
  }
}
```

**tsconfig.prod.json:**
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true
  }
}
```

## Kesimpulan

Konfigurasi TypeScript yang baik adalah fondasi untuk project yang maintainable. Beberapa poin penting:

1. **Selalu aktifkan `strict`** untuk type safety maksimal
2. **Gunakan path mapping** untuk import yang lebih bersih
3. **Enable source maps** untuk debugging yang lebih baik
4. **Gunakan project references** untuk monorepo
5. **Pilih target dan module** yang sesuai dengan environment

**Checklist Konfigurasi:**
- [ ] `strict: true`
- [ ] `esModuleInterop: true`
- [ ] `skipLibCheck: true`
- [ ] `resolveJsonModule: true`
- [ ] Source maps untuk development
- [ ] Path aliases dikonfigurasi
- [ ] Include/exclude patterns benar

## Artikel Selanjutnya

Setelah menguasai konfigurasi TypeScript, lanjutkan pembelajaran Anda dengan membaca [TypeScript dengan React: Best Practices dan Pattern](/blog/typescript-dengan-react-best-practices-dan-pattern).

Selamat mengkonfigurasi! 🚀
