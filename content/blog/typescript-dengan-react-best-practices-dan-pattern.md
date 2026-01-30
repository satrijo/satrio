---
title: "TypeScript dengan React: Best Practices dan Pattern"
date: 2026-02-10T00:00:00.000Z
description: "Panduan lengkap menggunakan TypeScript dengan React. Dari functional components, hooks, hingga state management dengan type safety."
category: TypeScript
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

React dan TypeScript adalah kombinasi yang sangat powerful untuk membangun aplikasi web modern. TypeScript memberikan type safety yang membantu menangkap bug lebih awal, sementara React menyediakan cara yang efisien untuk membangun user interface. Dalam artikel ini, kita akan membahas best practices menggunakan TypeScript dengan React.

## Kenapa TypeScript dengan React?

TypeScript memberikan banyak keuntungan ketika digunakan dengan React:

1. **Type Safety**: Menangkap bug di compile time, bukan runtime
2. **Better IDE Support**: Autocomplete, refactoring, dan navigasi yang lebih baik
3. **Self-Documenting Code**: Props dan state terdokumentasi dengan jelas
4. **Easier Maintenance**: Perubahan kode lebih aman dengan type checking
5. **Better Collaboration**: Interface yang jelas membantu tim bekerja sama

## Setup Project React dengan TypeScript

### Menggunakan Create React App

```bash
npx create-react-app my-app --template typescript
```

### Menggunakan Vite (Recommended)

```bash
npm create vite@latest my-app -- --template react-ts
```

### Struktur Folder

```
src/
├── components/       # Reusable components
├── hooks/           # Custom hooks
├── types/           # Type definitions
├── utils/           # Utility functions
├── App.tsx
└── main.tsx
```

## Functional Components dengan TypeScript

### Basic Component Props

```typescript
// Definisikan props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

// Component dengan props
const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// Penggunaan
<Button 
  label="Click Me"
  onClick={() => console.log('clicked')}
  variant="primary"
/>
```

### Children Props

```typescript
interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, footer }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

// Penggunaan
<Card title="User Profile" footer={<button>Save</button>}>
  <p>Content goes here</p>
  <UserForm />
</Card>
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
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

<List<User>
  items={users}
  keyExtractor={user => user.id}
  renderItem={user => (
    <div>
      <strong>{user.name}</strong>
      <span>{user.email}</span>
    </div>
  )}
/>

// Penggunaan dengan Product
interface Product {
  sku: string;
  name: string;
  price: number;
}

<List<Product>
  items={products}
  keyExtractor={product => product.sku}
  renderItem={product => (
    <div>
      <span>{product.name}</span>
      <span>${product.price}</span>
    </div>
  )}
/>
```

## Hooks dengan TypeScript

### useState

```typescript
import { useState } from 'react';

// State dengan tipe dasar
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>('');
const [isActive, setIsActive] = useState<boolean>(false);

// State dengan objek
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);

// Update state
setUser({
  id: 1,
  name: 'John',
  email: 'john@example.com'
});

// State dengan array
const [todos, setTodos] = useState<Todo[]>([]);

// Type inference (TypeScript akan menginfer tipe dari initial value)
const [value, setValue] = useState(''); // Tipe: string
const [items, setItems] = useState([]); // Tipe: never[] - HATI-HATI!
const [items2, setItems2] = useState<string[]>([]); // ✅ Explicit type
```

### useEffect

```typescript
import { useEffect } from 'react';

// Effect tanpa dependencies (run once)
useEffect(() => {
  console.log('Component mounted');
  
  return () => {
    console.log('Component will unmount');
  };
}, []);

// Effect dengan dependencies
useEffect(() => {
  console.log(`Count changed: ${count}`);
}, [count]);

// Async effect
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data: ApiResponse = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchData();
}, []);

// Cleanup effect
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => {
    clearInterval(timer);
  };
}, []);
```

### useRef

```typescript
import { useRef } from 'react';

// Ref untuk DOM element
const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};

// Ref untuk nilai yang persist
const renderCount = useRef<number>(0);

useEffect(() => {
  renderCount.current += 1;
});

// Ref dengan initial value
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const startTimer = () => {
  timeoutRef.current = setTimeout(() => {
    console.log('Timer done');
  }, 1000);
};

const stopTimer = () => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
};
```

### useContext

```typescript
import { createContext, useContext } from 'react';

// Definisikan tipe
interface Theme {
  primary: string;
  secondary: string;
  background: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create context dengan default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook untuk menggunakan context
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  
  const toggleTheme = () => {
    setTheme(prev => prev === lightTheme ? darkTheme : lightTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Penggunaan
const ThemedButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      style={{ background: theme.primary }}
      onClick={toggleTheme}
    >
      Toggle Theme
    </button>
  );
};
```

### Custom Hooks

```typescript
// useLocalStorage hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
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
const [name, setName] = useLocalStorage<string>('name', '');
const [user, setUser] = useLocalStorage<User>('user', { id: 0, name: '', email: '' });

// useFetch hook
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
const { data: users, loading, error, refetch } = useFetch<User[]>('/api/users');
```

## Event Handling

```typescript
// Mouse events
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Button clicked:', event.currentTarget);
};

// Form events
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  console.log('Form submitted');
};

// Input events
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

// Select events
const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedValue(event.target.value);
};

// Keyboard events
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    console.log('Enter pressed');
  }
};

// Generic event handler
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = event.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

## Form Handling dengan TypeScript

```typescript
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email tidak valid';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form valid:', formData);
      // Submit data
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      
      <div>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>
      
      <button type="submit">Register</button>
    </form>
  );
};
```

## Best Practices

### 1. Hindari `any`
```typescript
// ❌ Hindari
const handleData = (data: any) => { ... };

// ✅ Gunakan tipe yang spesifik
const handleData = (data: UserData) => { ... };
```

### 2. Gunakan Type Inference dengan Bijak
```typescript
// ✅ TypeScript bisa menginfer
const [count, setCount] = useState(0); // number

// ✅ Tapi explicit lebih baik untuk kompleks
const [user, setUser] = useState<User | null>(null);
```

### 3. Props Interface selalu di-export
```typescript
// Button.tsx
export interface ButtonProps {
  label: string;
  onClick: () => void;
}

// Other file bisa import
import { ButtonProps } from './Button';
```

### 4. Gunakan Discriminated Unions untuk State
```typescript
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

### 5. Props dengan Default Values
```typescript
interface Props {
  title: string;
  showTitle?: boolean;
}

const Component: React.FC<Props> = ({ title, showTitle = true }) => {
  // showTitle default ke true
};
```

## Kesimpulan

Menggunakan TypeScript dengan React memberikan banyak keuntungan:
- Kode lebih aman dengan type checking
- IDE support yang lebih baik
- Dokumentasi yang jelas melalui types
- Refactoring yang lebih mudah

Mulailah dengan mendefinisikan interface untuk props, gunakan type inference dengan bijak, dan manfaatkan generic untuk komponen yang reusable. Dengan praktik yang konsisten, TypeScript akan membantumu menulis kode React yang lebih berkualitas.

Selamat mencoba! 🚀
