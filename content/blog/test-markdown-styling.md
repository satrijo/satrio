---
title: Menguji Styling Markdown dengan Tailwind Typography
date: 2025-07-02T10:00:00.000Z
description: Artikel ini dibuat untuk menguji berbagai elemen markdown dan memastikan styling Tailwind Typography bekerja dengan baik.
category: Testing
article_language: indonesian
programming_language: javascript
---

# Panduan Lengkap Tailwind Typography

Artikel ini dibuat untuk menguji berbagai elemen markdown dan memastikan styling *Tailwind Typography* bekerja dengan baik.

## Pengantar

**Tailwind Typography** (atau yang biasa disebut *prose*) adalah plugin yang memungkinkan kita untuk styling konten yang kaya (rich content) seperti artikel blog, dokumentasi, atau halaman lain yang berisi banyak teks dan elemen markdown.

## Daftar Fitur

Berikut adalah beberapa elemen yang akan kita uji:

1. **Headings** (h1 sampai h6)
2. *Teks miring* dan **teks tebal**
3. [Link](#) dan [Link dengan URL](https://tailwindcss.com)
4. List (ordered dan unordered)
5. Blockquote
6. Code dan syntax highlighting
7. Tabel
8. Gambar

### Contoh Blockquote

> Ini adalah contoh blockquote. Blockquote biasanya digunakan untuk menampilkan kutipan atau callout penting dalam sebuah artikel.
>
> Blockquote bisa memiliki beberapa paragraf dan elemen lainnya.

### Contoh Code

Berikut adalah contoh inline code: `const greeting = "Hello World"`.

Dan ini adalah contoh blok kode:

```javascript
// Contoh fungsi JavaScript
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time > 0 ? time : 1;
}

// Panggil fungsinya
const article = "Ini adalah artikel panjang dengan banyak kata...";
const readingTime = calculateReadingTime(article);
console.log(`Estimasi waktu baca: ${readingTime} menit`);
```

### Contoh Tabel

| Nama | Role | Keahlian |
|------|------|----------|
| Budi | Frontend Developer | React, Vue, Tailwind |
| Ani | Backend Developer | Node.js, Express, MongoDB |
| Dedi | DevOps | Docker, Kubernetes, AWS |

## Kesimpulan

Dengan plugin Tailwind Typography, kita bisa mendapatkan styling yang konsisten dan menarik untuk konten markdown tanpa perlu menulis banyak CSS manual. Ini sangat berguna untuk blog, dokumentasi, dan konten lain yang kaya dengan teks dan elemen formatting.

---

*Artikel ini dibuat oleh [Satrio](/) pada tanggal 2 Juli 2025.*
