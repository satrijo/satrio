---
title: "Tailwind CSS v4: Perubahan Besar yang Perlu Kamu Tahu"
date: 2026-01-28T00:00:00.000Z
description: "Panduan lengkap tentang Tailwind CSS v4, mulai dari fitur baru, perubahan fundamental, hingga cara migrasi dari v3."
category: Web Development
article_language: indonesian
ai_generated: ai
programming_language: CSS
---

Tailwind CSS sudah lama menjadi pilihan utama developer untuk styling aplikasi web. Setelah bertahun-tahun dengan v3, akhirnya v4 hadir dengan perubahan yang cukup signifikan. Bukan sekadar update minor, ini adalah penulisan ulang dari nol dengan fokus pada performa dan kemudahan penggunaan.

## Apa yang Berubah di v4?

Tailwind CSS v4 membawa perubahan fundamental dalam cara framework ini bekerja. Berikut hal-hal penting yang perlu kamu pahami.

### 1. Konfigurasi Langsung di CSS

Perubahan paling mencolok adalah perpindahan dari konfigurasi JavaScript ke CSS. Di v3, kamu perlu file `tailwind.config.js`:

```javascript
// tailwind.config.js (cara lama v3)
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#3b82f6',
      },
    },
  },
}
```

Di v4, semua konfigurasi dilakukan langsung di file CSS:

```css
/* styles.css (cara baru v4) */
@import "tailwindcss";

@theme {
  --color-brand: #3b82f6;
  --font-display: "Inter", sans-serif;
  --spacing-18: 4.5rem;
}
```

Keuntungannya? Satu file lebih sedikit untuk di-maintain, dan kamu bisa melihat semua konfigurasi di satu tempat yang sama dengan styles-mu.

### 2. Instalasi yang Lebih Sederhana

Setup Tailwind v4 jauh lebih simpel. Tidak perlu lagi konfigurasi `content` paths karena framework sekarang bisa mendeteksi file template secara otomatis.

```bash
## Install
npm install tailwindcss@latest

## Untuk project Vite, gunakan plugin khusus
npm install @tailwindcss/vite
```

```css
/* Cukup import satu baris */
@import "tailwindcss";
```

Tailwind v4 secara otomatis mengabaikan file di `.gitignore`, binary files, dan folder seperti `node_modules`. Jadi dalam banyak kasus, zero configuration benar-benar tercapai.

### 3. Performa yang Jauh Lebih Cepat

Tim Tailwind melakukan penulisan ulang engine dari nol, dan hasilnya sangat terasa:

| Metrik | v3.4 | v4.0 | Peningkatan |
|--------|------|------|-------------|
| Full build | 378ms | 100ms | 3.78x |
| Incremental rebuild (CSS baru) | 44ms | 5ms | 8.8x |
| Incremental rebuild (tanpa CSS baru) | 35ms | 192µs | 182x |

Incremental build yang tidak memerlukan CSS baru sekarang selesai dalam hitungan **mikrodetik**. Ini berarti feedback loop saat development jadi hampir instant.

### 4. CSS Variables untuk Semua Theme Values

Setiap design token yang kamu definisikan sekarang tersedia sebagai CSS variable:

```css
@theme {
  --color-primary: #3b82f6;
  --spacing-section: 5rem;
}
```

Variables ini bisa diakses di mana saja, termasuk inline styles atau JavaScript:

```jsx
// Akses di JavaScript
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary');

// Atau langsung di inline style
<div style={{ color: 'var(--color-primary)' }}>
  Hello World
</div>
```

### 5. Container Queries Tanpa Plugin

Fitur yang sebelumnya memerlukan plugin `@tailwindcss/container-queries` sekarang sudah built-in:

```html
<div class="@container">
  <div class="@sm:flex @lg:grid @lg:grid-cols-3">
    <!-- Layout berubah berdasarkan ukuran container, bukan viewport -->
  </div>
</div>
```

Container queries memungkinkan component yang responsif terhadap ukuran parent-nya, bukan ukuran screen. Ini sangat berguna untuk component library.

### 6. Palette Warna yang Diperbarui

Tailwind v4 menggunakan color space `oklch` yang lebih modern, menggantikan `rgb`. Hasilnya? Warna yang lebih vivid di monitor modern dengan wide gamut support.

```css
/* v3 (rgb) */
--color-blue-500: rgb(59, 130, 246);

/* v4 (oklch) */
--color-blue-500: oklch(0.6 0.2 250);
```

Perubahan ini mostly transparent untuk developer, tapi kamu akan notice warna yang sedikit lebih cerah dan vibrant.

### 7. 3D Transform Utilities

Sekarang kamu bisa melakukan transformasi 3D langsung dengan utility classes:

```html
<div class="rotate-x-45 rotate-y-30 perspective-500">
  3D transformed element
</div>
```

### 8. Gradient API yang Lebih Lengkap

V4 menambahkan dukungan untuk radial dan conic gradients:

```html
<!-- Radial gradient -->
<div class="bg-radial from-blue-500 to-purple-600"></div>

<!-- Conic gradient -->
<div class="bg-conic from-red-500 via-yellow-500 to-green-500"></div>

<!-- Linear gradient dengan angle custom -->
<div class="bg-linear-45 from-pink-500 to-violet-500"></div>
```

### 9. @starting-style untuk Animasi Entry

CSS `@starting-style` sekarang didukung dengan variant `starting`:

```html
<dialog class="starting:opacity-0 starting:scale-95 opacity-100 scale-100 transition-all">
  Modal content
</dialog>
```

Ini memungkinkan animasi entry tanpa JavaScript, perfect untuk modals dan popovers.

### 10. Dynamic Values Tanpa Extend

Di v3, untuk menggunakan nilai custom, kamu sering perlu menambahkannya di config. Di v4, arbitrary values lebih powerful:

```html
<!-- Spacing yang tidak ada di scale -->
<div class="p-[17px]"></div>

<!-- Warna custom inline -->
<div class="bg-[#1a2b3c]"></div>

<!-- Bahkan CSS variables -->
<div class="text-(--my-custom-color)"></div>
```

Perhatikan syntax baru untuk CSS variables menggunakan tanda kurung `()` bukan brackets `[]`.

## Breaking Changes yang Perlu Diperhatikan

### Browser Support

Tailwind v4 menargetkan browser modern: Safari 16.4+, Chrome 111+, dan Firefox 128+. Jika kamu perlu mendukung browser lama, pertimbangkan tetap di v3.4.

### Default Border dan Ring Color

```css
/* v3: border default ke gray-200 */
/* v4: border default ke currentColor */

/* Sekarang perlu explicit */
<div class="border border-gray-200"></div>
```

### Directive @tailwind Dihapus

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 */
@import "tailwindcss";
```

### Custom Utilities Syntax Baru

```css
/* v3 */
@layer utilities {
  .custom-scroll {
    scrollbar-width: thin;
  }
}

/* v4 */
@utility custom-scroll {
  scrollbar-width: thin;
}
```

## Cara Migrasi dari v3

Tailwind menyediakan upgrade tool untuk membantu migrasi:

```bash
npx @tailwindcss/upgrade
```

Tool ini akan:
- Update dependencies
- Migrasi config file ke CSS
- Update syntax yang berubah di template files

**Rekomendasi:** Jalankan di branch baru dan review perubahan dengan teliti.

### Langkah Manual

Jika prefer migrasi manual:

1. **Update package**
```bash
npm install tailwindcss@latest
```

2. **Untuk Vite, gunakan plugin baru**
```javascript
// vite.config.js
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss()],
}
```

3. **Update CSS entry point**
```css
/* Ganti @tailwind directives */
@import "tailwindcss";

/* Pindahkan theme config */
@theme {
  --color-brand: #your-color;
}
```

4. **Update breaking changes**
- Tambahkan explicit colors untuk border/ring
- Update arbitrary value syntax untuk variables
- Check hover behavior di mobile

## Haruskah Upgrade Sekarang?

**Upgrade jika:**
- Memulai project baru
- Tidak perlu support browser lama
- Ingin performa build yang lebih cepat
- Menggunakan Vite sebagai build tool

**Tunda upgrade jika:**
- Project bergantung pada plugins v3 yang belum di-update
- Perlu support browser lama (IE, Safari < 16.4)
- Project besar dengan timeline ketat

## Kesimpulan

Tailwind CSS v4 adalah langkah besar ke depan. CSS-first configuration membuat setup lebih intuitif, performa build yang meningkat drastis membuat development lebih menyenangkan, dan fitur-fitur baru seperti container queries dan 3D transforms membuka kemungkinan styling yang lebih luas.

Transisi dari v3 ke v4 memang membutuhkan effort, tapi upgrade tool yang disediakan membantu prosesnya. Untuk project baru, v4 adalah pilihan yang jelas. Untuk project existing, evaluasi kebutuhan browser support dan plugin dependencies sebelum memutuskan waktu yang tepat untuk migrasi.

Yang pasti, Tailwind tetap menjadi salah satu tool paling produktif untuk styling di web development modern.

---

*Selalu cek dokumentasi resmi di tailwindcss.com untuk panduan terlengkap dan update terbaru.*
