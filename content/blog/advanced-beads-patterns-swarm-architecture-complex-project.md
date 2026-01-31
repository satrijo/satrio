---
title: "Advanced Beads Patterns: Swarm Architecture dan Complex Project Management"
date: 2026-01-31T00:00:00.000Z
description: "Pelajari advanced patterns untuk Beads: swarm architecture, Merge Wall problem, Agent UX, Zero Framework Cognition, dan strategi untuk large-scale vibe coding projects."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

Setelah menguasai dasar-dasar Beads dan implementasi workflow praktis, saatnya naik level. Artikel ini membahas **advanced patterns** yang digunakan Steve Yegge dan developer berpengalaman lainnya untuk menangani project kompleks dengan multiple agents, complex dependencies, dan long-term planning.

## Swarm Architecture: Multiple Agents Bekerja Bersamaan

**Swarm architecture** adalah arsitektur di mana multiple AI agents bekerja bersamaan seperti kawanan lebah—masing-masing mengerjakan bagian yang berbeda, tapi terkoordinasi menuju satu tujuan.

Steve Yegge pernah menjalankan "selusin concurrent agents" secara bersamaan. Meskipun dia akhirnya mengurangi ke 1-3 agents untuk sustainability, pengalaman tersebut memberikan insight berharga.

### Pattern 1: The Orchestrator

Dalam pattern ini, ada satu "orchestrator" (bisa manusia atau agent senior) yang membagi pekerjaan:

```bash
# Orchestrator membuat high-level structure
$ bd create "Project: E-Commerce Platform" -p 0
# Returns: bd-ecom

# Decompose menjadi major components
$ bd create "Backend API" -p 0 --parent bd-ecom
$ bd create "Frontend Web" -p 0 --parent bd-ecom
$ bd create "Mobile App" -p 0 --parent bd-ecom
$ bd create "Database Design" -p 0 --parent bd-ecom

# Assign setiap component ke lead agent berbeda
$ bd assign bd-ecom.1 --assignee agent-backend
$ bd assign bd-ecom.2 --assignee agent-frontend
$ bd assign bd-ecom.3 --assignee agent-mobile
```

**Cara kerja:**

1. Orchestrator membuat high-level plan dan struktur
2. Component leads mengambil ownership masing-masing area
3. Component leads bisa membuat sub-tasks dan assign ke worker agents
4. Semua komunikasi melalui Beads—tidak ada koordinasi langsung antar agents

### Pattern 2: The Pipeline

Workflow sequential di mana output satu stage menjadi input stage berikutnya:

```bash
# Design → Implement → Review → Test → Deploy

# Stage 1: Design
$ bd create "Design: Auth System" -p 0 --label stage:design

# Stage 2: Implementation (blocked by design)
$ bd create "Implement: Auth API" -p 0 --label stage:implement
$ bd dep add bd-impl --blocks bd-design

# Stage 3: Review (blocked by implementation)
$ bd create "Review: Auth code" -p 0 --label stage:review
$ bd dep add bd-review --blocks bd-impl

# Stage 4: Testing
$ bd create "Test: Auth integration" -p 0 --label stage:test
$ bd dep add bd-test --blocks bd-review

# Query by stage
$ bd list --label stage:design --status open
$ bd list --label stage:implement --status ready
```

### Pattern 3: The Specialist

Assign agents berdasarkan keahlian mereka:

```bash
# Database specialist
$ bd create "Optimize: Query performance" -p 0 --label specialist:database
$ bd assign bd-opt --assignee agent-db-specialist

# Security specialist
$ bd create "Audit: Authentication flow" -p 0 --label specialist:security
$ bd assign bd-audit --assignee agent-security

# UI specialist
$ bd create "Redesign: Login page" -p 0 --label specialist:ui
$ bd assign bd-redesign --assignee agent-ui-specialist

# Query tasks untuk specialist tertentu
$ bd list --label specialist:database --status ready
```

## The Merge Wall: Tantangan Utama Swarming

Ketika menjalankan multiple agents, ada satu masalah besar yang disebut **Merge Wall**—tembok yang menghalangi saat mencoba menggabungkan hasil kerja semua agents.

### Apa itu Merge Wall?

Bayangkan 3 agents bekerja bersamaan dari commit yang sama:

- **Agent A**: Mengubah logging system
- **Agent B**: Mengubah database API  
- **Agent C**: Mengubah client-server protocol

Semua mulai dari baseline yang sama. Tapi setelah selesai:

1. Agent A merge duluan ✅
2. Agent B merge, tapi harus rebase dengan perubahan A (sedikit effort)
3. Agent C selesai, tapi codebase sudah **sangat berbeda** karena perubahan A dan B

Agent C mungkin harus **redesign dan reimplementasi ulang** karena sistem sudah berubah fundamental.

### Solusi untuk Merge Wall

**1. Serialize pekerjaan yang overlap:**
```bash
# Jika ada dependency antara tasks, jangan parallel
$ bd dep add bd-logging --blocks bd-database
$ bd dep add bd-database --blocks bd-protocol

# Sekarang hanya satu yang ready pada satu waktu
$ bd ready
bd-logging  P0  Update logging system  # Hanya ini yang ready
```

**2. Gunakan git worktrees:**
```bash
# Setiap agent bekerja di folder terpisah
$ git worktree add ../agent-a-work feature-a
$ git worktree add ../agent-b-work feature-b

# Merge ke main secara sequential
```

**3. Pause saat refactoring besar:**

Jika ada pekerjaan yang mengubah struktur fundamental (rename packages, restructure folders, major API changes), **pause semua agents lain** sampai pekerjaan tersebut selesai dan di-merge.

**4. Use a merge queue:**

Serialize proses merge—satu agent merge, yang lain menunggu dan rebase setelahnya.

### Kapan Swarming Efektif vs Tidak

| Situasi | Swarming? |
|---------|-----------|
| Tasks independen (frontend vs backend) | ✅ Ya |
| Semua modify file yang sama | ❌ Tidak |
| Refactoring arsitektur | ❌ Tidak |
| Menulis tests untuk modules berbeda | ✅ Ya |
| Major version upgrade | ❌ Serialize |

## Agent UX: Membuat Tools yang AI-Friendly

Salah satu alasan Beads sukses adalah karena **Agent UX** yang baik—Beads dirancang agar AI mudah dan senang menggunakannya.

### Prinsip Agent UX

**1. Familiar patterns:**

Beads menggunakan pattern mirip GitHub Issues, yang sudah dipahami AI dari training data mereka. Makanya agents langsung "ngerti" cara pakai Beads.

**2. Forgiving input:**

```bash
# Kedua command ini bekerja
$ bd create "Task" --body "Description"
$ bd create "Task" --description "Description"

# AI sering tertukar antara --body dan --description
# Beads menerima keduanya
```

**3. Clear error messages:**

Error yang jelas membantu AI memperbaiki kesalahan mereka. Beads memberikan error messages yang descriptive, bukan cryptic codes.

**4. Queryable state:**

AI bisa bertanya "apa yang harus dikerjakan?" dan dapat jawaban yang jelas dan structured, bukan wall of text.

### Kenapa AI Menyukai Beads

Steve Yegge menyarankan: tanya langsung agent kamu apakah mereka mau pakai Beads. Mereka biasanya antusias karena:

- **Sesuai cara berpikir mereka** - AI agents suka tracking dan organizing
- **Mengurangi cognitive load** - Data terstruktur, tidak perlu parse markdown
- **Provenance tracking** - Mereka bisa melacak origin setiap task
- **Dependencies jelas** - Tidak perlu inferensi dari teks

## Zero Framework Cognition (ZFC)

Steve Yegge memperkenalkan konsep **ZFC (Zero Framework Cognition)**: jangan buat logika kompleks di code untuk memutuskan sesuatu—biarkan AI yang memutuskan.

### Apa itu ZFC?

**Contoh buruk (ZFC Violation):**
```javascript
// ❌ Jangan lakukan ini
function isTaskComplete(output) {
  // Heuristic matching - fragile!
  if (output.includes('done') || 
      output.includes('completed') ||
      output.includes('finished')) {
    return true
  }
  return false
}
```

Masalah dengan pendekatan ini:
- Bagaimana kalau output dalam bahasa Indonesia?
- Bagaimana kalau pakai kata "selesai" atau "kelar"?
- Bagaimana kalau ada edge case yang tidak terpikirkan?

**Contoh baik (ZFC Compliant):**
```javascript
// ✅ Biarkan AI yang memutuskan
async function isTaskComplete(output) {
  const decision = await askAI({
    prompt: `Analyze this output and determine if the task is complete: ${output}`,
    responseFormat: { isComplete: 'boolean', reason: 'string' }
  })
  return decision.isComplete
}
```

### Prinsip ZFC

**✅ Yang boleh di-code (orchestration):**
- Read/write files
- Parse JSON, serialize data
- Schema validation
- Rate limiting, timeout handling
- State management

**❌ Yang harus di-delegate ke AI:**
- Ranking atau scoring
- Keputusan tentang ordering atau dependencies
- Semantic analysis
- Menentukan "apa yang harus dilakukan selanjutnya"
- Quality judgment

### Kenapa ZFC Penting untuk Beads?

Beads sendiri adalah contoh ZFC-compliant system:
- Beads hanya menyimpan dan query data (orchestration)
- Keputusan tentang prioritas dan ordering? Agent yang tentukan
- Keputusan task mana yang ready? Computed dari dependencies, bukan heuristics

## Epic Decomposition Strategies

### Strategy 1: Vertical Slicing (Pemotongan Vertikal)

Memecah epic berdasarkan **user journey atau end-to-end features**. Setiap slice memberikan value yang bisa di-deliver secara independen.

```bash
# Epic: User Authentication

# Slice 1: Registration (full flow)
$ bd create "Reg: Form validation" --parent bd-auth
$ bd create "Reg: Email confirmation" --parent bd-auth
$ bd create "Reg: Welcome email" --parent bd-auth

# Slice 2: Login (full flow)
$ bd create "Login: Credential check" --parent bd-auth
$ bd create "Login: Session creation" --parent bd-auth
$ bd create "Login: Remember me" --parent bd-auth

# Slice 3: Password Recovery (full flow)
$ bd create "Recovery: Request form" --parent bd-auth
$ bd create "Recovery: Email token" --parent bd-auth
$ bd create "Recovery: Reset form" --parent bd-auth
```

**Keuntungan:** Setiap slice bisa di-release dan memberikan value secara independen.

### Strategy 2: Horizontal Slicing (Pemotongan Horizontal)

Memecah berdasarkan **architectural layers**:

```bash
# Epic: Payment System

# Layer 1: Data
$ bd create "Payment: Database schema" --label layer:data

# Layer 2: API (blocked by data)
$ bd create "Payment: REST endpoints" --label layer:api
$ bd dep add bd-api --blocks bd-data

# Layer 3: Business Logic (blocked by API)
$ bd create "Payment: Transaction processing" --label layer:logic
$ bd dep add bd-logic --blocks bd-api

# Layer 4: UI (blocked by logic)
$ bd create "Payment: Checkout form" --label layer:ui
$ bd dep add bd-ui --blocks bd-logic
```

**Keuntungan:** Dependencies jelas, natural untuk development flow.

### Strategy 3: Risk-Based Decomposition

Mengerjakan **bagian paling berisiko atau uncertain duluan**:

```bash
# Epic: Real-time Chat

# High Risk - kerjakan duluan
$ bd create "Chat: WebSocket stability" --label risk:high -p 0
$ bd create "Chat: Message persistence" --label risk:high -p 0

# Medium Risk
$ bd create "Chat: Typing indicators" --label risk:medium -p 1

# Low Risk - paling akhir
$ bd create "Chat: Emoji reactions" --label risk:low -p 2

# Query by risk
$ bd list --label risk:high --status ready
```

**Keuntungan:** Fail fast—kalau ada yang tidak feasible, ketahuan lebih awal.

## Software is Now Throwaway

Salah satu insight paling mengejutkan dari Steve Yegge: **software sekarang punya shelf life kurang dari 1 tahun**.

### Implikasi untuk Development

1. **Jangan terlalu attached dengan code** - Code adalah means to an end, bukan karya seni yang harus dipertahankan selamanya

2. **Rewriting seringkali lebih mudah daripada fixing** - Untuk AI, generate fresh code lebih mudah daripada understand dan fix legacy code

3. **Unit tests rusak setelah refactor besar?** - Kadang lebih efisien hapus dan generate baru daripada fix satu per satu

4. **Legacy code?** - Pertimbangkan recreate dengan spec yang sama tapi architecture baru

### Bagaimana Beads Membantu?

Beads menyimpan **intent dan spec**, bukan code:

```bash
$ bd show bd-auth.1
ID: bd-auth.1
Title: Implement JWT authentication
Description: 
- Support access token (15 min expiry)
- Support refresh token (7 day expiry)  
- Store in httpOnly cookies
Status: done
```

Ketika code perlu ditulis ulang:
- Issues di Beads masih relevan sebagai spec
- History tersimpan di git, bisa di-reconstruct
- Agent baru bisa re-implement dari spec yang sama

## Event-Driven Workflows dengan Hooks

Beads mendukung hooks untuk automation:

### Auto-Assignment Hook

```bash
# .beads-hooks/on-create
#!/bin/bash
ISSUE_ID=$1
PRIORITY=$(bd show $ISSUE_ID --json | jq -r '.priority')
LABELS=$(bd show $ISSUE_ID --json | jq -r '.labels[]')

# Auto-assign P0 ke senior agent
if [ "$PRIORITY" == "0" ]; then
  bd assign $ISSUE_ID --assignee agent-senior
  echo "Critical issue auto-assigned to senior"
fi

# Route by specialist
if echo "$LABELS" | grep -q "specialist:database"; then
  bd assign $ISSUE_ID --assignee agent-db
fi
```

### Status Cascade Hook

```bash
# .beads-hooks/on-complete
#!/bin/bash
ISSUE_ID=$1
PARENT_ID=$(bd show $ISSUE_ID --json | jq -r '.parent')

if [ "$PARENT_ID" != "null" ]; then
  # Check if all sibling tasks are done
  REMAINING=$(bd list --parent $PARENT_ID --status open | wc -l)
  
  if [ "$REMAINING" -eq 0 ]; then
    bd update $PARENT_ID --status ready
    echo "All subtasks complete, parent marked ready"
  fi
fi
```

### Notification Hook

```bash
# .beads-hooks/on-block
#!/bin/bash
ISSUE_ID=$1
BLOCKER_ID=$2

# Notify via Slack
curl -X POST "$SLACK_WEBHOOK" \
  -H 'Content-type: application/json' \
  -d "{\"text\":\"Task $ISSUE_ID blocked by $BLOCKER_ID\"}"
```

## Performance Optimization

### Untuk Repository Besar

```bash
# Archive completed issues yang sudah lama
$ bd archive --status done --older-than 30d

# Limit berapa issues yang di-load
$ bd config set load.max-issues 500

# Enable lazy loading untuk dependencies
$ bd config set dependencies.lazy-load true
```

### Caching

```bash
# Enable query cache
$ bd config set cache.enabled true
$ bd config set cache.ttl 300  # 5 minutes

# Invalidate jika perlu
$ bd cache invalidate
```

### Regular Maintenance

```bash
# Weekly routine
$ bd doctor --fix        # Fix any issues
$ bd cleanup --older-than 7d  # Remove old completed
$ bd compact             # Optimize database
$ bd sync               # Sync with git
```

## Metrics dan Monitoring

### Key Metrics untuk Tracking

```bash
# Lead time: dari created sampai done
$ bd metrics --metric lead-time

# Cycle time: dari in_progress sampai done
$ bd metrics --metric cycle-time

# Blocked ratio: berapa % tasks yang blocked
$ bd metrics --metric blocked-ratio

# Discovery rate: rata-rata discovered work per task
$ bd metrics --metric discovery-rate
```

### Dashboard

```bash
# Generate dashboard data
$ bd dashboard --port 8080

# Export metrics untuk monitoring external
$ bd metrics --format prometheus > metrics.txt
```

### Predictive Analytics

```bash
# Estimate waktu completion
$ bd predict --epic bd-auth

# Output:
# Epic: User Authentication
# Estimated completion: 14 days
# Confidence: 75%
# Risk factors: 2 high-risk tasks, 1 external dependency
```

## Migration dari Tools Lain

### Dari Jira

```bash
# Export dari Jira (JSON format)
# Jira → Issues → Export → JSON

# Import ke Beads
$ bd import --from-jira export.json

# Preserve Jira IDs sebagai reference
$ bd update bd-001 --external-ref "JIRA-1234"
```

### Dari Linear

```bash
# Export dari Linear
# Linear → Settings → Export

# Import dengan cycle mapping
$ bd import --from-linear export.json
$ bd milestone create "Sprint 1" --date 2026-02-01
```

### Dari Notion/Trello

```bash
# Export sebagai CSV

# Import ke Beads
$ bd import --from-csv board.csv \
  --columns "Title,Status,Priority,Assignee"
```

## Kesimpulan

Advanced Beads patterns memungkinkan kamu untuk:

- **Scale ke multiple agents** dengan swarm architecture yang terkoordinasi
- **Handle Merge Wall** dengan strategi yang tepat
- **Build AI-friendly tools** dengan prinsip Agent UX
- **Simplify decision logic** dengan Zero Framework Cognition
- **Manage complex projects** dengan proper epic decomposition
- **Automate workflows** dengan hooks dan events

Steve Yegge menyebutkan bahwa dengan patterns ini, agents menjadi **"10x more productive"** dan **"100x less frustrating"**.

### Next Steps

1. **Mulai sederhana** - Master basic workflow dulu sebelum swarming
2. **Experiment dengan 2 agents** - Lihat bagaimana mereka berkoordinasi
3. **Setup hooks** - Automate repetitive tasks
4. **Monitor metrics** - Track productivity dan adjust workflow
5. **Scale gradually** - Dari 2 agents ke 3, dst

Dengan advanced patterns yang tepat, vibe coding akan berubah dari eksperimen yang chaotic menjadi **proses development yang scalable dan predictable**.

## Referensi

- [Six New Tips for Better Coding With Agents](https://steve-yegge.medium.com/six-new-tips-for-better-coding-with-agents-d4e9c86e42a9) - Steve Yegge
- [Zero Framework Cognition](https://steve-yegge.medium.com/zero-framework-cognition-a-way-to-build-resilient-ai-applications-56b090ed3e69) - Steve Yegge
- [Beads Best Practices](https://steve-yegge.medium.com/beads-best-practices-2db636b9760c) - Steve Yegge
- [Beads Blows Up](https://steve-yegge.medium.com/beads-blows-up-a0a61bb889b4) - Steve Yegge
