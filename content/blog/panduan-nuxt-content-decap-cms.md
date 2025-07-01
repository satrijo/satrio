---
title: Panduan Menggunakan Nuxt Content dengan Decap CMS
date: 2025-07-01T10:30:00.000Z
category: Tutorial
article_language: indonesian
programming_language: javascript
---

Nuxt Content adalah modul kuat untuk Nuxt.js yang memungkinkan Anda bekerja dengan konten di aplikasi Anda. Berpasangan dengan Decap CMS (sebelumnya NetlifyCMS), ini membuat manajemen konten menjadi sangat mudah.

## Langkah 1: Konfigurasi Nuxt Content

Pertama, pastikan Anda telah menginstal dan mengonfigurasi Nuxt Content dengan benar:

```bash
npm install @nuxt/content
```

Lalu tambahkan ke nuxt.config.ts:

```js
export default defineNuxtConfig({
  modules: [
    '@nuxt/content'
  ]
})
```

## Langkah 2: Konfigurasi Decap CMS

Atur Decap CMS dengan file konfigurasi di `public/admin/config.yml`.

## Langkah 3: Akses Konten dengan queryCollection

Gunakan `queryCollection` untuk mengakses koleksi konten Anda:

```js
const { data: posts } = await useAsyncData('blog', () => 
  queryCollection('blog').all()
)
```

Untuk mengakses konten markdown, gunakan `post.body.value[0][2]`.

## Kesimpulan

Dengan menyiapkan koleksi konten yang tepat dan menggunakan queryCollection, Anda dapat dengan mudah mengelola konten situs Anda menggunakan Decap CMS dan Nuxt Content.
