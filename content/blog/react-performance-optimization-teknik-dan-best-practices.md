---
title: "React Performance Optimization: Teknik dan Best Practices"
date: 2026-01-30T00:00:00.000Z
description: "Pelajari teknik optimasi performa React yang komprehensif. Dari React.memo, useMemo, useCallback, hingga code splitting dan lazy loading untuk aplikasi yang cepat."
category: React
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

Performa adalah aspek krusial dalam pengembangan aplikasi React. Aplikasi yang lambat dapat mengakibatkan pengalaman pengguna yang buruk, bounce rate tinggi, dan konversi yang rendah. Dalam tutorial ini, kita akan membahas berbagai teknik optimasi performa React secara mendalam, mulai dari yang paling dasar hingga teknik lanjutan.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami React Hooks. Jika Anda belum familiar dengan Hooks, silakan baca [React Hooks Lengkap: useState, useEffect, dan Custom Hooks](/blog/react-hooks-lengkap-usestate-useeffect-dan-custom-hooks) terlebih dahulu.

## Mengapa Optimasi Performa Penting?

Sebelum masuk ke teknik, mari kita pahami mengapa optimasi performa sangat penting:

1. **User Experience**: Pengguna mengharapkan aplikasi yang responsif dan cepat
2. **SEO**: Google mempertimbangkan Core Web Vitals dalam ranking
3. **Conversion Rate**: Setiap detik delay dapat mengurangi konversi
4. **Mobile Users**: Pengguna mobile seringkali memiliki koneksi yang lebih lambat
5. **Cost Efficiency**: Aplikasi yang efisien menggunakan lebih sedikit resources server

### Metrics Penting

- **First Contentful Paint (FCP)**: Waktu pertama kali konten muncul
- **Largest Contentful Paint (LCP)**: Waktu elemen terbesar selesai dirender
- **Time to Interactive (TTI)**: Waktu aplikasi bisa diinteraksi
- **Cumulative Layout Shift (CLS)**: Perubahan layout yang tidak terduga
- **First Input Delay (FID)**: Delay sebelum aplikasi merespons input pertama

## 1. React.memo untuk Component Optimization

`React.memo` adalah Higher Order Component yang mencegah re-render komponen jika props tidak berubah.

### ⚠️ CATATAN PENTING 2026: React Compiler

**React Compiler (sebelumnya React Forget)** adalah compiler optimasi yang secara otomatis menambahkan memoization tanpa perlu manual `React.memo`, `useMemo`, atau `useCallback`.

**Status 2026:**
- React Compiler masih dalam tahap experimental/preview
- Untuk proyek production, manual optimization masih diperlukan
- Setelah React Compiler stabil, manual memoization akan menjadi obsolete

**Rekomendasi:**
- Gunakan manual optimization untuk proyek production sekarang
- Monitor perkembangan React Compiler
- Siapkan codebase untuk migrasi ke React Compiler di masa depan

### Basic Usage

```jsx
import React, { memo } from 'react';

// Komponen tanpa memo - akan re-render setiap kali parent render
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// Dengan memo - hanya re-render jika props berubah
const MemoizedComponent = memo(function ExpensiveComponent({ data }) {
  console.log('Rendering MemoizedComponent');
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

// Arrow function syntax
const UserList = memo(({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
});
```

### Custom Comparison Function

```jsx
const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - hanya re-render jika ID berubah
  return prevProps.product.id === nextProps.product.id;
});
```

### When NOT to Use React.memo

```jsx
// ❌ Jangan gunakan memo untuk komponen sederhana
const SimpleText = memo(({ text }) => <p>{text}</p>);
// Overhead comparison > benefit

// ❌ Jangan gunakan jika props selalu berbeda
const RandomNumber = memo(() => <p>{Math.random()}</p>);
// Selalu re-render anyway

// ✅ Gunakan untuk komponen yang:
// 1. Render mahal (kompleks, banyak data)
// 2. Menerima props yang jarang berubah
// 3. Re-render sering karena parent
```

## 2. useMemo untuk Computation Optimization

`useMemo` menyimpan hasil komputasi dan hanya menghitung ulang jika dependencies berubah.

### Basic Usage

```jsx
import { useMemo } from 'react';

function ProductList({ products, filter }) {
  // Tanpa useMemo - dihitung setiap render
  // const filteredProducts = products.filter(p => p.category === filter);
  
  // Dengan useMemo - hanya dihitung jika products atau filter berubah
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product => 
      product.category === filter &&
      product.price > 0
    );
  }, [products, filter]);

  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Expensive Computations

```jsx
function DataAnalysis({ data }) {
  const statistics = useMemo(() => {
    // Komputasi yang mahal
    const sum = data.reduce((a, b) => a + b.value, 0);
    const avg = sum / data.length;
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    
    // Sorting
    const sorted = [...data].sort((a, b) => b.value - a.value);
    
    // Grouping
    const grouped = data.reduce((acc, item) => {
      const key = item.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
    
    return { sum, avg, max, min, sorted, grouped };
  }, [data]);

  return (
    <div>
      <p>Average: {statistics.avg}</p>
      <p>Max: {statistics.max}</p>
      <p>Min: {statistics.min}</p>
    </div>
  );
}
```

### Object/Array References

```jsx
function ChartComponent({ data }) {
  // ❌ Tanpa useMemo - object baru dibuat setiap render
  // const chartData = { values: data, type: 'line' };
  
  // ✅ Dengan useMemo - object yang sama jika data tidak berubah
  const chartData = useMemo(() => ({
    values: data,
    type: 'line',
    options: {
      responsive: true,
      animation: false
    }
  }), [data]);

  return <Chart data={chartData} />;
}
```

## 3. useCallback untuk Function Optimization

`useCallback` menyimpan referensi function yang sama antar render, penting untuk child components yang menggunakan `React.memo`.

### Basic Usage

```jsx
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ❌ Tanpa useCallback - function baru setiap render
  // const handleClick = () => {
  //   console.log('Clicked');
  // };

  // ✅ Dengan useCallback - function yang sama
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Empty dependency array = never recreate

  // Dengan dependencies
  const handleSubmit = useCallback((data) => {
    console.log('Submitting:', data, count);
  }, [count]); // Recreate jika count berubah

  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <ExpensiveChild onSubmit={handleSubmit} />
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

// Child menggunakan memo
const ChildComponent = memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
```

### Event Handlers dengan Parameter

```jsx
function ProductList({ products, onAddToCart }) {
  // ❌ Salah - membuat function baru untuk setiap item
  // {products.map(p => (
  //   <button onClick={() => onAddToCart(p.id)}>Add</button>
  // ))}

  // ✅ Benar - useCallback dengan parameter
  const handleAddToCart = useCallback((productId) => {
    onAddToCart(productId);
  }, [onAddToCart]);

  return (
    <div>
      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onAdd={() => handleAddToCart(product.id)}
        />
      ))}
    </div>
  );
}

const ProductItem = memo(({ product, onAdd }) => {
  return (
    <div>
      <span>{product.name}</span>
      <button onClick={onAdd}>Add to Cart</button>
    </div>
  );
});
```

## 4. Code Splitting dan Lazy Loading

Code splitting memecah bundle menjadi chunks yang lebih kecil, dimuat on-demand.

### React.lazy dan Suspense

```jsx
import { lazy, Suspense } from 'react';

// ❌ Import biasa - masuk ke bundle utama
// import Dashboard from './Dashboard';

// ✅ Lazy loading - dimuat saat dibutuhkan
const Dashboard = lazy(() => import('./Dashboard'));
const UserProfile = lazy(() => import('./UserProfile'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### Named Exports dengan Lazy

```jsx
// Untuk named exports
const AdminPanel = lazy(() => 
  import('./Admin').then(module => ({ 
    default: module.AdminPanel 
  }))
);
```

### Preloading Components

```jsx
function App() {
  const [showModal, setShowModal] = useState(false);
  
  // Preload saat hover
  const handleMouseEnter = () => {
    const ModalComponent = import('./Modal');
  };

  return (
    <div>
      <button 
        onClick={() => setShowModal(true)}
        onMouseEnter={handleMouseEnter}
      >
        Open Modal
      </button>
      
      {showModal && (
        <Suspense fallback={null}>
          <Modal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}
```

### Route-based Code Splitting

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Split berdasarkan route
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));

// Loading component
const PageLoader = () => (
  <div className="page-loader">
    <Spinner />
    <p>Loading page...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
```

## 5. Virtualization untuk Long Lists

Virtualization hanya merender item yang terlihat di viewport, bukan seluruh list.

### React Window

```jsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  );

  return (
    <List
      height={500}        // Tinggi container
      itemCount={items.length}  // Total item
      itemSize={50}       // Tinggi setiap item
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### Variable Size List

```jsx
import { VariableSizeList as List } from 'react-window';

function VariableList({ items }) {
  // Function untuk mendapatkan tinggi setiap item
  const getItemSize = (index) => {
    return items[index].expanded ? 150 : 50;
  };

  const Row = ({ index, style }) => (
    <div style={style}>
      <ExpensiveItem data={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### React Virtualized (Alternatif)

```jsx
import { VirtualScroll } from 'react-virtualized';

function LargeTable({ data }) {
  const rowRenderer = ({ key, index, style }) => (
    <div key={key} style={style} className="table-row">
      <div>{data[index].name}</div>
      <div>{data[index].email}</div>
      <div>{data[index].role}</div>
    </div>
  );

  return (
    <VirtualScroll
      width={800}
      height={600}
      rowCount={data.length}
      rowHeight={40}
      rowRenderer={rowRenderer}
    />
  );
}
```

## 6. Image Optimization

Gambar seringkali menjadi bottleneck performa terbesar.

### Lazy Loading Images

```jsx
import { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="lazy-image-container">
      {!isLoaded && <div className="skeleton-loader" />}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
          {...props}
        />
      )}
    </div>
  );
}
```

### Responsive Images

```jsx
function ResponsiveImage({ src, alt }) {
  return (
    <picture>
      <source
        media="(max-width: 600px)"
        srcSet={`${src}-small.webp`}
        type="image/webp"
      />
      <source
        media="(max-width: 1200px)"
        srcSet={`${src}-medium.webp`}
        type="image/webp"
      />
      <source
        srcSet={`${src}-large.webp`}
        type="image/webp"
      />
      <img
        src={`${src}-large.jpg`}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
```

## 7. Debouncing dan Throttling

Mengontrol frekuensi eksekusi function untuk event yang sering terjadi.

### Debounce Hook

```jsx
import { useEffect, useRef } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Penggunaan
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Throttle Hook

```jsx
function useThrottle(value, limit) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Penggunaan untuk scroll
function ScrollComponent() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const throttledScroll = useThrottle(scrollPosition, 100);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Update hanya setiap 100ms
    console.log('Scroll position:', throttledScroll);
  }, [throttledScroll]);

  return <div>Scroll position: {throttledScroll}</div>;
}
```

## 8. State Management Optimization

Optimasi dalam mengelola state dapat meningkatkan performa signifikan.

### Memisahkan State

```jsx
// ❌ Satu state besar
function UserProfile() {
  const [state, setState] = useState({
    user: null,
    posts: [],
    comments: [],
    loading: false,
    error: null,
    formData: {}
  });
  
  // Update satu field akan re-render semua
  const updateForm = (field, value) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value }
    }));
  };
}

// ✅ State terpisah
function UserProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Update form tidak mempengaruhi user, posts, dll
  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
}
```

### Context Splitting

```jsx
// ❌ Satu context besar
const AppContext = createContext();

// ✅ Multiple focused contexts
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value={themeValue}>
      <UserContext.Provider value={userValue}>
        <NotificationContext.Provider value={notificationValue}>
          <AppContent />
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
```

## 9. Web Workers untuk Heavy Computation

Memindahkan komputasi berat ke background thread.

```jsx
import { useEffect, useRef, useState } from 'react';

function DataProcessor({ data }) {
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const workerRef = useRef();

  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('./dataProcessor.worker.js', import.meta.url)
    );

    workerRef.current.onmessage = (event) => {
      setResult(event.data);
      setProcessing(false);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const processData = () => {
    setProcessing(true);
    workerRef.current.postMessage(data);
  };

  return (
    <div>
      <button onClick={processData} disabled={processing}>
        {processing ? 'Processing...' : 'Process Data'}
      </button>
      {result && <div>Result: {JSON.stringify(result)}</div>}
    </div>
  );
}

// dataProcessor.worker.js
self.onmessage = (event) => {
  const data = event.data;
  
  // Heavy computation
  const result = data.map(item => {
    // Complex calculations
    return expensiveOperation(item);
  });
  
  self.postMessage(result);
};
```

## 10. Bundle Analysis dan Optimization

### Analyzing Bundle Size

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});

# Run analysis
ANALYZE=true npm run build
```

### Tree Shaking

```jsx
// ❌ Import semua dari library
import lodash from 'lodash';
lodash.debounce(fn, 300);

// ✅ Import hanya yang dibutuhkan
import debounce from 'lodash/debounce';
// atau
import { debounce } from 'lodash-es';
```

### Dynamic Imports dengan Loading States

```jsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Load Chart
      </button>
      
      {showChart && (
        <Suspense fallback={
          <div className="chart-skeleton">
            <Spinner />
            <p>Loading visualization...</p>
          </div>
        }>
          <HeavyChart data={chartData} />
        </Suspense>
      )}
    </div>
  );
}
```

## 11. Server-Side Rendering (SSR) Optimization

### Next.js SSR

```jsx
// pages/index.js
export async function getServerSideProps() {
  const data = await fetchData();
  
  return {
    props: {
      data,
    },
    // Revalidate setiap 60 detik (ISR)
    revalidate: 60,
  };
}

export default function Home({ data }) {
  return <Dashboard data={data} />;
}
```

### Streaming SSR

```jsx
// React 18 Streaming
import { Suspense } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

const stream = renderToPipeableStream(<App />, {
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('Content-type', 'text/html');
    stream.pipe(response);
  },
  onError(error) {
    console.error(error);
  },
});
```

## 12. Profiling dan Debugging

### React DevTools Profiler

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, // Component name
  phase, // "mount" | "update"
  actualDuration, // Waktu render
  baseDuration, // Waktu render tanpa memo
  startTime, // Waktu mulai
  commitTime // Waktu commit
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  });
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Header />
      <Main />
      <Footer />
    </Profiler>
  );
}
```

### Performance.mark

```jsx
import { useEffect } from 'react';

function ExpensiveComponent() {
  useEffect(() => {
    performance.mark('expensive-component-start');
    
    // Expensive operations
    
    performance.mark('expensive-component-end');
    performance.measure(
      'expensive-component',
      'expensive-component-start',
      'expensive-component-end'
    );
  }, []);

  return <div>...</div>;
}
```

## Checklist Optimasi Performa

### Development
- [ ] Gunakan React DevTools Profiler
- [ ] Enable Strict Mode
- [ ] Monitor console untuk warnings

### Production
- [ ] Enable production build
- [ ] Minify dan compress assets
- [ ] Enable gzip/brotli compression
- [ ] Setup CDN untuk static assets

### Code
- [ ] Gunakan React.memo untuk komponen mahal
- [ ] Gunakan useMemo untuk komputasi berat
- [ ] Gunakan useCallback untuk event handlers
- [ ] Implement code splitting
- [ ] Lazy load images
- [ ] Virtualize long lists
- [ ] Debounce/throttle frequent events

### Network
- [ ] Optimize images (WebP, responsive)
- [ ] Enable HTTP/2
- [ ] Setup service worker untuk caching
- [ ] Preload critical resources

## Kesimpulan

Optimasi performa React adalah proses berkelanjutan, bukan tugas satu kali. Mulailah dengan:

1. **Measure First**: Gunakan React DevTools dan Lighthouse
2. **Identify Bottlenecks**: Temukan komponen yang paling lambat
3. **Apply Optimizations**: Gunakan teknik yang sesuai
4. **Measure Again**: Verifikasi improvements
5. **Repeat**: Terus monitor dan optimize

Ingat: **Premature optimization is the root of all evil**. Optimize hanya setelah mengidentifikasi masalah performa yang nyata.

**Prioritas Optimasi:**
1. Code splitting dan lazy loading
2. Image optimization
3. List virtualization
4. Memoization (React.memo, useMemo, useCallback)
5. State management optimization

## Artikel Selanjutnya

Setelah memahami Performance Optimization di React, lanjutkan pembelajaran Anda dengan membaca [React Testing Lengkap: Unit, Integration, dan E2E](/blog/react-testing-lengkap-unit-integration-dan-e2e).

Selamat mengoptimalkan! 🚀
