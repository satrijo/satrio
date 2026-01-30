---
title: "React Context API dan State Management"
date: 2026-01-30T00:00:00.000Z
description: "Pelajari cara mengelola state aplikasi React dengan Context API, Redux, dan Zustand. Panduan lengkap untuk state management di aplikasi React modern."
category: React
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

# React Context API dan State Management

Mengelola state adalah salah satu aspek paling penting dalam pengembangan aplikasi React. Seiring bertambahnya kompleksitas aplikasi, mengelola state yang tersebar di berbagai komponen menjadi semakin menantang. Artikel ini akan membahas berbagai solusi state management di React, mulai dari Context API bawaan React, Redux yang populer, hingga Zustand yang ringan dan modern.

## Masalah Prop Drilling

Sebelum membahas solusi state management, penting untuk memahami masalah yang ingin dipecahkan. Prop drilling adalah situasi di mana data perlu melewati banyak komponen perantara yang sebenarnya tidak membutuhkan data tersebut, hanya untuk mencapai komponen yang membutuhkan.

```jsx
// Contoh Prop Drilling
function App() {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
      <Footer />
    </div>
  );
}

function Header({ user }) {
  return (
    <header>
      <Navigation user={user} />
    </header>
  );
}

function Navigation({ user }) {
  return (
    <nav>
      <UserMenu user={user} />
    </nav>
  );
}

function UserMenu({ user }) {
  // Baru di sini data user benar-benar digunakan
  return <div>Welcome, {user.name}</div>;
}
```

Dalam contoh di atas, data `user` harus melewati `Header` dan `Navigation` hanya untuk sampai ke `UserMenu`. Ini membuat kode sulit dipelihara dan komponen menjadi terlalu terikat pada struktur hierarki.

## React Context API

Context API adalah fitur bawaan React yang memungkinkan kita berbagi data di seluruh komponen tree tanpa harus melewati props secara manual di setiap level.

### Membuat Context

```jsx
import { createContext, useContext, useState } from 'react';

// Membuat Context
const UserContext = createContext(null);

// Custom hook untuk menggunakan context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider Component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

### Menggunakan Context

```jsx
import { UserProvider, useUser } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Header />
      <Main />
      <Footer />
    </UserProvider>
  );
}

function Header() {
  return (
    <header>
      <Navigation />
    </header>
  );
}

function Navigation() {
  return (
    <nav>
      <UserMenu />
    </nav>
  );
}

function UserMenu() {
  const { user, logout, isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <button>Login</button>;
  }
  
  return (
    <div>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Multiple Contexts

Aplikasi yang kompleks sering membutuhkan multiple contexts:

```jsx
// ThemeContext.js
const ThemeContext = createContext('light');

// LanguageContext.js
const LanguageContext = createContext('en');

// NotificationContext.js
const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {}
});

// App.js
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

### Context dengan useReducer

Untuk state yang kompleks, kombinasikan Context dengan useReducer:

```jsx
const CartContext = createContext(null);

const initialState = {
  items: [],
  total: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item.price * item.quantity)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      const quantityDiff = action.payload.quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const value = {
    ...state,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQuantity: (id, quantity) => 
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' })
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

### Optimasi Context

Context memiliki masalah performa: setiap kali value berubah, semua consumer akan re-render. Berikut beberapa strategi optimasi:

#### 1. Memisahkan Context

```jsx
// Daripada satu context besar
const AppContext = createContext({
  user: null,
  theme: 'light',
  language: 'en',
  notifications: []
});

// Pisahkan menjadi context yang lebih kecil
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const NotificationContext = createContext([]);
```

#### 2. Menggunakan React.memo

```jsx
function ThemedButton() {
  const { theme } = useTheme();
  console.log('ThemedButton rendered');
  
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      Click me
    </button>
  );
}

export default React.memo(ThemedButton);
```

#### 3. Selector Pattern

```jsx
function useUserSelector(selector) {
  const user = useContext(UserContext);
  return selector(user);
}

// Penggunaan
const userName = useUserSelector(user => user?.name);
const userRole = useUserSelector(user => user?.role);
```

## Redux

Redux adalah library state management yang paling populer untuk React. Ia mengikuti pola Flux dan menggunakan single source of truth dengan immutable updates.

### Konsep Dasar Redux

1. **Store**: Object sentral yang menyimpan seluruh state aplikasi
2. **Actions**: Plain objects yang mendeskripsikan apa yang terjadi
3. **Reducers**: Functions yang menentukan bagaimana state berubah berdasarkan actions
4. **Dispatch**: Method untuk mengirim actions ke store

### Setup Redux dengan Redux Toolkit

Redux Toolkit (RTK) adalah cara modern dan direkomendasikan untuk menggunakan Redux.

```bash
npm install @reduxjs/toolkit react-redux
```

### Membuat Slice

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk untuk operasi async
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    addUser: (state, action) => {
      state.items.push(action.payload);
    },
    removeUser: (state, action) => {
      state.items = state.items.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.items.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addUser, removeUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
```

### Store Configuration

```jsx
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import postsReducer from './postsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser']
      }
    })
});
```

### Provider Setup

```jsx
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

### Menggunakan Redux di Components

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser, fetchUsers } from './usersSlice';

function UserList() {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector(state => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: 'New User',
      email: 'new@example.com'
    };
    dispatch(addUser(newUser));
  };
  
  const handleRemoveUser = (id) => {
    dispatch(removeUser(id));
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <button onClick={handleAddUser}>Add User</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Reselect untuk Memoized Selectors

```jsx
import { createSelector } from '@reduxjs/toolkit';

// Input selectors
const selectUsers = state => state.users.items;
const selectSearchTerm = state => state.users.searchTerm;

// Memoized selector
export const selectFilteredUsers = createSelector(
  [selectUsers, selectSearchTerm],
  (users, searchTerm) => {
    if (!searchTerm) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

// Penggunaan
const filteredUsers = useSelector(selectFilteredUsers);
```

## Zustand

Zustand adalah library state management yang ringan, sederhana, dan tidak memerlukan boilerplate yang banyak. Ia menggunakan hooks dan tidak memerlukan provider wrapping.

### Instalasi

```bash
npm install zustand
```

### Store Dasar

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

// Penggunaan
function Counter() {
  const { count, increment, decrement, reset } = useStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Store Kompleks dengan Async Actions

```jsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        users: [],
        currentUser: null,
        loading: false,
        error: null,
        
        // Actions
        setCurrentUser: (user) => set({ currentUser: user }),
        
        fetchUsers: async () => {
          set({ loading: true, error: null });
          try {
            const response = await fetch('/api/users');
            const users = await response.json();
            set({ users, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
        
        addUser: async (userData) => {
          try {
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData)
            });
            const newUser = await response.json();
            set((state) => ({ users: [...state.users, newUser] }));
          } catch (error) {
            set({ error: error.message });
          }
        },
        
        updateUser: async (id, updates) => {
          try {
            const response = await fetch(`/api/users/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updates)
            });
            const updatedUser = await response.json();
            set((state) => ({
              users: state.users.map(user =>
                user.id === id ? updatedUser : user
              )
            }));
          } catch (error) {
            set({ error: error.message });
          }
        },
        
        removeUser: async (id) => {
          try {
            await fetch(`/api/users/${id}`, { method: 'DELETE' });
            set((state) => ({
              users: state.users.filter(user => user.id !== id)
            }));
          } catch (error) {
            set({ error: error.message });
          }
        },
        
        // Computed
        getUserCount: () => get().users.length,
        getActiveUsers: () => get().users.filter(user => user.isActive)
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ currentUser: state.currentUser })
      }
    )
  )
);
```

### Selector untuk Performa

```jsx
function UserList() {
  // Hanya subscribe ke users array
  const users = useUserStore(state => state.users);
  
  // Atau menggunakan shallow untuk multiple fields
  const { loading, error } = useUserStore(
    state => ({ loading: state.loading, error: state.error }),
    shallow
  );
  
  // Subscribe ke computed value
  const userCount = useUserStore(state => state.getUserCount());
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Total Users: {userCount}</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Multiple Stores

```jsx
// authStore.js
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false })
}));

// cartStore.js
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  clearCart: () => set({ items: [] })
}));

// uiStore.js
const useUIStore = create((set) => ({
  theme: 'light',
  sidebarOpen: false,
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}));
```

## Perbandingan Solusi State Management

| Fitur | Context API | Redux | Zustand |
|-------|-------------|-------|---------|
| **Learning Curve** | Rendah | Tinggi | Sangat Rendah |
| **Boilerplate** | Sedikit | Banyak | Minimal |
| **DevTools** | Terbatas | Lengkap | Baik |
| **Middleware** | Tidak | Ya | Ya |
| **Persistensi** | Manual | Manual | Built-in |
| **Performa** | Perlu optimasi | Baik | Sangat Baik |
| **Ukuran Bundle** | 0 (built-in) | ~10KB | ~1KB |
| **TypeScript** | Baik | Sangat Baik | Sangat Baik |

## Kapan Menggunakan Apa?

### Gunakan Context API ketika:
- State yang jarang berubah (theme, language, user auth)
- Aplikasi kecil hingga menengah
- Tidak ingin menambah dependency eksternal
- State tidak terlalu kompleks

### Gunakan Redux ketika:
- Aplikasi besar dengan state yang kompleks
- Butuh time-travel debugging
- Tim besar dengan banyak developer
- Butuh struktur yang ketat dan predictable

### Gunakan Zustand ketika:
- Ingin solusi yang ringan dan sederhana
- Butuh performa yang baik tanpa banyak konfigurasi
- Aplikasi menengah dengan state yang moderat
- Ingin menghindari boilerplate Redux

## Best Practices

### 1. Pilih State Management yang Tepat

Jangan over-engineering. Mulailah dengan useState dan useContext, baru pindah ke solusi eksternal jika diperlukan.

### 2. Normalisasi State

```jsx
// Daripada nested array
const state = {
  posts: [
    { id: 1, title: 'Post 1', author: { id: 1, name: 'John' } }
  ]
};

// Gunakan normalized state
const state = {
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', authorId: 1 }
    },
    allIds: [1]
  },
  users: {
    byId: {
      1: { id: 1, name: 'John' }
    },
    allIds: [1]
  }
};
```

### 3. Hindari Mutable Updates

```jsx
// Salah
state.items.push(newItem);

// Benar
setState({ items: [...state.items, newItem] });
```

### 4. Gunakan Selectors

```jsx
// Tanpa selector - re-render saat state lain berubah
const users = useSelector(state => state.users.items);

// Dengan selector - hanya re-render saat users berubah
const selectUsers = state => state.users.items;
const users = useSelector(selectUsers);
```

### 5. Split State Logically

```jsx
// Pisahkan state berdasarkan domain
- auth: { user, isAuthenticated, token }
- cart: { items, total, discount }
- ui: { theme, sidebarOpen, notifications }
- entities: { users, products, orders }
```

## Kesimpulan

State management adalah aspek krusial dalam pengembangan aplikasi React. Setiap solusi memiliki kelebihan dan kekurangannya masing-masing:

- **Context API** adalah solusi bawaan yang cukup untuk banyak kasus, terutama untuk state yang jarang berubah.

- **Redux** menawarkan struktur yang kuat dan tools yang lengkap untuk aplikasi enterprise yang kompleks.

- **Zustand** memberikan keseimbangan antara kesederhanaan dan fitur, ideal untuk aplikasi modern yang ingin menghindari boilerplate.

Pilihlah solusi yang paling sesuai dengan kebutuhan aplikasi Anda. Ingatlah bahwa tidak ada solusi yang sempurna untuk semua kasus, dan seringkali kombinasi dari beberapa pendekatan adalah yang terbaik. Yang terpenting adalah memahami konsep-konsep fundamental state management dan menerapkannya dengan konsisten di seluruh codebase Anda.
