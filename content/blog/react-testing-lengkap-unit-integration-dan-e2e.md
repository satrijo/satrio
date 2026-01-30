---
title: "React Testing Lengkap: Unit, Integration, dan E2E Testing"
date: 2026-01-30T00:00:00.000Z
description: "Kuasai testing di React dengan Jest, React Testing Library, Vitest, dan Playwright. Pelajari pattern testing modern untuk aplikasi React yang robust dan maintainable."
category: React
article_language: indonesian
ai_generated: ai
programming_language: typescript
---

# React Testing Lengkap: Unit, Integration, dan E2E Testing

Testing adalah aspek fundamental dalam pengembangan perangkat lunak modern, dan di ekosistem React, kita memiliki ekosistem testing yang sangat kuat dan matang. Artikel ini akan membahas secara mendalam tentang testing di React, mulai dari unit testing dengan Jest dan React Testing Library, hingga end-to-end testing dengan Playwright.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami React Hooks dan Performance Optimization. Jika Anda belum familiar dengan Hooks, silakan baca [React Hooks Lengkap: useState, useEffect, dan Custom Hooks](/blog/react-hooks-lengkap-usestate-useeffect-dan-custom-hooks) dan [React Performance Optimization: Teknik dan Best Practices](/blog/react-performance-optimization-teknik-dan-best-practices) terlebih dahulu.

## Mengapa Testing Penting?

Sebelum masuk ke implementasi, mari kita pahami mengapa testing sangat penting dalam pengembangan aplikasi React:

### 1. Confidence dalam Refactoring

Dengan test suite yang baik, Anda bisa melakukan refactoring besar-besaran tanpa takut merusak fitur yang sudah ada. Test akan menangkap regression sebelum masuk ke production.

### 2. Dokumentasi Hidup

Test yang baik berfungsi sebagai dokumentasi yang menunjukkan bagaimana komponen seharusnya digunakan dan berperilaku dalam berbagai skenario.

### 3. Faster Development Cycle

Meskipun menulis test membutuhkan waktu di awal, secara keseluruhan development menjadi lebih cepat karena:
- Tidak perlu manual testing berulang kali
- Bug ditemukan lebih awal (lebih murah untuk diperbaiki)
- Parallel development menjadi lebih mudah

### 4. Design yang Lebih Baik

Kode yang mudah di-test biasanya memiliki design yang lebih baik: modular, loosely coupled, dan memiliki single responsibility.

## Ekosistem Testing React 2026

### Tooling Modern

Berikut adalah stack testing yang direkomendasikan untuk React di tahun 2026:

| Kategori | Tool | Kegunaan |
|----------|------|----------|
| Test Runner | **Vitest** | Unit dan integration testing (pengganti Jest) |
| Test Runner | **Jest** | Unit dan integration testing (masih populer) |
| Testing Library | **React Testing Library** | Testing komponen React |
| E2E Testing | **Playwright** | End-to-end testing |
| E2E Testing | **Cypress** | Alternative E2E (lebih lambat) |
| Mocking | **MSW (Mock Service Worker)** | Mock API calls |
| Visual Testing | **Storybook** + **Chromatic** | Visual regression testing |

### Perbandingan: Jest vs Vitest

Vitest menjadi pilihan utama di 2026 karena:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

**Keunggulan Vitest:**
- Native TypeScript support (tanpa config tambahan)
- Hot Module Replacement (HMR) di mode watch
- Compatible dengan Jest API
- Lebih cepat (native ESM)
- Built-in coverage (v8)

## Unit Testing Fundamentals

### Setup Testing Environment

```bash
# Install dependencies
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# TypeScript types
npm install -D @types/testing-library__jest-dom
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### Testing Komponen Dasar

```tsx
// src/components/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      data-testid="button"
    >
      {children}
    </button>
  );
}

// src/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant class', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
    
    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  it('has correct type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
```

### Testing Komponen dengan State

```tsx
// src/components/Counter.tsx
import { useState } from 'react';

export function Counter({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount);
  
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
      <button onClick={() => setCount(initialCount)}>Reset</button>
    </div>
  );
}

// src/components/Counter.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders with initial count', () => {
    render(<Counter initialCount={10} />);
    
    expect(screen.getByTestId('count')).toHaveTextContent('10');
  });

  it('increments count when increment button clicked', async () => {
    render(<Counter initialCount={0} />);
    
    await userEvent.click(screen.getByText('Increment'));
    
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('decrements count when decrement button clicked', async () => {
    render(<Counter initialCount={5} />);
    
    await userEvent.click(screen.getByText('Decrement'));
    
    expect(screen.getByTestId('count')).toHaveTextContent('4');
  });

  it('resets count to initial value', async () => {
    render(<Counter initialCount={5} />);
    
    await userEvent.click(screen.getByText('Increment'));
    await userEvent.click(screen.getByText('Increment'));
    await userEvent.click(screen.getByText('Reset'));
    
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });
});
```

## Testing dengan Hooks

### Testing Custom Hooks

```tsx
// src/hooks/useCounter.ts
import { useState, useCallback } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}

export function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset, setCount };
}

// src/hooks/useCounter.test.tsx
import { describe, it, expect, act } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  it('initializes with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });
});
```

### Testing Hooks dengan Context

```tsx
// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

// src/hooks/useAuth.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthProvider';
import { useAuth } from './useAuth';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('returns auth context when inside provider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
```

## Integration Testing

### Testing Form Kompleks

```tsx
// src/components/LoginForm.tsx
import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div role="alert">{error}</div>}
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// src/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with email and password', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message on failed login', async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Login failed'));
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Login failed');
    });
  });

  it('disables submit button while loading', async () => {
    const handleSubmit = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Logging in...');
  });

  it('validates required fields', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
```

### Testing dengan Context Provider

```tsx
// src/components/UserProfile.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import { AuthProvider } from '@/contexts/AuthProvider';

const renderWithAuth = (ui: React.ReactNode, { user = null } = {}) => {
  return render(
    <AuthProvider initialUser={user}>{ui}</AuthProvider>
  );
};

describe('UserProfile', () => {
  it('displays user information when authenticated', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };
    
    renderWithAuth(<UserProfile />, { user: mockUser });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays login prompt when not authenticated', () => {
    renderWithAuth(<UserProfile />);
    
    expect(screen.getByText('Please log in')).toBeInTheDocument();
  });
});
```

## Mocking dan Stubbing

### Mocking API Calls dengan MSW

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }),
  
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: 'John Doe',
      email: 'john@example.com',
    });
  }),
  
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: '3', ...body },
      { status: 201 }
    );
  }),
];

// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/test/setup.ts
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '@/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
```

### Testing Data Fetching

```tsx
// src/components/UserList.tsx
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}

// src/components/UserList.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { UserList } from './UserList';

describe('UserList', () => {
  it('displays loading state initially', () => {
    render(<UserList />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays users after loading', async () => {
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe - john@example.com')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Jane Smith - jane@example.com')).toBeInTheDocument();
  });

  it('displays error on fetch failure', async () => {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.error();
      })
    );
    
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to load users');
    });
  });
});
```

### Mocking Modules

```tsx
// src/components/ImageUploader.tsx
import { uploadImage } from '@/lib/upload';

export function ImageUploader() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };
  
  return <input type="file" onChange={handleFileChange} accept="image/*" />;
}

// src/components/ImageUploader.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploader } from './ImageUploader';

// Mock the upload module
vi.mock('@/lib/upload', () => ({
  uploadImage: vi.fn().mockResolvedValue({ url: 'https://example.com/image.jpg' }),
}));

describe('ImageUploader', () => {
  it('uploads image when file is selected', async () => {
    const { uploadImage } = await import('@/lib/upload');
    
    render(<ImageUploader />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i);
    
    await userEvent.upload(input, file);
    
    expect(uploadImage).toHaveBeenCalledWith(file);
  });
});
```

## End-to-End Testing dengan Playwright

### Setup Playwright

```bash
npm init playwright@latest
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Menulis E2E Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can login', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('user sees error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL('/login?redirect=/dashboard');
  });
});

// e2e/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebelum setiap test
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('user can view product list', async ({ page }) => {
    await page.goto('/products');
    
    await expect(page.locator('h1')).toContainText('Products');
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount.greaterThan(0);
  });

  test('user can add product to cart', async ({ page }) => {
    await page.goto('/products');
    
    await page.click('[data-testid="add-to-cart"]:first-child');
    
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
  });

  test('user can search products', async ({ page }) => {
    await page.goto('/products');
    
    await page.fill('[placeholder="Search products..."]', 'laptop');
    await page.waitForTimeout(500); // Wait for debounce
    
    const products = await page.locator('[data-testid="product-card"]').all();
    for (const product of products) {
      await expect(product).toContainText(/laptop/i);
    }
  });
});
```

### Visual Regression Testing

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    });
  });

  test('product page matches snapshot', async ({ page }) => {
    await page.goto('/products/1');
    await page.waitForSelector('[data-testid="product-detail"]');
    
    await expect(page).toHaveScreenshot('product-detail.png');
  });

  test('mobile view matches snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });
});
```

## Testing Pattern dan Best Practices

### Arrange-Act-Assert Pattern

```tsx
// Pattern yang konsisten untuk semua test
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange: Setup initial state dan mocks
    const mockData = { id: '1', name: 'Test' };
    const handleClick = vi.fn();
    
    // Act: Render dan interaksi
    render(<Component data={mockData} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    
    // Assert: Verifikasi hasil
    expect(handleClick).toHaveBeenCalledWith(mockData.id);
  });
});
```

### Testing Accessibility

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

### Test Coverage Goals

```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mocks/**',
      ],
    },
  },
});
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Kesimpulan

Testing adalah investasi jangka panjang yang membayar dividen dalam bentuk:

1. **Confidence**: Berani melakukan perubahan besar tanpa takut merusak fitur
2. **Documentation**: Test menjelaskan bagaimana komponen seharusnya digunakan
3. **Refactoring**: Kode yang ter-test dengan baik lebih mudah di-refactor
4. **Debugging**: Bug ditemukan lebih awal dalam development cycle

Stack testing modern untuk React 2026:
- **Vitest**: Test runner yang cepat dengan native TypeScript support
- **React Testing Library**: Testing komponen dengan fokus pada user behavior
- **MSW**: Mocking API calls dengan baik
- **Playwright**: E2E testing yang reliable dan cepat

Ingatlah prinsip-prinsip penting:
- Test behavior, bukan implementation
- Gunakan user-centric queries (`getByRole`, `getByLabelText`)
- Mock external dependencies
- Maintain test coverage di atas 80%
- Integrasikan testing dalam CI/CD pipeline

Dengan menguasai testing, Anda tidak hanya menjadi developer React yang lebih baik, tetapi juga memastikan aplikasi yang Anda bangun robust, maintainable, dan siap untuk scale.

## Artikel Selanjutnya

Setelah memahami Testing di React, lanjutkan pembelajaran Anda dengan membaca [React dengan TypeScript: Advanced Patterns dan Type Safety](/blog/react-dengan-typescript-advanced-patterns-dan-type-safety).
