---
title: "Implementasi Praktis Beads: Workflow Vibe Coding yang Efektif"
date: 2026-01-30T00:00:00.000Z
description: "Panduan lengkap mengimplementasikan Beads dalam workflow vibe coding sehari-hari. Pelajari session management, dependency mapping, Rule of Five, dan best practices untuk produktivitas maksimal."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
series: beads-vibe-coding
series_order: 2
---

Di artikel sebelumnya, kita sudah memahami **mengapa** Beads penting untuk vibe coding. Sekarang kita akan belajar **bagaimana** mengimplementasikannya dalam praktik sehari-hari.

Steve Yegge, pencipta Beads, pernah menghabiskan 40 hari straight vibe coding dan menghasilkan 350 ribu baris kode yang akhirnya harus dibuang. Masalah utamanya bukan pada agent-nya, tapi pada **cara kerja** yang tidak terstruktur. Artikel ini adalah panduan implementasi praktis agar kamu tidak mengalami hal yang sama.

## Setup Awal: Fondasi yang Kuat

### Struktur Project dengan Beads

Setelah menjalankan `bd init`, project kamu akan memiliki struktur seperti ini:

```
my-project/
├── .beads/                 # Database issues (auto-generated)
│   └── issues.jsonl        # Semua issues dalam format JSONL
├── src/                    # Source code
├── AGENTS.md              # Instruksi untuk semua agents
├── CLAUDE.md              # Konteks khusus untuk Claude
└── .cursorrules           # Aturan khusus untuk Cursor
```

### Konfigurasi AGENTS.md yang Efektif

File `AGENTS.md` adalah dokumentasi yang dibaca agent setiap kali mulai bekerja. Ini adalah tempat kamu memberikan instruksi tentang workflow Beads. Agent akan membaca file ini di awal session.

**Contoh AGENTS.md yang baik:**

```markdown
# Project Guidelines

## Beads Workflow

### Memulai Session
1. Jalankan `bd ready` untuk melihat task yang tersedia
2. Pilih task dengan priority tertinggi yang tidak blocked
3. Assign diri Anda: `bd assign <id> --assignee claude`

### Selama Coding
- Setiap menemukan bug atau improvement, buat issue baru
- Gunakan: `bd create "Deskripsi" --discovered-from <current-task>`
- Update status: `bd update <id> --status in_progress`

### Mengakhiri Session
1. Update status: `bd update <id> --status done` atau `blocked`
2. Jika blocked, buat blocker issue dan link dependency
3. Commit: `git add .beads/ && git commit -m "beads: update"`

### Aturan Penting
- JANGAN kerjakan task tanpa assign diri sendiri dulu
- SELALU cek `bd ready` sebelum mulai kerja
- JANGAN buat markdown plans, gunakan bd commands
- Split task besar menjadi task kecil (< 2 jam kerja)
```

## Strategi Session Management

### Problem: Agent yang Pelupa

Seperti yang dijelaskan Steve Yegge, agents mengalami apa yang disebut "Descent Into Madness":

1. Mulai dengan rencana 6 fase
2. Lupa setelah compaction
3. Buat rencana baru 5 fase (karena tidak ingat rencana lama)
4. Kerjakan 2 fase dari rencana baru
5. Menyatakan "SELESAI!" padahal baru 30% yang jadi

### Solusi: One Session, One Task

Pattern yang paling efektif adalah **satu session untuk satu task**:

```bash
# 1. Mulai session - lihat apa yang ready
$ bd ready
bd-a1b2  P0  Implement JWT middleware
bd-c3d4  P1  Setup database connection

# 2. Claim satu task saja
$ bd assign bd-a1b2 --assignee claude

# 3. Kerjakan sampai selesai atau blocked
# ... coding ...

# 4. Update status
$ bd update bd-a1b2 --status done

# 5. Session selesai - agent bisa di-restart
# Task selanjutnya sudah tercatat di Beads
```

**Keuntungan pendekatan ini:**

- Agent selalu mulai dengan context window yang fresh dan penuh
- Tidak ada "Descent Into Madness" karena scope kecil
- Biaya jauh lebih murah—semakin kecil task, semakin hemat (secara kuadratik)
- Hasil lebih predictable

### Anti-Pattern yang Harus Dihindari

```bash
# ❌ JANGAN lakukan ini:
$ bd create "Build entire application" -p 0
# Agent akan bekerja berjam-jam, compaction berkali-kali,
# lupa konteks, dan akhirnya menyatakan selesai terlalu cepat

# ✅ LAKUKAN ini:
$ bd create "Setup project structure" -p 0
$ bd create "Implement auth middleware" -p 0
$ bd create "Create login endpoint" -p 0
$ bd create "Create register endpoint" -p 0
# Task kecil = session pendek = hasil lebih baik
```

## The Rule of Five: Review Sebelum Selesai

Jeffrey Emanuel, seorang engineer dan AI researcher, menemukan pattern penting: untuk mendapatkan hasil terbaik dari AI agents, minta mereka **me-review pekerjaan sendiri 4-5 kali** sebelum dianggap selesai.

### Cara Kerja Rule of Five

1. **Pass 1**: Agent mengerjakan task
2. **Pass 2**: Review pertama—biasanya menemukan masalah yang obvious
3. **Pass 3**: Review kedua—menemukan masalah yang terlewat di review pertama
4. **Pass 4**: Review ketiga—mulai pertanyaan yang lebih fundamental: "Apakah ini pendekatan yang benar?"
5. **Pass 5**: Review keempat—polishing dan refinement

Setelah 5 kali review, agent biasanya akan berkata: *"Saya rasa ini sudah sebaik yang bisa saya buat."*

### Kapan Menerapkan Rule of Five

| Tahap | Jumlah Review |
|-------|---------------|
| Design/Planning | 5 passes |
| Beads implementation plan | 5 passes |
| Code implementation | 5 passes (1 coding + 4 review) |
| Tests | 5 passes |
| Documentation | 3 passes (lebih simpel) |

### Contoh Implementasi dengan Beads

```bash
# Buat task dengan expectation untuk review
$ bd create "Design: Auth system architecture" -p 0 --label phase:design
$ bd create "Review: Auth design iteration 1" -p 0 --label phase:review
$ bd create "Review: Auth design iteration 2" -p 0 --label phase:review
```

Atau lebih simpel, tulis di AGENTS.md:

```markdown
### Review Policy
Sebelum menandai task sebagai done, lakukan:
1. Self-review untuk bugs dan edge cases
2. Self-review untuk code quality
3. Self-review untuk architecture decisions
4. Final polish

Minimum 4 review passes untuk setiap task kompleks.
```

## Dependency Mapping yang Efektif

### Pattern: Dependency-First Planning

Steve Yegge menekankan pentingnya **memetakan dependencies sebelum mulai coding**. Jangan langsung terjun ke implementasi.

```bash
# Step 1: Buat epic (task besar) dan child tasks
$ bd create "User Authentication System" -p 0
# Returns: bd-auth

$ bd create "Database schema" -p 0 --parent bd-auth
# Returns: bd-auth.1

$ bd create "JWT implementation" -p 0 --parent bd-auth
# Returns: bd-auth.2

$ bd create "Login API endpoint" -p 0 --parent bd-auth
# Returns: bd-auth.3

# Step 2: Definisikan dependencies
# Database harus selesai sebelum JWT
$ bd dep add bd-auth.2 --blocks bd-auth.1

# JWT harus selesai sebelum Login API
$ bd dep add bd-auth.3 --blocks bd-auth.2

# Step 3: Visualisasi dependency graph
$ bd graph bd-auth
```

**Hasil:**
```
[Epic bd-auth: User Authentication System]
    ├── [bd-auth.1] Database schema ✅ Ready
    │       └── blocks → [bd-auth.2]
    ├── [bd-auth.2] JWT implementation ⏳ Blocked
    │       └── blocks → [bd-auth.3]
    └── [bd-auth.3] Login API endpoint ⏳ Blocked
```

### Real-World Scenario

```bash
# Agent mulai session baru
$ bd ready
bd-auth.1  P0  Database schema  # ✅ Ready (no blockers)
# bd-auth.2 dan bd-auth.3 tidak muncul karena blocked

# Agent selesaikan bd-auth.1
$ bd update bd-auth.1 --status done

# Session berikutnya
$ bd ready
bd-auth.2  P0  JWT implementation  # ✅ Now ready!
# bd-auth.3 masih blocked

# Agent tidak akan pernah "tersesat" ke task yang belum siap
```

## Work Discovery: Jangan Sampai Ada yang Terlewat

### Problem: Agent Mengabaikan Temuan

Saat coding, agent sering menemukan bugs, edge cases, atau ide improvement. Tanpa sistem yang proper, mereka cenderung:

- Mengabaikan dengan alasan "ini bukan scope saya sekarang"
- Menulis TODO comment yang tidak pernah di-follow up
- Lupa sama sekali karena fokus ke task utama

Steve Yegge menyebut ini **"Work Disavowal"**—agent menolak mengakui pekerjaan yang ditemukan karena sudah kehabisan konteks.

### Solusi: Selalu Catat Temuan

```bash
# Scenario: Agent sedang implementasi auth
$ bd show bd-auth.2
ID: bd-auth.2
Title: JWT implementation
Status: in_progress

# Agent menemukan bug di database connection
# ❌ Jangan diabaikan atau tulis di TODO.md

# ✅ File sebagai issue baru dengan link ke task asal
$ bd create "Fix: Database connection leak" \
  --discovered-from bd-auth.2 \
  -p 0 \
  --desc "Connection tidak di-close setelah auth failure"
# Returns: bd-fix.1

# Jika bug ini blocking, link sebagai dependency
$ bd dep add bd-auth.2 --blocks bd-fix.1

# Sekarang bd-auth.2 blocked sampai bd-fix.1 selesai
```

### Cek Temuan Sebelum Close Task

```bash
# Sebelum menandai task sebagai done, cek discovered work
$ bd list --discovered-from bd-auth.2
bd-fix.1  P0  Fix: Database connection leak
bd-imp.1  P1  Improvement: Add token refresh

# Agent harus handle semua ini sebelum close parent task
```

## Code Health: 30-40% dari Waktu Kamu

Steve Yegge menekankan bahwa **30-40% waktu dan budget** harus dialokasikan untuk code health, bukan fitur baru. Ini bukan opsional—ini essential.

### Apa itu Code Health?

- **Code review** oleh AI (minta agent review code yang dia buat)
- **Refactoring** file yang terlalu besar
- **Menghapus** dead code dan sistem yang redundan
- **Konsolidasi** jika ada multiple systems yang melakukan hal sama
- **Meningkatkan** test coverage
- **Membersihkan** dokumentasi yang outdated

### Kenapa Penting untuk Vibe Coding?

Kalau kamu tidak invest di code health:

1. Codebase akan membengkak dengan kode yang tidak perlu
2. Agent akan semakin lambat karena harus baca lebih banyak kode
3. Bug akan semakin sulit dilacak
4. Technical debt menumpuk tanpa terlihat

### Implementasi dengan Beads

```bash
# Buat task khusus untuk code health
$ bd create "Code review: Auth module" -p 1 --label type:health
$ bd create "Refactor: Split UserController (800 lines)" -p 2 --label type:health
$ bd create "Cleanup: Remove deprecated API endpoints" -p 2 --label type:health
$ bd create "Test: Increase coverage for payment module" -p 2 --label type:health

# Query semua code health tasks
$ bd list --label type:health
```

### Schedule Regular Code Health Sessions

```bash
# Setiap minggu, sisihkan 1-2 hari untuk code health
# Monday-Wednesday: Feature development
# Thursday-Friday: Code health, review, refactoring

# Atau setelah setiap milestone
$ bd create "Post-milestone: Code health review" -p 1 --label type:health
```

## Multi-Agent Coordination

### Pattern: Distributed Work

Kalau kamu menjalankan beberapa agents bersamaan, Beads menjadi **single source of truth** untuk koordinasi:

```bash
# Agent 1 (Claude Desktop) - Backend work
$ bd ready
bd-api.1  P0  Implement user endpoint
$ bd assign bd-api.1 --assignee claude-desktop

# Agent 2 (Cursor) - Frontend work
$ bd ready
# bd-api.1 tidak muncul karena sudah in_progress
bd-ui.1   P0  Create user dashboard
$ bd assign bd-ui.1 --assignee cursor

# Agent 3 (Copilot) - Documentation
$ bd ready
# Tidak ada P0 yang ready, cek P1
bd-doc.1  P1  Write API documentation
$ bd assign bd-doc.1 --assignee copilot
```

### Handling Conflicts

```bash
# Jika ada conflict di Beads database (rare tapi possible)
$ bd merge --strategy ai
# Beads akan gunakan AI untuk resolve conflicts secara intelligent

# Atau resolve manual
$ bd conflicts list
$ bd conflicts resolve bd-api.1
```

## Maintenance Commands yang Perlu Diketahui

### bd doctor - Diagnosa dan Perbaiki

```bash
# Jalankan secara regular (minimal weekly)
$ bd doctor

# Auto-fix issues yang ditemukan
$ bd doctor --fix
```

`bd doctor` akan:
- Cek integritas database
- Fix broken references
- Update metadata
- Handle migrations

### bd cleanup - Hapus Issues Lama

```bash
# Hapus issues yang sudah selesai lebih dari N hari
$ bd cleanup --older-than 7d

# Steve Yegge menggunakan 2 hari karena velocity-nya tinggi
$ bd cleanup --older-than 2d

# Sync dengan git setelah cleanup
$ bd sync
```

**Tips:** Jangan takut cleanup agresif. Semua data tetap ada di git history dan bisa direconstruct jika perlu.

### bd sync - Sinkronisasi dengan Git

```bash
# Sync database dan push ke remote
$ bd sync

# Force sync jika ada conflict
$ bd sync --force
```

## Troubleshooting Common Issues

### `bd ready` Tidak Menampilkan Apa-apa

```bash
# Cek apakah semua task blocked
$ bd list --status open

# Lihat apa yang memblock
$ bd show bd-api.1 --blockers

# Cek circular dependency
$ bd check-circular-deps

# Unblock dengan menyelesaikan blocker
$ bd update bd-blocker --status done
```

### Agent Masih Membuat Markdown Plans

```bash
# Hapus semua markdown plans lama
$ rm -rf plans/ docs/plans/

# Update AGENTS.md dengan instruksi yang lebih tegas
echo "NEVER create markdown plans. ALWAYS use bd commands." >> AGENTS.md

# Cari file plan yang tersisa
$ find . -name "*plan*.md" -type f
```

### Database Beads Terlalu Besar

```bash
# Enable caching untuk performa lebih baik
$ bd config set cache.enabled true

# Compact data lama
$ bd compact --older-than 30d

# Cleanup completed issues
$ bd cleanup --older-than 7d
```

## Migration dari Workflow Lama

### Dari Markdown TODO Files

```bash
# 1. Temukan semua TODO files
$ find . -name "TODO*.md" -o -name "*plan*.md"

# 2. Import ke Beads (jika tool tersedia)
$ bd import --from-markdown plans/

# 3. Hapus files lama
$ rm -rf plans/

# 4. Update AGENTS.md untuk prevent markdown plans
```

### Dari GitHub Issues

```bash
# Export GitHub issues
$ gh issue list --json number,title,body,labels --limit 1000 > issues.json

# Import ke Beads
$ bd import --from-github issues.json

# Optional: Setup two-way sync
$ bd sync --github-repo owner/repo
```

## Best Practices Summary

### 1. Fine-Grained Tasks

> *"If you split your bd issues up into fine-grained tasks, then each session will be quadratically cheaper."* — Steve Yegge

**Artinya:** Jika kamu memecah issues menjadi task-task kecil, setiap session akan **jauh lebih murah secara kuadratik**.

- Task harus bisa selesai dalam 1-2 jam
- Jika butuh lebih dari 3 compaction, task terlalu besar
- Lebih baik 10 task kecil daripada 1 task besar

### 2. Priority System yang Konsisten

```bash
# P0: Critical - blocking other work, fix immediately
# P1: High - important feature, do soon  
# P2: Medium - nice to have
# P3: Low - backlog

$ bd create "Fix production bug" -p 0
$ bd create "New feature" -p 1
$ bd create "Refactor" -p 2
$ bd create "Update docs" -p 3
```

### 3. Session Hygiene

Di akhir setiap session:

1. ✅ Update status task (`done` atau `blocked`)
2. ✅ File semua discovered work
3. ✅ Commit `.beads/` ke git
4. ✅ Push ke remote (jika team project)

### 4. Regular Cleanup

```bash
# Weekly maintenance
$ bd doctor --fix
$ bd cleanup --older-than 7d
$ bd compact --older-than 30d
```

## Kesimpulan

Implementasi Beads bukan hanya tentang menggunakan tool baru, tapi tentang **mengubah cara bekerja dengan AI coding agents**.

**Key Takeaways:**

1. **One Session, One Task** - Jangan beri task besar yang butuh banyak compaction
2. **Rule of Five** - Review pekerjaan 4-5 kali sebelum dianggap selesai
3. **Dependency-First** - Petakan dependencies sebelum mulai coding
4. **Always File Discovered Work** - Jangan abaikan bugs atau ideas yang ditemukan
5. **30-40% Code Health** - Investasi wajib untuk sustainability
6. **Regular Maintenance** - `bd doctor` dan `bd cleanup` secara rutin

Dengan workflow yang tepat, Beads akan mengubah vibe coding dari "Descent Into Madness" menjadi proses yang **terstruktur, predictable, dan highly productive**.

---

## Seri Artikel Beads untuk Vibe Coding

Ini adalah **Part 2** dari seri 3 artikel tentang Beads:

1. [Mengapa Kamu Perlu Beads untuk Vibe Coding?](/blog/mengapa-kamu-perlu-beads-untuk-vibe-coding)
2. **Implementasi Praktis Beads: Workflow Vibe Coding yang Efektif** (artikel ini)
3. [Advanced Beads Patterns: Swarm Architecture dan Complex Project Management](/blog/advanced-beads-patterns-swarm-architecture-complex-project)

[← Part 1 - Mengapa Kamu Perlu Beads](/blog/mengapa-kamu-perlu-beads-untuk-vibe-coding) | [Part 3 - Advanced Beads Patterns →](/blog/advanced-beads-patterns-swarm-architecture-complex-project)

---

## Referensi

- [Beads Best Practices](https://steve-yegge.medium.com/beads-best-practices-2db636b9760c) - Steve Yegge
- [Six New Tips for Better Coding With Agents](https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9) - Steve Yegge
- [The Beads Revolution](https://steve-yegge.medium.com/the-beads-revolution-how-i-built-the-todo-system-that-ai-agents-actually-want-to-use-228a5f9be2a9) - Steve Yegge
