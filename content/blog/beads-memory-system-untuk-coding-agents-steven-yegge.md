---
title: "Beads: Sistem Memori untuk Coding Agents oleh Steve Yegge"
date: 2026-01-29T00:00:00.000Z
description: "Kenalan dengan Beads, sistem memori untuk AI coding agents dari Steve Yegge. Solusi untuk masalah agent lupa konteks, perencanaan jangka panjang, dan tracking pekerjaan dalam vibe coding."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

**Beads** adalah sistem memori untuk coding agents yang dibuat oleh **Steve Yegge** (mantan Google, Amazon, dan Sourcegraph). Setelah 40 hari non-stop vibe coding dan menghasilkan 350 ribu baris kode yang akhirnya harus dibuang karena masalah arsitektur, Steve membuat Beads sebagai solusi untuk masalah utama dalam coding dengan AI: **agent yang lupa konteks** dan **pekerjaan yang hilang**.

## Masalah yang Diatasi Beads

### 1. Agent Sering Lupa (Masalah Memento)

Coding agents seperti Claude, GPT-4, dan Copilot **tidak punya memori antar sesi**. Setiap sesi hanya berlangsung sekitar 10 menit, lalu agent "restart" dengan memori kosong.

**Yang terjadi:**
- Agent mulai project dengan 6 tahap
- Setelah 2 tahap + beberapa kali compaction, agent lupa konteks
- Agent buat rencana baru: "Wah, project ini besar, saya akan buat 5 tahap"
- Agent kerjakan tahap 1 (dari 5) dari tahap 3 (dari 6) - tanpa sadar bersarang
- Agent bilang: "Project SELESAI! 🎉" padahal baru 30% jadi

Steve menyebut ini **"Descent Into Madness"** - agent berjalan dengan pintar tapi buta, lambat laun kehilangan arah.

### 2. Pekerjaan Hilang / Tidak Diakui

Agents sering menemukan masalah saat coding, tapi karena terbatas ruang konteks, mereka:
- Mengabaikan bug dengan alasan "bukan kerjaan saya"
- Tidak mencatat pekerjaan yang ditemukan
- Menulis TODO di markdown yang cepat usang

Steve menemukan **605 file rencana markdown** yang sebagian dikerjakan, sebagian usang, 100% tidak berguna.

### 3. Kekacauan Rencana Markdown

Daftar TODO markdown tradisional:
- Memori hanya-baca-tulis untuk agents
- Tidak bisa mencari pekerjaan yang siap dikerjakan
- Tidak ada pelacakan ketergantungan (dependency)
- Tidak ada jejak audit

## Apa itu Beads?

Beads adalah **issue tracker berbasis grafis dan git** yang dirancang khusus untuk AI agents.

### Konsep Utama

#### 1. Git sebagai Database

Issues disimpan sebagai **JSONL** di folder `.beads/`, di-version-kan seperti kode:

```
.beads/
├── issues/
│   ├── bd-a1b2.jsonl    # Issue bd-a1b2
│   ├── bd-a1b2.1.jsonl  # Sub-task
│   └── bd-c3d4.jsonl
└── events/
    └── 2026-01-29/
        └── events.jsonl   # Jejak audit
```

**Keuntungan:**
- ✅ Di-version-kan dengan git
- ✅ Bisa branching dan merging
- ✅ Koordinasi multi-agent
- ✅ Tidak perlu setup database

#### 2. Struktur Grafis (Rantai Beads)

Issues saling terhubung seperti manik-manik dalam rantai:

```
[Epic bd-a3f8]
    ├── [Task bd-a3f8.1] ← blocks → [Task bd-a3f8.2]
    │       └── [Sub-task bd-a3f8.1.1]
    └── [Task bd-a3f8.3]
            └── discovered-from → [Bug bd-x9y0]
```

**Jenis Ketergantungan:**
- `blocks`: Issue A harus selesai sebelum B
- `blocked-by`: Issue B diblokir oleh A
- `parent-child`: Epic → Task → Sub-task
- `discovered-from`: Pekerjaan ditemukan saat implementasi
- `related`: Terkait tapi tidak memblokir

#### 3. Antarmuka yang Dioptimalkan untuk Agent

**Output JSON untuk Parsing Mesin:**
```bash
$ bd ready --json
[
  {
    "id": "bd-a1b2",
    "title": "Implement user authentication",
    "priority": 0,
    "status": "open",
    "blockers": [],
    "created": "2026-01-29T10:00:00Z"
  }
]
```

**Deteksi Otomatis Pekerjaan Siap:**
```bash
$ bd ready
bd-a1b2  P0  Implement user authentication
bd-c3d4  P1  Setup database schema
```
Hanya menampilkan issues dengan **tidak ada pemblokir yang terbuka**.

## Instalasi dan Setup

### Instalasi Cepat
```bash
# Install bd CLI
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Atau via npm
npm install -g @beads/bd

# Atau via Homebrew
brew install beads

# Atau via Go
go install github.com/steveyegge/beads/cmd/bd@latest
```

### Inisialisasi Project
```bash
cd your-project
bd init

# Mode stealth (hanya lokal, tidak commit ke repo)
bd init --stealth

# Mode contributor (untuk repo hasil fork)
bd init --contributor
```

### Setup Instruksi untuk Agent

Tambahkan ke `AGENTS.md` atau `CLAUDE.md`:
```markdown
## Manajemen Tugas dengan Beads

Gunakan 'bd' (beads) untuk semua pelacakan tugas:
- Cek pekerjaan siap: bd ready
- Buat tugas: bd create "Judul" -p 0
- Hubungkan ketergantungan: bd dep add <child> <parent>
- Lihat detail: bd show <id>

Selalu catat pekerjaan yang ditemukan sebagai issue baru.
Jangan pernah biarkan bug tidak tercatat.
```

## Perintah-perintah Penting

### Alur Kerja Dasar
```bash
# Daftar tugas siap (tidak ada pemblokir)
bd ready

# Buat tugas baru
bd create "Implement login API" -p 0

# Buat dengan deskripsi
bd create "Fix auth bug" -p 1 --desc "Token validation fails on expiry"

# Lihat detail tugas
bd show bd-a1b2

# Update status
bd update bd-a1b2 --status in_progress

# Tandai selesai
bd update bd-a1b2 --status done
```

### Manajemen Ketergantungan
```bash
# Tambah relasi parent-child
bd dep add bd-a1b2.1 bd-a1b2

# Tambah ketergantungan yang memblokir
bd dep add bd-c3d4 --blocks bd-a1b2

# Tambah pekerjaan yang ditemukan
bd create "Fix database connection" --discovered-from bd-a1b2

# Lihat grafik ketergantungan
bd graph bd-a1b2
```

### Hierarki & Epics
```bash
# Buat epic
bd create "User Authentication System" -p 0
# Returns: bd-a3f8

# Buat sub-task
bd create "Implement JWT" -p 0 --parent bd-a3f8
# Returns: bd-a3f8.1

# Buat sub-task bersarang
bd create "Token validation" -p 0 --parent bd-a3f8.1
# Returns: bd-a3f8.1.1
```

### Pencarian dan Filter
```bash
# Cari berdasarkan judul
bd search "auth"

# Filter berdasarkan status
bd list --status open

# Filter berdasarkan prioritas
bd list --priority 0,1

# Filter berdasarkan penerima tugas
bd list --assignee claude

# Filter gabungan
bd list --status open --priority 0 --json
```

## Fitur-fitur Lanjutan

### 1. Koordinasi Multi-Agent

Beads mendukung beberapa agent yang bekerja bersamaan:

```bash
# Agent 1 mengklaim tugas
bd assign bd-a1b2 --assignee agent-1

# Agent 2 melihat sudah diklaim
bd ready
# (tidak menampilkan bd-a1b2 karena sudah in_progress)

# Agent 2 kerjakan tugas siap lainnya
bd assign bd-c3d4 --assignee agent-2
```

**Konflik Merge:** AI melakukan penyelesaian konflik secara cerdas untuk edit bersamaan.

### 2. Federasi (Multi-Repo)

Untuk organisasi besar:

```bash
# Setup federasi
bd federation init

# Hubungkan repo eksternal
bd federation add github.com/org/repo

# Ketergantungan antar-repo
bd dep add bd-a1b2 --external github.com/org/repo#bd-x9y0
```

### 3. Compaction (Memory Decay)

Tugas lama yang sudah ditutup di-ringkas untuk menghemat ruang konteks:

```bash
# Lihat history yang sudah di-ringkas
bd show bd-a1b2 --history

# Events:
# 2026-01-29 10:00: Created
# 2026-01-29 10:15: Assigned to claude
# 2026-01-29 11:30: Status → in_progress
# 2026-01-29 14:00: Status → done
# [COMPACTED: 47 events summarized]
```

### 4. Hooks

Aksi otomatis saat event terjadi:

```bash
# .beads-hooks/on-create
#!/bin/bash
echo "New task created: $1" | slack-notify

# .beads-hooks/on-complete
#!/bin/bash
bd generate-report --since yesterday
```

## Integrasi dengan Coding Agents

### Claude Code
```bash
# Tambahkan ke ~/.claude/CLAUDE.md
When working on tasks:
1. Run 'bd ready' to see available work
2. Use 'bd show <id>' for context
3. Create issues for discovered work
4. Update status regularly
5. File blocking issues immediately
```

### GitHub Copilot
```bash
# Copilot akan membaca AGENTS.md
# dan otomatis menggunakan perintah bd

# Contoh interaksi:
# User: "Fix the auth bug"
# Copilot: "I'll check beads for auth-related issues..."
# Copilot: bd search "auth"
# Copilot: "Found bd-x9y0: Token validation fails. Working on it."
```

### Sourcegraph Amp
```bash
# Integrasi Amp built-in
amp beads sync
amp beads ready
```

## Praktik Terbaik

### 1. Tugas yang Terperinci
Pecah tugas menjadi item-item kecil dan bisa dijalankan:

```bash
# ❌ Buruk
bd create "Build entire app" -p 0

# ✅ Bagus
bd create "Setup project structure" -p 0
bd create "Implement auth middleware" -p 0
bd create "Create login endpoint" -p 0
```

### 2. Selalu Catat Pekerjaan yang Ditemukan
```bash
# Saat coding, agent menemukan bug
# Jangan diabaikan!

bd create "Fix database connection leak" \
  --discovered-from bd-a1b2 \
  -p 0
```

### 3. Perencanaan Berbasis Ketergantungan
```bash
# Buat grafik ketergantungan sebelum mulai
bd create "Database Schema" -p 0  # bd-a1
bd create "API Endpoints" -p 0     # bd-a2
bd create "Frontend Components" -p 0  # bd-a3

# Hubungkan ketergantungan
bd dep add bd-a2 --blocks bd-a3
bd dep add bd-a1 --blocks bd-a2

# Sekarang bd-a3 tidak akan muncul di 'bd ready' sampai a1 dan a2 selesai
```

### 4. Alur Kerja Berbasis Sesi
```bash
# Mulai sesi
bd ready
bd assign bd-a1b2 --assignee claude-session-1

# Kerjakan tugas
# ... coding ...

# Akhiri sesi
bd update bd-a1b2 --status done

# Sesi berikutnya
bd ready  # Menampilkan tugas siap berikutnya
```

## Perbandingan dengan Tools Lain

| Fitur | Beads | GitHub Issues | Jira | Markdown TODO |
|---------|-------|---------------|------|---------------|
| Git-backed | ✅ | ❌ | ❌ | ✅ |
| Dioptimalkan untuk agent | ✅ | ❌ | ❌ | ❌ |
| Grafik ketergantungan | ✅ | ⚠️ | ✅ | ❌ |
| JSON API | ✅ | ⚠️ | ⚠️ | ❌ |
| Multi-agent | ✅ | ❌ | ❌ | ❌ |
| Zero config | ✅ | ❌ | ❌ | ✅ |
| Cari tugas siap | ✅ | ❌ | ❌ | ❌ |

## Dampak di Dunia Nyata

Steve Yegge melaporkan setelah menggunakan Beads:
- **Pengurangan 95%** dalam pekerjaan yang hilang
- **Tugas jangka panjang** bisa ditangani dengan baik
- **Koordinasi multi-agent** menjadi lancar
- **Tidak ada lagi kekacauan rencana markdown**

## Tools dan Integrasi

### Official
- **bd CLI**: Tool utama (Go)
- **npm package**: `@beads/bd`
- **Python package**: `beads-mcp`
- **VS Code Extension**: Beads Explorer

### Tools Komunitas
- **Terminal UI**: `beads-tui`
- **Web UI**: `beads-web`
- **Mobile App**: `beads-mobile`
- **Slack Integration**: `beads-slack`

## Setup untuk Penggunaan Maksimal

### 1. Integrasi IDE
```bash
# VS Code
ext install beads.beads-explorer

# Konfigurasi
{
  "beads.autoSync": true,
  "beads.showDecorations": true,
  "beads.defaultView": "graph"
}
```

### 2. Git Hooks
```bash
# .git/hooks/pre-commit
#!/bin/bash
bd validate --strict
```

### 3. Integrasi CI/CD
```yaml
# .github/workflows/beads.yml
name: Beads Validation
on: [push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate beads
        run: |
          bd validate
          bd check-orphaned
```

### 4. Monitoring
```bash
# Dashboard untuk melacak progress
bd dashboard --port 8080

# Metrics
bd metrics --format prometheus
```

## Troubleshooting

### Masalah: bd ready tidak menampilkan apa-apa
```bash
# Cek apakah semua tugas diblokir
bd list --status open

# Cek pemblokir
bd show bd-a1b2 --blockers

# Buka blokir jika perlu
bd update bd-x9y0 --status done
```

### Masalah: Konflik merge
```bash
# Auto-resolve dengan AI
bd merge --strategy ai

# Atau manual
bd conflicts list
bd conflicts resolve bd-a1b2
```

### Masalah: Repo besar lambat
```bash
# Aktifkan caching
bd config set cache.enabled true

# Compaction
bd compact --older-than 30d
```

## Kesimpulan

Beads merevolusi cara kita melakukan vibe coding dengan menyediakan:

✅ **Memori Persisten** - Agents tidak lagi lupa antar sesi  
✅ **Pelacakan Ketergantungan** - Grafik tugas kompleks dengan mudah  
✅ **Penemuan Pekerjaan** - Tidak ada lagi pekerjaan yang hilang  
✅ **Koordinasi Multi-Agent** - Kolaborasi tanpa hambatan  
✅ **Integrasi Git** - Di-version-kan, branched, merged seperti kode  

**Status 2026:** Siap produksi, digunakan oleh ribuan developer  
**Direkomendasikan untuk:** Semua alur kerja vibe coding, terutama tugas jangka panjang  
**Tidak untuk:** Script sekali pakai sederhana (terlalu berlebihan)

Dengan Beads, agents menjadi **10x lebih produktif** dan **100x lebih sedikit membuat frustrasi**. Steve Yegge menyebutnya **"langkah terbesar dalam coding dengan agent sejak MCP+Playwright."**

Selamat vibe coding dengan Beads! 🎯✨
