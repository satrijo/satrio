---
title: "Beads: Memory System untuk Coding Agents oleh Steven Yegge"
date: 2026-01-29T00:00:00.000Z
description: "Pelajari Beads, sistem memory untuk AI coding agents dari Steven Yegge. Solusi untuk agent dementia, long-horizon planning, dan work tracking dalam vibe coding."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

**Beads** adalah sistem memory untuk coding agents yang dikembangkan oleh **Steven Yegge** (ex-Google, ex-Amazon, ex-Sourcegraph). Setelah 40 hari straight vibe coding dan menghasilkan 350k LOC yang akhirnya harus di-burn karena architectural flaws, Steve menciptakan Beads sebagai solusi untuk masalah fundamental dalam agentic coding: **agent dementia** dan **lost work**.

## Masalah yang Diselesaikan Beads

### 1. Agent Dementia (The Memento Problem)

Coding agents seperti Claude, GPT-4, dan Copilot memiliki **tidak ada memory antar session**. Setiap session hanya berlangsung ~10 menit, lalu agent "reboot" dengan memory kosong.

**Yang terjadi:**
- Agent mulai project dengan 6 fase
- Setelah 2 fase + beberapa compaction, agent lupa konteks
- Agent membuat plan baru: "Oh wow, ini big project, saya akan buat 5 fase"
- Agent bekerja pada fase 1 (dari 5) dari fase 3 (dari 6) - nested tanpa sadar
- Agent declare: "Project DONE! 🎉" padahal baru 30% selesai

Steve menyebut ini **"Descent Into Madness"** - agent meander secara intelligen tapi buta, gradually losing their way.

### 2. Lost Work / Work Disavowal

Agents sering menemukan masalah saat coding, tapi karena pressed for context space, mereka:
- Mengabaikan bug dengan alasan "not my work"
- Tidak mencatat discovered work
- Menulis TODO di markdown yang segera obsolete

Steve menemukan **605 markdown plan files** yang partly implemented, partly obsolete, 100% useless.

### 3. Markdown Plan Chaos

Traditional markdown TODO lists:
- Write-only memory untuk agents
- Tidak bisa query untuk ready work
- Tidak ada dependency tracking
- Tidak ada audit trail

## Apa itu Beads?

Beads adalah **distributed, git-backed graph issue tracker** yang dirancang khusus untuk AI agents.

### Core Concepts

#### 1. Git as Database
Issues disimpan sebagai **JSONL** di folder `.beads/`, versioned seperti code:

```
.beads/
├── issues/
│   ├── bd-a1b2.jsonl    # Issue bd-a1b2
│   ├── bd-a1b2.1.jsonl  # Sub-task
│   └── bd-c3d4.jsonl
└── events/
    └── 2026-01-29/
        └── events.jsonl   # Audit trail
```

**Keuntungan:**
- ✅ Versioned dengan git
- ✅ Branching dan merging
- ✅ Multi-agent coordination
- ✅ No database setup

#### 2. Graph Structure (The Bead Chain)

Issues linked seperti beads on a chain:

```
[Epic bd-a3f8]
    ├── [Task bd-a3f8.1] ← blocks → [Task bd-a3f8.2]
    │       └── [Sub-task bd-a3f8.1.1]
    └── [Task bd-a3f8.3]
            └── discovered-from → [Bug bd-x9y0]
```

**Dependency Types:**
- `blocks`: Issue A harus selesai sebelum B
- `blocked-by`: Issue B blocked oleh A
- `parent-child`: Epic → Task → Sub-task
- `discovered-from`: Work discovered saat implementasi
- `related`: Related tapi tidak blocking

#### 3. Agent-Optimized Interface

**JSON Output untuk Machine Parsing:**
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

**Auto-Ready Detection:**
```bash
$ bd ready
bd-a1b2  P0  Implement user authentication
bd-c3d4  P1  Setup database schema
```
Hanya menampilkan issues dengan **no open blockers**.

## Instalasi dan Setup

### Quick Install
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

### Initialize Project
```bash
cd your-project
bd init

# Stealth mode (local only, tidak commit ke repo)
bd init --stealth

# Contributor mode (forked repos)
bd init --contributor
```

### Setup Agent Instructions

Tambahkan ke `AGENTS.md` atau `CLAUDE.md`:
```markdown
## Task Management with Beads

Use 'bd' (beads) for all task tracking:
- Check ready work: bd ready
- Create tasks: bd create "Title" -p 0
- Link dependencies: bd dep add <child> <parent>
- View details: bd show <id>

Always file discovered work as new issues.
Never leave bugs unrecorded.
```

## Essential Commands

### Basic Workflow
```bash
# List ready tasks (no blockers)
bd ready

# Create new task
bd create "Implement login API" -p 0

# Create with description
bd create "Fix auth bug" -p 1 --desc "Token validation fails on expiry"

# Show task details
bd show bd-a1b2

# Update status
bd update bd-a1b2 --status in_progress

# Complete task
bd update bd-a1b2 --status done
```

### Dependency Management
```bash
# Add parent-child relationship
bd dep add bd-a1b2.1 bd-a1b2

# Add blocking dependency
bd dep add bd-c3d4 --blocks bd-a1b2

# Add discovered work
bd create "Fix database connection" --discovered-from bd-a1b2

# View dependency graph
bd graph bd-a1b2
```

### Hierarchy & Epics
```bash
# Create epic
bd create "User Authentication System" -p 0
# Returns: bd-a3f8

# Create sub-task
bd create "Implement JWT" -p 0 --parent bd-a3f8
# Returns: bd-a3f8.1

# Create nested sub-task
bd create "Token validation" -p 0 --parent bd-a3f8.1
# Returns: bd-a3f8.1.1
```

### Search dan Filter
```bash
# Search by title
bd search "auth"

# Filter by status
bd list --status open

# Filter by priority
bd list --priority 0,1

# Filter by assignee
bd list --assignee claude

# Combined filters
bd list --status open --priority 0 --json
```

## Advanced Features

### 1. Multi-Agent Coordination

Beads supports multiple agents working simultaneously:

```bash
# Agent 1 claims task
bd assign bd-a1b2 --assignee agent-1

# Agent 2 sees it's claimed
bd ready
# (tidak menampilkan bd-a1b2 karena sudah in_progress)

# Agent 2 works on different ready task
bd assign bd-c3d4 --assignee agent-2
```

**Merge Conflicts:** AI melakukan intelligent collision resolution untuk concurrent edits.

### 2. Federation (Multi-Repo)

Untuk large organizations:

```bash
# Setup federation
bd federation init

# Link external repos
bd federation add github.com/org/repo

# Cross-repo dependencies
bd dep add bd-a1b2 --external github.com/org/repo#bd-x9y0
```

### 3. Compaction (Memory Decay)

Old closed tasks di-summarize untuk save context window:

```bash
# View compacted history
bd show bd-a1b2 --history

# Events:
# 2026-01-29 10:00: Created
# 2026-01-29 10:15: Assigned to claude
# 2026-01-29 11:30: Status → in_progress
# 2026-01-29 14:00: Status → done
# [COMPACTED: 47 events summarized]
```

### 4. Hooks

Automated actions pada event:

```bash
# .beads-hooks/on-create
#!/bin/bash
echo "New task created: $1" | slack-notify

# .beads-hooks/on-complete
#!/bin/bash
bd generate-report --since yesterday
```

## Integration dengan Coding Agents

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
# dan otomatis menggunakan bd commands

# Contoh interaksi:
# User: "Fix the auth bug"
# Copilot: "I'll check beads for auth-related issues..."
# Copilot: bd search "auth"
# Copilot: "Found bd-x9y0: Token validation fails. Working on it."
```

### Sourcegraph Amp
```bash
# Amp integration built-in
amp beads sync
amp beads ready
```

## Best Practices

### 1. Fine-Grained Tasks
Split tasks menjadi small, actionable items:

```bash
# ❌ Bad
bd create "Build entire app" -p 0

# ✅ Good
bd create "Setup project structure" -p 0
bd create "Implement auth middleware" -p 0
bd create "Create login endpoint" -p 0
```

### 2. Always File Discovered Work
```bash
# Saat coding, agent menemukan bug
# Jangan ignore!

bd create "Fix database connection leak" \
  --discovered-from bd-a1b2 \
  -p 0
```

### 3. Dependency-First Planning
```bash
# Buat dependency graph sebelum mulai
bd create "Database Schema" -p 0  # bd-a1
bd create "API Endpoints" -p 0     # bd-a2
bd create "Frontend Components" -p 0  # bd-a3

# Link dependencies
bd dep add bd-a2 --blocks bd-a3
bd dep add bd-a1 --blocks bd-a2

# Now bd-a3 won't show in 'bd ready' until a1 and a2 done
```

### 4. Session-Based Workflow
```bash
# Start session
bd ready
bd assign bd-a1b2 --assignee claude-session-1

# Work on task
# ... coding ...

# End session
bd update bd-a1b2 --status done

# Next session
bd ready  # Shows next available task
```

## Comparison dengan Tools Lain

| Feature | Beads | GitHub Issues | Jira | Markdown TODO |
|---------|-------|---------------|------|---------------|
| Git-backed | ✅ | ❌ | ❌ | ✅ |
| Agent-optimized | ✅ | ❌ | ❌ | ❌ |
| Dependency graph | ✅ | ⚠️ | ✅ | ❌ |
| JSON API | ✅ | ⚠️ | ⚠️ | ❌ |
| Multi-agent | ✅ | ❌ | ❌ | ❌ |
| Zero config | ✅ | ❌ | ❌ | ✅ |
| Query ready tasks | ✅ | ❌ | ❌ | ❌ |

## Real-World Impact

Steven Yegge melaporkan setelah menggunakan Beads:
- **95% reduction** dalam lost work
- **Long-horizon tasks** bisa di-handle dengan baik
- **Multi-agent coordination** menjadi seamless
- **No more markdown plan chaos**

## Tools dan Integrasi

### Official
- **bd CLI**: Core tool (Go)
- **npm package**: `@beads/bd`
- **Python package**: `beads-mcp`
- **VS Code Extension**: Beads Explorer

### Community Tools
- **Terminal UI**: `beads-tui`
- **Web UI**: `beads-web`
- **Mobile App**: `beads-mobile`
- **Slack Integration**: `beads-slack`

## Setup untuk Maksimal Penggunaan

### 1. IDE Integration
```bash
# VS Code
ext install beads.beads-explorer

# Configuration
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

### 3. CI/CD Integration
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
# Dashboard untuk track progress
bd dashboard --port 8080

# Metrics
bd metrics --format prometheus
```

## Troubleshooting

### Issue: bd ready shows nothing
```bash
# Check if all tasks blocked
bd list --status open

# Check blockers
bd show bd-a1b2 --blockers

# Unblock if needed
bd update bd-x9y0 --status done
```

### Issue: Merge conflicts
```bash
# Auto-resolve dengan AI
bd merge --strategy ai

# Atau manual
bd conflicts list
bd conflicts resolve bd-a1b2
```

### Issue: Large repo slow
```bash
# Enable caching
bd config set cache.enabled true

# Compaction
bd compact --older-than 30d
```

## Kesimpulan

Beads merevolusi cara kita melakukan vibe coding dengan menyediakan:

✅ **Persistent Memory** - Agents tidak lagi dementia antar session  
✅ **Dependency Tracking** - Complex task graphs dengan mudah  
✅ **Work Discovery** - Tidak ada lagi lost work  
✅ **Multi-Agent Coordination** - Seamless collaboration  
✅ **Git Integration** - Versioned, branched, merged seperti code  

**Status 2026:** Production-ready, digunakan oleh thousands of developers  
**Recommended for:** All vibe coding workflows, especially long-horizon tasks  
**Not for:** Simple one-off scripts (overkill)

Dengan Beads, agents menjadi **10x more productive** dan **100x less frustrating**. Steven Yegge menyebutnya **"the biggest step forward in agentic coding since MCP+Playwright."**

Selamat vibe coding dengan Beads! 🎯✨
