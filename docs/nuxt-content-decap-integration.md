# Integrasi Nuxt Content dengan Decap CMS

## Ringkasan

Dokumen ini menjelaskan pendekatan yang digunakan untuk mengintegrasikan Nuxt Content dengan Decap CMS di proyek blog ini.

## Komponen Utama

1. **Nuxt Content**: Modul untuk Nuxt.js yang mengelola konten
2. **Decap CMS**: CMS berbasis Git (sebelumnya NetlifyCMS) untuk mengelola konten markdown
3. **content.config.ts**: File konfigurasi untuk mendefinisikan koleksi konten

## Struktur Konfigurasi

### 1. Konfigurasi Nuxt Content (`content.config.ts`)

```typescript
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            source: 'blog/*.md',
            type: 'page',
            schema: z.object({
                title: z.string().min(1).max(100),
                date: z.date(),
                description: z.string().optional(),
                category: z.string().optional(),
                article_language: z.string().optional(),
                programming_language: z.string().optional(),
            }),
        })
    }
})
```

### 2. Konfigurasi Decap CMS (`public/admin/config.yml`)

```yaml
collections:
  - name: "blog"
    label: "Blog"
    folder: "content/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Description", name: "description", widget: "string" }
      - { label: "Category", name: "category", widget: "string" }
      # ... fields lainnya ...
      - { label: "Body", name: "body", widget: "markdown" }
```

## Mengakses Konten di Komponen Vue

### Menggunakan queryCollection

```javascript
// Di dalam <script setup>
const { data: posts } = await useAsyncData('blog', () => 
    queryCollection('blog').all()
)
```

### Menampilkan Konten di Template

```vue
<template>
  <div v-for="post in posts" :key="post._path">
    <h3>{{ post.title }}</h3>
    <p>{{ post.body.value[0][2].substring(0, 150) }}...</p>
  </div>
</template>
```

## Catatan Penting

1. **body.value[0][2]**: Konten markdown utama diakses melalui path ini dalam struktur data MDC yang dihasilkan oleh Nuxt Content.
2. **queryCollection vs queryContent**: `queryCollection` digunakan untuk mengakses koleksi yang didefinisikan dalam `content.config.ts`, sementara `queryContent` adalah API yang lebih umum.
3. **Validasi Schema**: Gunakan Zod (z) untuk memvalidasi struktur frontmatter dari file markdown.
4. **Konsistensi kunci cache**: Gunakan kunci cache yang konsisten di seluruh aplikasi.
5. **Hindari optimasi prematur**: Fitur seperti `fresh: true`, refresh eksplisit, dan pengaturan caching kompleks dapat menyebabkan masalah yang sulit di-debug.

## Troubleshooting

Jika konten tidak muncul:

1. **Pastikan file `content.config.ts` sudah benar**: Verifikasi bahwa koleksi 'blog' didefinisikan dengan benar
2. **Gunakan pendekatan yang konsisten**: Pastikan semua komponen menggunakan `queryCollection` bukannya `queryContent`
3. **Gunakan kunci cache yang konsisten**: Sebaiknya gunakan kunci cache yang sama (misalnya 'blog') di seluruh komponen untuk konten yang sama
4. **Hindari konfigurasi yang rumit**: Kadang, pendekatan sederhana bekerja lebih baik daripada menggunakan fitur reaktif dan caching yang kompleks
5. **Periksa konten teks dengan menavigasi antar halaman**: Terkadang, Anda perlu memuat ulang halaman atau menavigasi dari halaman utama ke halaman blog untuk membuat cache diperbarui dengan benar

### Contoh pendekatan yang berhasil:

```javascript
// Pendekatan sederhana dan konsisten di semua komponen
const { data: posts } = await useAsyncData('blog', () => 
    queryCollection('blog').all()
)
```
  { fresh: true } // Tambahkan ini
)
```

### 2. Refresh Data secara Eksplisit

```javascript
// Refresh data saat komponen dimount
onMounted(() => {
  refreshPosts()
})

// Juga refresh saat route berubah
watch(() => route.path, () => {
  refreshPosts()
})
```

### 3. Gunakan Plugin untuk Menghapus Cache Global

Buat plugin `plugins/content-cache.js`:

```javascript
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    nuxtApp.$clearNuxtData('blog')
    nuxtApp.$clearNuxtData('latest-blog')
  })
})
```

### 4. Gunakan Kunci Cache yang Berbeda

Pastikan setiap komponen menggunakan kunci cache yang unik untuk `useAsyncData` (misalnya 'blog', 'latest-blog', dll.)
