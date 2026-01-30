---
title: "React dengan TypeScript: Advanced Patterns dan Type Safety"
date: 2026-01-30T00:00:00.000Z
description: "Kuasai pattern TypeScript advanced untuk React. Dari generic components, type-safe hooks, discriminated unions, hingga branded types untuk aplikasi yang type-safe dan maintainable."
category: React
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

Setelah mempelajari dasar-dasar React dan Hooks, saatnya kita meningkatkan kemampuan dengan TypeScript. TypeScript bukan hanya tentang menambahkan tipe data, tetapi tentang membuat aplikasi yang lebih aman, maintainable, dan scalable. Dalam artikel ini, kita akan menjelajahi pattern-pattern advanced TypeScript untuk React yang digunakan oleh developer profesional.

## Mengapa TypeScript untuk React?

TypeScript memberikan value yang signifikan untuk aplikasi React:

1. **Type Safety**: Menangkap bug di compile time, bukan runtime
2. **Better IDE Support**: Autocomplete, refactoring, dan navigation yang superior
3. **Self-Documenting Code**: Interface dan tipe menjelaskan kontrak komponen
4. **Easier Maintenance**: Perubahan kode lebih aman dengan type checking
5. **Better Collaboration**: Tipe yang jelas membantu tim bekerja lebih efisien

## Setup Project React dengan TypeScript

### Menggunakan Vite (Recommended)

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

### Menggunakan Next.js

```bash
npx create-next-app@latest my-app --typescript
```

### Konfigurasi TypeScript yang Ketat

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Generic Components

Generic components memungkinkan kita membuat komponen yang bekerja dengan berbagai tipe data sambil tetap type-safe.

### List Component Generic

```tsx
// Definisikan props dengan generic T
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

// Component generic
function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Penggunaan dengan User
interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const users: User[] = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ];

  return (
    <List<User>
      items={users}
      keyExtractor={(user) => user.id}
      renderItem={(user) => (
        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      )}
    />
  );
}

// Penggunaan dengan Product
interface Product {
  sku: string;
  name: string;
  price: number;
}

function ProductList() {
  const products: Product[] = [
    { sku: 'P001', name: 'Laptop', price: 1000 },
    { sku: 'P002', name: 'Mouse', price: 50 }
  ];

  return (
    <List<Product>
      items={products}
      keyExtractor={(product) => product.sku}
      renderItem={(product) => (
        <div>
          <span>{product.name}</span>
          <span>${product.price}</span>
        </div>
      )}
    />
  );
}
```

### Select Component Generic

```tsx
interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  placeholder?: string;
}

function Select<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = 'Select...'
}: SelectProps<T>) {
  return (
    <select
      value={value ? getValue(value) : ''}
      onChange={(e) => {
        const selected = options.find(
          (opt) => getValue(opt) === e.target.value
        );
        if (selected) onChange(selected);
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// Penggunaan
interface Category {
  id: string;
  name: string;
}

function CategorySelector() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const categories: Category[] = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Food' }
  ];

  return (
    <Select<Category>
      options={categories}
      value={selectedCategory}
      onChange={setSelectedCategory}
      getLabel={(cat) => cat.name}
      getValue={(cat) => cat.id}
      placeholder="Choose category"
    />
  );
}
```

## Type-Safe Hooks

### useLocalStorage dengan Generic

```tsx
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Penggunaan
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  const [user, setUser] = useLocalStorage<User>('user', {
    id: 0,
    name: '',
    email: ''
  });

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
    </div>
  );
}
```

### useFetch dengan Generic

```tsx
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

// Penggunaan
interface Post {
  id: number;
  title: string;
  body: string;
}

function PostsList() {
  const { data: posts, loading, error } = useFetch<Post[]>('/api/posts');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!posts) return null;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Discriminated Unions untuk State Management

Discriminated unions adalah pattern TypeScript yang powerful untuk modeling state yang kompleks.

### Async State Pattern

```tsx
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  const execute = async (promise: Promise<T>) => {
    setState({ status: 'loading' });
    try {
      const data = await promise;
      setState({ status: 'success', data });
      return data;
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  };

  return { state, execute };
}

// Penggunaan
function UserProfile({ userId }: { userId: string }) {
  const { state, execute } = useAsync<User>();

  useEffect(() => {
    execute(fetchUser(userId));
  }, [userId]);

  switch (state.status) {
    case 'idle':
      return <div>Ready to load</div>;
    case 'loading':
      return <div>Loading user...</div>;
    case 'error':
      return <div>Error: {state.error.message}</div>;
    case 'success':
      return (
        <div>
          <h1>{state.data.name}</h1>
          <p>{state.data.email}</p>
        </div>
      );
  }
}
```

### Form State Pattern

```tsx
type FormState<T> =
  | { status: 'editing'; values: T; errors: Partial<Record<keyof T, string>> }
  | { status: 'submitting'; values: T }
  | { status: 'success'; values: T }
  | { status: 'error'; values: T; error: string };

interface LoginFormData {
  email: string;
  password: string;
}

function LoginForm() {
  const [formState, setFormState] = useState<FormState<LoginFormData>>({
    status: 'editing',
    values: { email: '', password: '' },
    errors: {}
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formState.status !== 'editing') return;

    // Validate
    const errors: Partial<Record<keyof LoginFormData, string>> = {};
    if (!formState.values.email.includes('@')) {
      errors.email = 'Invalid email';
    }
    if (formState.values.password.length < 8) {
      errors.password = 'Password too short';
    }

    if (Object.keys(errors).length > 0) {
      setFormState({ ...formState, errors });
      return;
    }

    // Submit
    setFormState({ status: 'submitting', values: formState.values });
    
    try {
      await login(formState.values);
      setFormState({ status: 'success', values: formState.values });
    } catch (error) {
      setFormState({
        status: 'error',
        values: formState.values,
        error: 'Login failed'
      });
    }
  };

  if (formState.status === 'success') {
    return <div>Login successful!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formState.values.email}
        onChange={(e) =>
          setFormState({
            ...formState,
            values: { ...formState.values, email: e.target.value }
          })
        }
        disabled={formState.status === 'submitting'}
      />
      {formState.status === 'editing' && formState.errors.email && (
        <span>{formState.errors.email}</span>
      )}
      
      <input
        type="password"
        value={formState.values.password}
        onChange={(e) =>
          setFormState({
            ...formState,
            values: { ...formState.values, password: e.target.value }
          })
        }
        disabled={formState.status === 'submitting'}
      />
      
      <button type="submit" disabled={formState.status === 'submitting'}>
        {formState.status === 'submitting' ? 'Logging in...' : 'Login'}
      </button>
      
      {formState.status === 'error' && <div>{formState.error}</div>}
    </form>
  );
}
```

## Branded Types untuk Type Safety

Branded types mencegah mixing incompatible primitive types.

```tsx
type UserId = string & { readonly __brand: 'UserId' };
type PostId = string & { readonly __brand: 'PostId' };
type Email = string & { readonly __brand: 'Email' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createPostId(id: string): PostId {
  return id as PostId;
}

function createEmail(email: string): Email {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  return email as Email;
}

// Functions dengan branded types
function getUserById(id: UserId): Promise<User> {
  return fetch(`/api/users/${id}`).then((res) => res.json());
}

function getPostById(id: PostId): Promise<Post> {
  return fetch(`/api/posts/${id}`).then((res) => res.json());
}

function sendEmail(to: Email, subject: string, body: string): Promise<void> {
  return fetch('/api/email', {
    method: 'POST',
    body: JSON.stringify({ to, subject, body })
  }).then(() => undefined);
}

// Penggunaan - TypeScript akan mencegah kesalahan
const userId = createUserId('user-123');
const postId = createPostId('post-456');
const email = createEmail('user@example.com');

getUserById(userId); // ✅ OK
getUserById(postId); // ❌ Error: Argument of type 'PostId' is not assignable to parameter of type 'UserId'

getPostById(postId); // ✅ OK
getPostById(userId); // ❌ Error

sendEmail(email, 'Hello', 'Body'); // ✅ OK
sendEmail(userId, 'Hello', 'Body'); // ❌ Error
```

## Utility Types untuk Props

### ComponentProps

```tsx
import { ComponentProps } from 'react';

// Mendapatkan tipe props dari komponen bawaan
type ButtonProps = ComponentProps<'button'>;

// Extend komponen bawaan
interface CustomButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

function CustomButton({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}: CustomButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

### PropsWithChildren

```tsx
import { PropsWithChildren } from 'react';

interface CardProps {
  title: string;
  footer?: React.ReactNode;
}

// PropsWithChildren menambahkan children prop
function Card({ title, footer, children }: PropsWithChildren<CardProps>) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
```

## Advanced Event Types

### Generic Event Handlers

```tsx
function FormComponent() {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle submit
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <textarea name="bio" onChange={handleInputChange} />
    </form>
  );
}
```

## Type Guards dan Narrowing

```tsx
interface AdminUser {
  type: 'admin';
  id: number;
  name: string;
  permissions: string[];
}

interface RegularUser {
  type: 'user';
  id: number;
  name: string;
  subscription: 'free' | 'premium';
}

type User = AdminUser | RegularUser;

// Type guard function
function isAdmin(user: User): user is AdminUser {
  return user.type === 'admin';
}

function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      
      {isAdmin(user) ? (
        <div>
          <h2>Admin Panel</h2>
          <ul>
            {user.permissions.map((perm) => (
              <li key={perm}>{perm}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <p>Subscription: {user.subscription}</p>
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Hindari `any`

```tsx
// ❌ Hindari
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// ✅ Gunakan tipe yang spesifik
function processData<T extends { value: number }>(data: T[]): number[] {
  return data.map((item) => item.value);
}

// ✅ Atau unknown untuk tipe yang belum diketahui
function processUnknownData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return String(data);
}
```

### 2. Gunakan `satisfies` Operator

```tsx
// ✅ TypeScript 4.9+
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
} satisfies Config;

// config.apiUrl tetap literal type "https://api.example.com"
```

### 3. Proper Error Handling

```tsx
interface Result<T, E = Error> {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
}

async function fetchData(): Promise<Result<User>> {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) {
      return {
        success: false,
        error: new Error(`HTTP ${response.status}`)
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown')
    };
  }
}
```

## Kesimpulan

TypeScript dengan React memberikan fondasi yang kuat untuk aplikasi yang scalable dan maintainable. Dengan menguasai pattern-pattern advanced seperti generic components, discriminated unions, dan branded types, kamu dapat membangun aplikasi yang type-safe dan mudah di-refactor.

**Key Takeaways:**
1. Gunakan generic components untuk reusability
2. Manfaatkan discriminated unions untuk state management
3. Gunakan branded types untuk mencegah bugs
4. Hindari `any` - gunakan `unknown` atau tipe spesifik
5. Manfaatkan utility types bawaan TypeScript

Selamat coding dengan TypeScript! 🚀
