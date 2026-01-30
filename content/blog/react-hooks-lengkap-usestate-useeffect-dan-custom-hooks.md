---
title: "React Hooks Lengkap: useState, useEffect, dan Custom Hooks"
date: 2026-01-30T00:00:00.000Z
description: "Pelajari semua tentang React Hooks mulai dari useState, useEffect, hingga pembuatan Custom Hooks. Tingkatkan keterampilan React Anda dengan panduan lengkap ini."
category: React
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# React Hooks Lengkap: useState, useEffect, dan Custom Hooks

React Hooks diperkenalkan dalam React 16.8 dan telah merevolusi cara kita menulis komponen React. Sebelum Hooks, state dan lifecycle methods hanya tersedia di class components. Dengan Hooks, kita dapat menggunakan state dan fitur React lainnya di function components, membuat kode lebih sederhana, lebih mudah dibaca, dan lebih mudah diuji. Artikel ini akan membahas secara komprehensif tentang React Hooks, mulai dari Hooks dasar seperti useState dan useEffect, hingga pembuatan Custom Hooks sendiri.

> **Prasyarat:** Artikel ini mengasumsikan Anda sudah memahami dasar-dasar React. Jika Anda baru memulai dengan React, silakan baca [React.js Dasar: Panduan Lengkap untuk Pemula](/blog/reactjs-dasar-panduan-lengkap-untuk-pemula) terlebih dahulu.

## Apa itu React Hooks?

Hooks adalah fungsi spesial yang memungkinkan Anda "mengaitkan" ke fitur-fitur React seperti state dan lifecycle methods dari function components. Hooks tidak bekerja di dalam class components - mereka memungkinkan Anda menggunakan React tanpa class.

### Aturan Penggunaan Hooks

Ada dua aturan penting yang harus diikuti saat menggunakan Hooks:

1. **Hanya panggil Hooks di level atas**: Jangan panggil Hooks di dalam loops, conditions, atau nested functions. Panggil Hooks hanya dari function components atau Custom Hooks.

2. **Hanya panggil Hooks dari function React**: Panggil Hooks dari function components React atau dari Custom Hooks, bukan dari fungsi JavaScript biasa.

React menyediakan linter plugin (eslint-plugin-react-hooks) untuk secara otomatis menegakkan aturan-aturan ini.

## useState Hook

`useState` adalah Hook yang paling sering digunakan. Ia memungkinkan function components memiliki state lokal.

### Sintaks Dasar useState

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

`useState` menerima satu argument: nilai initial state. Ia mengembalikan array dengan dua elemen:
- **State saat ini**: Nilai state terkini
- **Setter function**: Fungsi untuk memperbarui state

### State dengan Object

Ketika state adalah object, kita perlu berhati-hati saat mengupdate:

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const updateName = (newName) => {
    // Salah - akan menghapus email dan age
    // setUser({ name: newName });
    
    // Benar - spread operator untuk mempertahankan properti lain
    setUser({
      ...user,
      name: newName
    });
  };
  
  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="Nama"
      />
      <p>Nama: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Umur: {user.age}</p>
    </div>
  );
}
```

### Lazy Initialization

Jika nilai initial state memerlukan komputasi yang berat, gunakan fungsi:

```jsx
function ExpensiveComponent() {
  // Fungsi ini hanya dipanggil sekali saat initial render
  const [data, setData] = useState(() => {
    const initialData = computeExpensiveValue();
    return initialData;
  });
  
  return <div>{data}</div>;
}
```

### Functional Updates

Ketika state baru bergantung pada state sebelumnya, gunakan fungsi updater:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    // Cara yang salah jika update terjadi berurutan
    // setCount(count + 1);
    // setCount(count + 1);
    
    // Cara yang benar
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment by 2</button>
    </div>
  );
}
```

### Multiple State Variables

Anda dapat menggunakan useState berkali-kali dalam satu komponen:

```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitForm({ name, email, password });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama"
      />
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Kirim'}
      </button>
    </form>
  );
}
```

## useEffect Hook

`useEffect` adalah Hook untuk melakukan side effects di function components. Side effects adalah operasi yang memengaruhi sesuatu di luar komponen, seperti mengambil data dari API, berlangganan ke event, atau memanipulasi DOM secara manual.

> **Catatan:** Jika Anda belum familiar dengan konsep asynchronous programming di JavaScript, disarankan untuk membaca [Asynchronous JavaScript: Callback, Promise, dan Async/Await](/blog/javascript-asynchronous-callback-promise-async-await) terlebih dahulu.

### Sintaks Dasar useEffect

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Effect akan berjalan setelah render
    document.title = `Anda mengklik ${count} kali`;
    
    // Cleanup function (opsional)
    return () => {
      // Cleanup akan berjalan sebelum effect berikutnya atau saat unmount
    };
  }, [count]); // Dependency array
  
  return (
    <div>
      <p>Anda mengklik {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik saya
      </button>
    </div>
  );
}
```

### Dependency Array

Dependency array menentukan kapan effect harus dijalankan ulang:

1. **Tanpa dependency array**: Effect berjalan setiap kali komponen render
2. **Dengan empty array `[]`**: Effect hanya berjalan sekali (mirip componentDidMount)
3. **Dengan dependencies `[a, b]`**: Effect berjalan saat salah satu dependency berubah

### Contoh Penggunaan useEffect

#### ⚠️ CATATAN PENTING 2026: Data Fetching Best Practices

**Menggunakan `useEffect` untuk data fetching sudah tidak lagi direkomendasikan sebagai best practice.** Untuk aplikasi modern 2026, gunakan:

1. **React Server Components** (Next.js App Router) - Data fetching di server
2. **TanStack Query (React Query)** - Library khusus untuk server state management
3. **Suspense dengan data fetching libraries**

Namun, untuk pemahaman konsep, berikut adalah contoh useEffect untuk data fetching:

#### 1. Mengambil Data dari API (Educational Purpose)

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/users');
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []); // Empty array = hanya berjalan sekali
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### 2. Event Listener

```jsx
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup: hapus event listener saat komponen unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div>
      <p>Lebar: {windowSize.width}px</p>
      <p>Tinggi: {windowSize.height}px</p>
    </div>
  );
}
```

#### 3. Interval dan Timeout

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  
  return (
    <div>
      <div>{seconds} detik</div>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => {
        setSeconds(0);
        setIsActive(false);
      }}>
        Reset
      </button>
    </div>
  );
}
```

#### 4. Subscription

```jsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };
    
    connection.onMessage(handleNewMessage);
    
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Effect berjalan ulang saat roomId berubah
  
  return (
    <div>
      <h1>Room: {roomId}</h1>
      {messages.map((msg, index) => (
        <p key={index}>{msg.text}</p>
      ))}
    </div>
  );
}
```

### Multiple useEffect

Anda dapat menggunakan useEffect berkali-kali untuk memisahkan concern yang berbeda:

```jsx
function Example() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Effect untuk document title
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  // Effect untuk localStorage
  useEffect(() => {
    localStorage.setItem('userName', name);
  }, [name]);
  
  // Effect untuk analytics
  useEffect(() => {
    analytics.track('Page View', { count, name });
  }, [count, name]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama"
      />
    </div>
  );
}
```

## useContext Hook

`useContext` memungkinkan Anda membaca dan berlangganan ke context dari function component Anda.

### Membuat dan Menggunakan Context

```jsx
import { createContext, useContext, useState } from 'react';

// Membuat Context
const ThemeContext = createContext(null);

// Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer Component menggunakan useContext
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff'
      }}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
}

// App Component
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

### Multiple Contexts

```jsx
const UserContext = createContext(null);
const LanguageContext = createContext('en');

function App() {
  return (
    <UserContext.Provider value={currentUser}>
      <LanguageContext.Provider value={currentLanguage}>
        <Toolbar />
      </LanguageContext.Provider>
    </UserContext.Provider>
  );
}

function Toolbar() {
  const user = useContext(UserContext);
  const language = useContext(LanguageContext);
  
  return (
    <div>
      <p>User: {user.name}</p>
      <p>Language: {language}</p>
    </div>
  );
}
```

## useRef Hook

`useRef` mengembalikan objek ref yang mutable dengan properti `.current` yang diinisialisasi dengan argument yang diberikan. Objek ref akan tetap ada selama komponen ada.

### Mengakses DOM Elements

```jsx
import { useRef, useEffect } from 'react';

function TextInputWithFocusButton() {
  const inputRef = useRef(null);
  
  const handleClick = () => {
    // Mengakses DOM node langsung
    inputRef.current.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>
        Focus Input
      </button>
    </div>
  );
}
```

### Menyimpan Nilai yang Tidak Memicu Render

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  const previousCount = useRef(count);
  
  useEffect(() => {
    renderCount.current += 1;
    previousCount.current = count;
  });
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Previous Count: {previousCount.current}</p>
      <p>Render count: {renderCount.current}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Interval ID atau Timeout ID

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
  
  useEffect(() => {
    return () => stopTimer(); // Cleanup saat unmount
  }, []);
  
  return (
    <div>
      <p>{seconds} detik</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

## useReducer Hook

`useReducer` adalah alternatif untuk `useState` yang biasanya lebih disukai ketika Anda memiliki state logic yang kompleks yang melibatkan multiple sub-values atau ketika state berikutnya bergantung pada state sebelumnya.

### Sintaks Dasar

```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### useReducer dengan Form Kompleks

```jsx
const initialState = {
  values: {
    username: '',
    email: '',
    password: ''
  },
  errors: {},
  isSubmitting: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };
    case 'CLEAR_ERROR':
      const { [action.field]: _, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return initialState;
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, errors: action.errors };
    default:
      return state;
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name, value });
    dispatch({ type: 'CLEAR_ERROR', field: name });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });
    
    // Validasi dan submit logic
    try {
      await submitForm(state.values);
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (errors) {
      dispatch({ type: 'SUBMIT_ERROR', errors });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={state.values.username}
        onChange={handleChange}
      />
      {state.errors.username && <span>{state.errors.username}</span>}
      
      <input
        name="email"
        type="email"
        value={state.values.email}
        onChange={handleChange}
      />
      {state.errors.email && <span>{state.errors.email}</span>}
      
      <input
        name="password"
        type="password"
        value={state.values.password}
        onChange={handleChange}
      />
      {state.errors.password && <span>{state.errors.password}</span>}
      
      <button type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## useMemo dan useCallback

### useMemo

`useMemo` mengembalikan nilai memoized yang hanya dihitung ulang ketika salah satu dependency berubah.

```jsx
import { useMemo } from 'react';

function ExpensiveComputation({ data, filter }) {
  const filteredData = useMemo(() => {
    console.log('Computing filtered data...');
    return data.filter(item => item.includes(filter));
  }, [data, filter]);
  
  return (
    <ul>
      {filteredData.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

### useCallback

`useCallback` mengembalikan fungsi callback yang memoized yang hanya berubah ketika salah satu dependency berubah.

```jsx
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // Fungsi ini hanya dibuat ulang saat count berubah
  const handleClick = useCallback(() => {
    console.log('Button clicked, count:', count);
  }, [count]);
  
  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <input 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

const ChildComponent = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
```

## useLayoutEffect

`useLayoutEffect` memiliki signature yang sama dengan `useEffect`, tetapi ia menjalankan effect secara synchronous setelah semua DOM mutations. Gunakan ini untuk membaca layout dari DOM dan melakukan render ulang secara synchronous.

```jsx
import { useLayoutEffect, useRef } from 'react';

function Tooltip({ children, content }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    
    // Hitung posisi berdasarkan ukuran tooltip
    setPosition({
      top: rect.top - rect.height - 10,
      left: rect.left + rect.width / 2
    });
  }, []);
  
  return (
    <div>
      {children}
      <div 
        ref={tooltipRef}
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left
        }}
      >
        {content}
      </div>
    </div>
  );
}
```

## useImperativeHandle

`useImperativeHandle` menyesuaikan instance value yang diekspos saat menggunakan `ref`.

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react';

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    }
  }));
  
  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const fancyInputRef = useRef();
  
  return (
    <div>
      <FancyInput ref={fancyInputRef} />
      <button onClick={() => fancyInputRef.current.focus()}>
        Focus Input
      </button>
      <button onClick={() => fancyInputRef.current.clear()}>
        Clear Input
      </button>
    </div>
  );
}
```

## useDebugValue

`useDebugValue` dapat digunakan untuk menampilkan label untuk Custom Hooks di React DevTools.

```jsx
import { useState, useEffect, useDebugValue } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  useDebugValue(isOnline ? 'Online' : 'Offline');
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
```

## Membuat Custom Hooks

Custom Hooks adalah mekanisme untuk mengekstrak logika komponen ke dalam fungsi yang dapat digunakan kembali.

### Aturan Custom Hooks

1. Nama Custom Hook harus dimulai dengan "use"
2. Custom Hook dapat memanggil Hooks lain
3. Custom Hook dapat menerima parameter dan mengembalikan nilai apa pun

### Contoh Custom Hooks

#### 1. useLocalStorage

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
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
function App() {
  const [name, setName] = useLocalStorage('name', '');
  
  return (
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Nama Anda"
    />
  );
}
```

#### 2. useFetch

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      abortController.abort();
    };
  }, [url]);
  
  return { data, loading, error };
}

// Penggunaan
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

#### 3. useDebounce

```jsx
import { useState, useEffect } from 'react';

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
      // Lakukan pencarian
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      type="text"
      placeholder="Cari..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

#### 4. useWindowSize

```jsx
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return windowSize;
}

// Penggunaan
function ResponsiveComponent() {
  const { width } = useWindowSize();
  
  return (
    <div>
      {width < 768 ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

#### 5. usePrevious

```jsx
import { useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// Penggunaan
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Sekarang: {count}, Sebelumnya: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### 6. useToggle

```jsx
import { useState, useCallback } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  
  return [value, toggle, setTrue, setFalse];
}

// Penggunaan
function Modal() {
  const [isOpen, toggleOpen, open, close] = useToggle(false);
  
  return (
    <div>
      <button onClick={open}>Buka Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Konten Modal</p>
          <button onClick={close}>Tutup</button>
        </div>
      )}
    </div>
  );
}
```

## Kesimpulan

React Hooks telah mengubah cara kita menulis komponen React secara fundamental. Dengan Hooks, kita dapat:

1. **Menggunakan state dan lifecycle di function components** - Tidak perlu lagi beralih antara function dan class components.

2. **Memisahkan concern dengan lebih baik** - Mengorganisir kode berdasarkan apa yang dilakukannya, bukan berdasarkan lifecycle methods.

3. **Menggunakan kembali stateful logic** - Custom Hooks memungkinkan kita mengekstrak dan menggunakan kembali logika stateful tanpa mengubah hierarki komponen.

4. **Kode yang lebih bersih dan mudah diuji** - Function components dengan Hooks umumnya lebih mudah dibaca, dipahami, dan diuji dibandingkan class components.

Beberapa tips untuk menggunakan Hooks secara efektif:

- Selalu ikuti aturan Hooks (hanya panggil di level atas dan hanya dari React functions)
- Gunakan ESLint plugin untuk React Hooks untuk menangkap kesalahan umum
- Pilih Hook yang tepat untuk kasus penggunaan Anda (useState untuk state sederhana, useReducer untuk state kompleks)
- Buat Custom Hooks untuk logika yang dapat digunakan kembali
- Hindari premature optimization dengan useMemo dan useCallback kecuali benar-benar diperlukan

Dengan memahami Hooks secara mendalam, Anda telah membuka pintu untuk menulis aplikasi React yang lebih modern, efisien, dan mudah dipelihara. Teruslah berlatih dan membangun proyek untuk menguasai konsep-konsep ini secara praktis.

## Artikel Selanjutnya

Setelah memahami React Hooks, lanjutkan pembelajaran Anda dengan membaca [React Context API dan State Management](/blog/react-context-api-dan-state-management).
