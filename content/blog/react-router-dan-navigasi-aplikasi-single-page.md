---
title: "React Router dan Navigasi Aplikasi Single Page"
date: 2026-01-30T00:00:00.000Z
description: "Kuasai React Router v6 untuk membangun navigasi aplikasi single page yang mulus. Pelajari routing, nested routes, protected routes, dan pattern navigasi modern."
category: React
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# React Router dan Navigasi Aplikasi Single Page

React Router adalah library de facto untuk menangani routing di aplikasi React. Dengan React Router, Anda dapat membuat aplikasi single-page (SPA) dengan navigasi yang mulus tanpa reload halaman. Artikel ini akan membahas React Router v6 secara komprehensif, mulai dari konsep dasar hingga pattern routing yang advanced.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami React Hooks dan Context API. Jika Anda belum familiar dengan Hooks, silakan baca [React Hooks Lengkap: useState, useEffect, dan Custom Hooks](/blog/react-hooks-lengkap-usestate-useeffect-dan-custom-hooks) terlebih dahulu.

## Apa itu React Router?

React Router adalah library routing yang memungkinkan kita membuat navigasi di aplikasi React. Ia menyinkronkan UI dengan URL, memungkinkan user untuk menggunakan tombol back/forward browser, bookmark halaman, dan berbagi link.

### Instalasi

```bash
npm install react-router-dom
```

### Konsep Dasar

React Router v6 memperkenalkan beberapa perubahan signifikan dari versi sebelumnya:

1. **`<Routes>`** menggantikan `<Switch>`
2. **`<Route>`** menggunakan `element` prop alih-alih `component` atau `render`
3. **Relative links** - link sekarang relative secara default
4. **Nested routes** dengan outlet
5. **useNavigate** menggantikan useHistory

## Setup Dasar Router

### BrowserRouter

```jsx
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

### Struktur Routing Dasar

```jsx
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
```

## Navigasi dengan Link dan NavLink

### Link Component

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Beranda</Link>
      <Link to="/products">Produk</Link>
      <Link to="/cart">Keranjang</Link>
    </nav>
  );
}
```

### NavLink dengan Active Styling

```jsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Beranda
      </NavLink>
      <NavLink 
        to="/products"
        style={({ isActive }) => ({
          color: isActive ? 'red' : 'black'
        })}
      >
        Produk
      </NavLink>
    </nav>
  );
}
```

### Programmatic Navigation dengan useNavigate

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await loginUser(credentials);
      navigate('/dashboard'); // Redirect setelah login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  const handleCancel = () => {
    navigate(-1); // Go back
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Login</button>
      <button type="button" onClick={handleCancel}>Batal</button>
    </form>
  );
}
```

## Route Parameters

### Dynamic Routes

```jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { productId } = useParams();
  
  return (
    <div>
      <h1>Detail Produk #{productId}</h1>
      <ProductInfo id={productId} />
    </div>
  );
}

// Di App.js
<Routes>
  <Route path="/products/:productId" element={<ProductDetail />} />
</Routes>
```

### Multiple Parameters

```jsx
function BlogPost() {
  const { year, month, slug } = useParams();
  
  return (
    <article>
      <h1>Blog Post</h1>
      <p>Dipublikasikan: {month}/{year}</p>
      <p>Slug: {slug}</p>
    </article>
  );
}

// Di App.js
<Route path="/blog/:year/:month/:slug" element={<BlogPost />} />
```

### Query Parameters

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const page = searchParams.get('page') || '1';
  
  const handleFilterChange = (newCategory) => {
    setSearchParams({ q: query, category: newCategory, page: '1' });
  };
  
  return (
    <div>
      <h1>Hasil Pencarian: {query}</h1>
      <p>Kategori: {category || 'Semua'}</p>
      <p>Halaman: {page}</p>
      
      <select onChange={(e) => handleFilterChange(e.target.value)}>
        <option value="">Semua</option>
        <option value="electronics">Elektronik</option>
        <option value="clothing">Pakaian</option>
      </select>
    </div>
  );
}
```

## Nested Routes

Nested routes memungkinkan kita membuat layout yang kompleks dengan shared UI.

### Struktur Nested Routes

```jsx
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <Link to="/dashboard">Overview</Link>
          <Link to="/dashboard/analytics">Analytics</Link>
          <Link to="/dashboard/settings">Settings</Link>
        </nav>
      </aside>
      <main className="content">
        <Outlet /> {/* Child routes render di sini */}
      </main>
    </div>
  );
}

function DashboardOverview() {
  return <h2>Dashboard Overview</h2>;
}

function DashboardAnalytics() {
  return <h2>Analytics</h2>;
}

function DashboardSettings() {
  return <h2>Settings</h2>;
}

// Di App.js
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<DashboardOverview />} />
    <Route path="analytics" element={<DashboardAnalytics />} />
    <Route path="settings" element={<DashboardSettings />} />
  </Route>
</Routes>
```

### Deeply Nested Routes

```jsx
function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <nav>
        <Link to="profile">Profile</Link>
        <Link to="account">Account</Link>
        <Link to="notifications">Notifications</Link>
      </nav>
      <Outlet />
    </div>
  );
}

// Di App.js
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="settings" element={<Settings />}>
      <Route index element={<Navigate to="profile" replace />} />
      <Route path="profile" element={<ProfileSettings />} />
      <Route path="account" element={<AccountSettings />} />
      <Route path="notifications" element={<NotificationSettings />} />
    </Route>
  </Route>
</Routes>
```

## Layout Routes

### Shared Layout

```jsx
function MainLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
}

// Di App.js
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </Route>
  
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
  </Route>
</Routes>
```

### Multiple Layouts per Route

```jsx
function App() {
  return (
    <Routes>
      {/* Public routes dengan main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Route>
      
      {/* Admin routes dengan admin layout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
      </Route>
      
      {/* Auth routes tanpa layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
```

## Protected Routes

### Basic Protected Route

```jsx
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// Penggunaan
<Routes>
  <Route path="/login" element={<Login />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### Protected Route dengan Role-based Access

```jsx
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

// Penggunaan
<Routes>
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminPanel />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/moderator" 
    element={
      <ProtectedRoute requiredRole="moderator">
        <ModeratorPanel />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### Protected Route Component dengan Outlet

```jsx
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <div>
      <UserNav />
      <Outlet />
    </div>
  );
}

// Di App.js
<Routes>
  <Route path="/login" element={<Login />} />
  <Route element={<ProtectedLayout />}>
    <Route path="/profile" element={<Profile />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>
```

## Lazy Loading dan Code Splitting

### React.lazy dengan Router

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </Suspense>
  );
}
```

### Route-based Code Splitting dengan Data Loading

```jsx
import { lazy, Suspense } from 'react';
import { Route, Routes, useLoaderData, Await } from 'react-router-dom';

// Loader function
const productLoader = async ({ params }) => {
  const response = await fetch(`/api/products/${params.id}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
};

const ProductDetail = lazy(() => import('./pages/ProductDetail'));

function ProductPage() {
  const { product } = useLoaderData();
  
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Await resolve={product}>
        {(productData) => <ProductDetail product={productData} />}
      </Await>
    </Suspense>
  );
}

// Di router configuration
const router = createBrowserRouter([
  {
    path: '/products/:id',
    element: <ProductPage />,
    loader: productLoader,
    errorElement: <ErrorPage />
  }
]);
```

## Data Loading dengan Router

### Loader Functions

```jsx
import { 
  createBrowserRouter, 
  RouterProvider, 
  useLoaderData,
  defer,
  Await
} from 'react-router-dom';
import { Suspense } from 'react';

// Loader untuk halaman produk
const productsLoader = async () => {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to load products');
  return response.json();
};

// Loader dengan deferred data
const dashboardLoader = async () => {
  const userPromise = fetchUser(); // Fast
  const analyticsPromise = fetchAnalytics(); // Slow
  
  return defer({
    user: await userPromise,
    analytics: analyticsPromise
  });
};

function Dashboard() {
  const { user, analytics } = useLoaderData();
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Await resolve={analytics}>
          {(data) => <AnalyticsChart data={data} />}
        </Await>
      </Suspense>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: dashboardLoader
  }
]);
```

### Action Functions untuk Form Submission

```jsx
import { Form, useActionData, useNavigation } from 'react-router-dom';

const contactAction = async ({ request }) => {
  const formData = await request.formData();
  const contact = Object.fromEntries(formData);
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  });
  
  if (!response.ok) {
    return { error: 'Failed to send message' };
  }
  
  return { success: true };
};

function ContactPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  return (
    <Form method="post">
      {actionData?.error && <div className="error">{actionData.error}</div>}
      {actionData?.success && <div className="success">Message sent!</div>}
      
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </Form>
  );
}
```

## Error Handling

### Error Boundaries dengan Router

```jsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops!</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    );
  }
  
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.message}</i>
      </p>
    </div>
  );
}

// Di router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'products/:id',
        element: <ProductDetail />,
        loader: productLoader,
        errorElement: <ProductError />
      }
    ]
  }
]);
```

## Scroll Restoration

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
```

## Advanced Patterns

### Breadcrumbs

```jsx
import { useMatches } from 'react-router-dom';

function Breadcrumbs() {
  const matches = useMatches();
  
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.data));
  
  return (
    <nav className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && ' > '}
          {crumb}
        </span>
      ))}
    </nav>
  );
}

// Di route configuration
{
  path: 'products',
  element: <Products />,
  handle: { crumb: () => <Link to="/products">Products</Link> }
}
```

### Modal Routes

```jsx
function App() {
  const location = useLocation();
  const state = location.state;
  
  return (
    <div>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/img/:id" element={<ImageView />} />
      </Routes>
      
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/img/:id" element={<Modal />} />
        </Routes>
      )}
    </div>
  );
}

function Gallery() {
  const location = useLocation();
  
  return (
    <div>
      {images.map(image => (
        <Link
          key={image.id}
          to={`/img/${image.id}`}
          state={{ backgroundLocation: location }}
        >
          <img src={image.thumbnail} alt={image.title} />
        </Link>
      ))}
    </div>
  );
}
```

### Route Guards dengan Hooks

```jsx
function useRequireAuth(redirectUrl = '/login') {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectUrl, { 
        replace: true,
        state: { from: location }
      });
    }
  }, [isAuthenticated, navigate, redirectUrl, location]);
  
  return isAuthenticated;
}

function Dashboard() {
  const isAuth = useRequireAuth();
  
  if (!isAuth) return null;
  
  return <div>Dashboard Content</div>;
}
```

## Testing Routes

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

test('navigating to product detail', async () => {
  render(
    <MemoryRouter initialEntries={['/products']}>
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
  
  const productLink = screen.getByText('Product 1');
  await userEvent.click(productLink);
  
  expect(screen.getByText('Product Detail')).toBeInTheDocument();
});
```

## Kesimpulan

React Router v6 membawa banyak perubahan dan peningkatan yang membuat routing di React lebih intuitif dan powerful:

1. **Routes dan Route** dengan element prop membuat konfigurasi lebih sederhana
2. **Nested Routes** dengan Outlet memungkinkan layout yang kompleks dengan shared UI
3. **useNavigate** menggantikan useHistory dengan API yang lebih bersih
4. **Data APIs** (loader, action) memungkinkan data fetching yang terintegrasi dengan routing
5. **Relative links** membuat navigasi lebih predictable

Dengan memahami konsep-konsep ini, Anda dapat membangun aplikasi single-page dengan navigasi yang mulus, performa yang optimal, dan user experience yang baik. Ingatlah untuk selalu mempertimbangkan code splitting untuk aplikasi yang besar dan menggunakan protected routes untuk mengamankan halaman-halaman sensitif.

## Artikel Selanjutnya

Setelah memahami React Router, lanjutkan pembelajaran Anda dengan membaca [React Forms dan Validasi: Modern React Hook Form dan Zod](/blog/react-forms-dan-validasi-modern-react-hook-form-zod).
