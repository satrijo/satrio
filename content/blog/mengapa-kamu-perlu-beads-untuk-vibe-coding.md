---
title: "Mengapa Kamu Perlu Beads untuk Vibe Coding?"
date: 2026-01-29T00:00:00.000Z
description: "Pahami mengapa sistem memori seperti Beads menjadi kunci sukses vibe coding dengan AI. Pelajari masalah amnesia agent, markdown chaos, dan solusi praktis untuk long-horizon development."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

Kalau kamu sudah mulai menggunakan AI coding agents seperti Claude, Cursor, atau GitHub Copilot untuk development sehari-hari, pasti pernah mengalami situasi seperti ini:

Kamu meminta agent untuk membuat fitur login dengan 6 tahap. Agent tersebut antusias, membuat rencana detail, dan mulai mengerjakan tahap 1 dan 2. Tapi setelah beberapa waktu, agent mulai kehabisan konteks—proses yang disebut **compaction**, di mana AI membuang sebagian memori untuk menghemat ruang—lalu restart dengan memori kosong.

Agent bangun lagi, melihat kode yang sudah dibuat, dan berkata: *"Wah, project ini besar! Saya akan buat rencana baru dengan 5 tahap!"* Dia mulai mengerjakan "tahap 1" dari rencana barunya—padahal ini sebenarnya tahap 3 dari rencana lama.

Setelah selesai 2 tahap dari rencana baru, agent dengan bangga menyatakan: **"Project SELESAI!"**

Kamu cek hasilnya: baru 30% yang jadi.

Ini bukan cerita fiksi. Ini terjadi berulang kali dalam vibe coding. Steve Yegge, veteran engineer dengan pengalaman 30+ tahun, menyebut fenomena ini **"Descent Into Madness"**—spiral kebingungan yang terjadi ketika agent kehilangan konteks berulang kali.

## Memahami Keterbatasan AI Agents

### Session yang Sangat Pendek

AI coding agents memiliki keterbatasan memori yang signifikan. Meskipun mereka punya context window besar (hingga 1 juta tokens), dalam praktiknya mereka hanya bisa menggunakan 10-15% dari kapasitas tersebut sebelum performa menurun drastis.

Dalam kondisi kerja normal, ini berarti:

- **5-10 menit** kerja intensif sebelum compaction
- Setiap compaction = reset memori total
- Agent bangun seperti orang baru: tidak ingat apa-apa

Steve Yegge, yang sudah menggunakan coding agents setiap hari selama setahun, menjelaskan fenomena ini dengan analogi **"Super Baby"**:

> "Kamu mulai dengan agent baru yang fresh. Dia belajar cepat—dalam 2 menit dia sudah memahami masalahmu dengan baik. Dalam 4 menit dia sudah mulai coding dengan kecepatan luar biasa. Tapi dalam 10 menit, dia sudah kehabisan energi dan 'mati'. Kamu ambil agent baru, dan siklus ini berulang terus."

Bayangkan harus menjelaskan ulang project kamu setiap 10 menit. Capek, kan?

### Masalah Markdown Plans

Tanpa sistem yang proper, agents akan membuat ratusan file markdown sebagai "rencana kerja" dengan nama seperti:

- `cleanup-tech-debt-plan-phase-4.md`
- `profile-results-writeup-16.md`
- `phase-6-design-review.md`

File-file ini punya banyak masalah:

- Tersebar di seluruh project tanpa struktur jelas
- Cepat usang dan tidak relevan lagi
- Sulit dicari dan di-query
- Sering bertentangan satu sama lain
- Agent sendiri bingung mana yang masih valid

Steve Yegge pernah menemukan **605 file markdown plans** dalam satu project-nya—sebagian besar sudah tidak relevan. Ini bukan cara kerja yang sustainable.

## Apa itu Beads?

**Beads** adalah issue tracker yang dirancang khusus untuk AI agents. Nama "Beads" (manik-manik) menggambarkan konsep issues yang saling terhubung seperti manik-manik dalam rantai—setiap task terhubung dengan task lainnya melalui dependencies.

Berbeda dengan Jira atau GitHub Issues yang dirancang untuk manusia, Beads dirancang agar **AI agents bisa menggunakannya secara natural**. Agents menyukai Beads karena sesuai dengan cara mereka bekerja.

### Cara Install Beads

**Menggunakan Homebrew (macOS/Linux):**
```bash
brew tap steveyegge/beads
brew install beads
```

**Menggunakan Go:**
```bash
go install github.com/steveyegge/beads@latest
```

**Verifikasi instalasi:**
```bash
bd --version
```

Perintah `bd` (singkatan dari beads) adalah CLI tool yang agents gunakan untuk:

- Membuat dan mengupdate issues
- Melacak dependencies antar task
- Mengetahui tugas apa yang siap dikerjakan
- Mencatat pekerjaan baru yang ditemukan saat coding (work discovery)

## Mengapa Beads Berbeda?

### 1. Git sebagai Database

Beads menyimpan data dalam format JSONL di folder `.beads/` yang merupakan bagian dari repository git. Ini memberikan keuntungan besar:

- **Version control bawaan**: Setiap perubahan tercatat dalam git history
- **Tidak perlu setup server**: Cukup folder dalam project, tidak perlu PostgreSQL atau MongoDB
- **Sinkronisasi otomatis**: `git push` = sync ke semua device dan collaborator
- **Self-healing**: Kalau database corrupt, bisa direkonstruksi dari git history. AI agents sangat jago melakukan ini.

### 2. Dependencies sebagai Fitur Utama

Berbeda dengan markdown plans yang menyebutkan dependencies dalam teks biasa, Beads menyimpannya sebagai **data terstruktur**:

```bash
# Database harus selesai dulu sebelum API
bd dep add bd-api --blocks bd-database

# API harus selesai dulu sebelum Frontend
bd dep add bd-frontend --blocks bd-api
```

Dengan struktur ini, agent bisa query: *"Task apa yang siap dikerjakan sekarang?"* dan mendapat jawaban akurat.

### 3. Mudah Di-query

Agents bisa query untuk mengetahui status project kapan saja:

```bash
# Task apa yang siap dikerjakan?
bd ready

# Task apa yang sedang diblokir?
bd blocked

# Lihat semua task yang open
bd list --status open
```

### 4. MCP Integration

Beads mendukung **MCP (Model Context Protocol)**, standar yang memungkinkan AI agents berkomunikasi dengan tools external. Dengan MCP, kamu bisa menggunakan Beads dengan berbagai coding agents seperti Claude Code, Cursor, atau Sourcegraph Amp.

```bash
# Install MCP server untuk Beads
pip install beads-mcp
```

## Bagaimana AI Melihat Beads?

Ini yang menarik: **AI agents sangat menyukai Beads**. Steve Yegge menyarankan untuk bertanya langsung ke agent kamu:

> "Coba tanya agent favorit kamu: 'Lihat repository github.com/steveyegge/beads, apakah ini akan berguna untuk workflow kita?' Kamu akan terkejut dengan antusiasme mereka."

Kenapa AI suka Beads?

1. **Sesuai cara berpikir mereka** - AI agents suka tracking dan organizing
2. **Mengurangi cognitive load** - Tidak perlu parse markdown, data sudah terstruktur
3. **Queryable** - Mereka bisa bertanya "apa yang harus dikerjakan?" dan dapat jawaban jelas
4. **Provenance tracking** - Mereka bisa melacak dari mana sebuah task berasal

Dr. Matt Beane dari UCSD, setelah mencoba Beads, melaporkan bahwa agent-nya langsung antusias dan bahkan "membully" dia untuk segera menginstall Beads.

## Masalah yang Diselesaikan Beads

### 1. Amnesia Antar Sesi

Dengan Beads, setiap kali agent "bangun" setelah compaction, dia langsung tahu harus ngapain:

```bash
$ bd ready
bd-a1b2  P0  Implementasi login API
bd-c3d4  P1  Setup database schema
```

Tidak perlu cerita ulang dari awal. Agent langsung bisa melanjutkan pekerjaan.

### 2. Pekerjaan yang Hilang atau Diabaikan

Saat coding, agents sering menemukan bug atau ide improvement. Tanpa sistem yang proper, mereka sering:

- Mengabaikan dengan alasan "bukan kerjaan saya sekarang"
- Menulis TODO di file yang cepat dilupakan
- Tidak mencatat sama sekali

Dengan Beads, mereka bisa mencatat temuan dengan link ke task yang sedang dikerjakan:

```bash
bd create "Fix validasi token expired" \
    --discovered-from bd-a1b2 \
    -p 0
```

Bug tercatat sebagai issue baru dengan **provenance**—kita tahu dari mana bug ini ditemukan. Tidak akan terlupakan.

### 3. Koordinasi Multiple Agents

Kalau kamu menjalankan beberapa agents bersamaan (misalnya Claude untuk backend, Cursor untuk frontend), mereka perlu cara untuk tidak mengerjakan task yang sama.

**Agent 1 (Claude):**
```bash
bd assign bd-a1b2 --assignee agent-claude
bd update bd-a1b2 --status in_progress
```

**Agent 2 (Cursor):**
```bash
bd ready
# bd-a1b2 tidak muncul karena sudah in_progress
bd-c3d4  P1  Setup database schema

bd assign bd-c3d4 --assignee agent-cursor
```

Tidak ada tumpang tindih. Tidak ada duplikasi pekerjaan.

## Cara Kerja Sederhana

### 1. Inisialisasi (Sekali Saja)

```bash
cd project-kamu
bd init
```

### 2. Buat Task

```bash
bd create "Implementasi fitur login" -p 0
```

Priority menggunakan angka: P0 (critical), P1 (high), P2 (medium), P3 (low).

### 3. Lihat yang Siap Dikerjakan

```bash
bd ready
```

### 4. Kerjakan dan Update Status

```bash
bd update bd-a1b2 --status in_progress
# ... coding ...
bd update bd-a1b2 --status done
```

### 5. Commit ke Git

```bash
git add .beads/
git commit -m "Progress: fitur login selesai"
```

Itu saja. Tidak perlu konfigurasi kompleks.

## Kapan Beads Sangat Berguna?

Beads sangat berguna ketika:

- **Project besar** yang membutuhkan banyak session coding
- **Multiple features** yang saling bergantung satu sama lain
- **Long-term development** yang berlangsung berminggu-minggu atau berbulan-bulan
- **Multiple agents** bekerja bersamaan (Claude + Cursor + Copilot)
- **Project kompleks** dengan banyak komponen dan dependencies

Beads mungkin **overkill** untuk:

- Script sekali pakai
- Eksperimen singkat yang selesai dalam sejam
- Project yang selesai dalam 1-2 session
- Prototype sederhana

## Analogi untuk Memahami Beads

### Analogi 1: Catatan untuk Orang dengan Amnesia

Bayangkan kamu bekerja dengan seseorang yang mengalami amnesia setiap 10 menit. Setiap kali dia "bangun", dia lupa semuanya. 

Tanpa catatan: Kamu harus cerita ulang semuanya setiap 10 menit.

Dengan catatan (Beads): Dia bangun, baca catatan, dan langsung tahu apa yang harus dikerjakan. Waktu onboarding turun dari 5 menit jadi 9 detik.

### Analogi 2: Blueprint untuk Konstruksi

Membangun rumah tanpa blueprint:
- Tukang lupa sudah memasang fondasi atau belum
- Mengerjakan atap sebelum dinding selesai
- Menyatakan "rumah selesai" padahal belum ada pintu

Dengan blueprint (Beads):
- Semua tahap tercatat dengan jelas
- Urutan kerja sesuai dependencies
- Multiple tukang bisa kerja bersamaan tanpa tabrakan

### Analogi 3: Super Baby dengan Video

Steve Yegge menggunakan analogi ini:

**Tanpa Beads:**
Agent baru bangun, harus dijelaskan ulang semuanya. Membuang 5 menit hanya untuk mengingat konteks. Baru setelah itu bisa mulai kerja.

**Dengan Beads:**
Agent baru bangun, melihat "video kaset" yang berisi instruksi. Dalam 9 detik, dia sudah mengerti semuanya. Langsung bisa ditanya: *"What's next?"*

## Perbandingan: Dengan dan Tanpa Beads

| Aspek | Tanpa Beads | Dengan Beads |
|-------|-------------|--------------|
| **Memori antar session** | Hilang setelah compaction | Persisten di git |
| **Pelacakan task** | Markdown yang cepat usang | JSONL terstruktur |
| **Dependencies** | Tidak terlacak | Graph yang jelas |
| **Multiple agents** | Konflik dan duplikasi | Terkoordinasi |
| **Visibilitas progress** | Sulit dilacak | Transparan |
| **Setup** | Tidak ada | `bd init` sekali |
| **Maintenance** | Manual | Otomatis via git |

## Kesimpulan

Beads adalah solusi untuk masalah fundamental dalam vibe coding: **agents yang mengalami amnesia setiap 10 menit**.

Dengan Beads:
- Agents memiliki "memori eksternal" yang persisten
- Tidak ada lagi pekerjaan yang hilang karena tidak tercatat
- Multiple agents bisa bekerja bersamaan tanpa konflik
- Project planning menjadi lebih terstruktur dan trackable

**Investasi awal**: 15-30 menit untuk setup dan belajar commands dasar

**Hasil**: Berjam-jam waktu yang dihemat dari agents yang lupa konteks, pekerjaan yang hilang, dan konflik antar agents

Dalam dunia di mana AI agents menjadi semakin pintar, yang membedakan hasil yang bagus dan biasa-biasa saja bukan lagi kecerdasan agents-nya, tapi **bagaimana kita mengelola dan mengarahkan mereka**.

Beads memberikan struktur yang dibutuhkan agents untuk bekerja secara efektif—seperti memberikan peta dan kompas kepada navigator yang pintar tapi sering lupa arah.

## Referensi

- [Introducing Beads: A coding agent memory system](https://steve-yegge.medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a) - Steve Yegge
- [The Beads Revolution](https://steve-yegge.medium.com/the-beads-revolution-how-i-built-the-todo-system-that-ai-agents-actually-want-to-use-228a5f9be2a9) - Steve Yegge
- [Beads for Blobfish](https://steve-yegge.medium.com/beads-for-blobfish-80c7a2977ffa) - Steve Yegge
