---
title: "Advanced Beads Patterns: Swarm Architecture dan Complex Project Management"
date: 2026-01-30T00:00:00.000Z
description: "Pelajari advanced patterns untuk Beads: swarm architecture, epic decomposition strategies, dependency resolution algorithms, dan complex project management untuk large-scale vibe coding."
category: JavaScript
article_language: indonesian
ai_generated: ai
programming_language: javascript
---

Setelah menguasai dasar-dasar Beads dan implementasi workflow praktis, saatnya naik level. Artikel ini membahas **advanced patterns** yang digunakan Steve Yegge dan developer berpengalaman lainnya untuk menangani proyek kompleks dengan multiple agents, complex dependencies, dan long-term planning.

## The Swarm Architecture

Steve Yegge pernah menjalankan "dozen concurrent agents" secara bersamaan. Meskipun dia akhirnya mengurangi ke 1-3 agents untuk sustainabilitas, pengalaman tersebut memberikan insight berharga tentang swarm architecture.

### Pattern 1: The Orchestrator Pattern

```bash
# Struktur swarm dengan orchestrator

# Orchestrator Agent (Human atau AI Lead)
$ bd create "Project: E-Commerce Platform" -p 0
# Returns: bd-epic-001

# Decompose into major components
$ bd create "Backend API" -p 0 --parent bd-epic-001
$ bd create "Frontend Web" -p 0 --parent bd-epic-001
$ bd create "Mobile App" -p 0 --parent bd-epic-001
$ bd create "Database Design" -p 0 --parent bd-epic-001
$ bd create "DevOps/Infrastructure" -p 0 --parent bd-epic-001

# Setiap component punya lead agent
$ bd assign bd-epic-001.1 --assignee orchestrator
$ bd assign bd-epic-001.2 --assignee frontend-lead
$ bd assign bd-epic-001.3 --assignee mobile-lead
```

**Cara Kerja:**
1. Orchestrator membuat high-level plan
2. Component leads mengambil ownership masing-masing
3. Component leads membuat sub-tasks dan meng-assign ke worker agents
4. Semua komunikasi melalui Beads (tidak ada direct coordination)

### Pattern 2: The Pipeline Pattern

```bash
# Workflow: Design → Implement → Review → Test → Deploy

# Stage 1: Design
$ bd create "Design Auth System" -p 0 --label stage:design

# Stage 2: Implementation (blocked by design)
$ bd create "Implement Auth API" -p 0 --label stage:implement
$ bd dep add bd-auth-impl --blocks bd-auth-design

# Stage 3: Review (blocked by implementation)
$ bd create "Review Auth Implementation" -p 0 --label stage:review
$ bd dep add bd-auth-review --blocks bd-auth-impl

# Stage 4: Testing
$ bd create "Test Auth System" -p 0 --label stage:test
$ bd dep add bd-auth-test --blocks bd-auth-review

# Stage 5: Deployment
$ bd create "Deploy Auth System" -p 0 --label stage:deploy
$ bd dep add bd-auth-deploy --blocks bd-auth-test

# Query by stage
$ bd list --label stage:design --status open
$ bd list --label stage:implement --status ready
```

### Pattern 3: The Specialist Pattern

```bash
# Assign agents berdasarkan specialization

# Database Specialist
$ bd create "Optimize query performance" -p 0 --label specialist:database
$ bd assign bd-opt-001 --assignee agent-database-specialist

# Security Specialist
$ bd create "Audit authentication flow" -p 0 --label specialist:security
$ bd assign bd-sec-001 --assignee agent-security-specialist

# UI/UX Specialist
$ bd create "Redesign login page" -p 0 --label specialist:frontend
$ bd assign bd-ui-001 --assignee agent-frontend-specialist

# Query by specialist
$ bd list --label specialist:database --status ready
```

## Epic Decomposition Strategies

### Strategy 1: Vertical Slicing

Memecah epic berdasarkan user journey/end-to-end features.

```bash
# Epic: User Authentication System

# Vertical Slice 1: Registration Flow
$ bd create "Registration: Email validation" -p 0 --parent bd-auth-epic
$ bd create "Registration: Password requirements" -p 0 --parent bd-auth-epic
$ bd create "Registration: Email confirmation" -p 0 --parent bd-auth-epic

# Vertical Slice 2: Login Flow
$ bd create "Login: Credentials validation" -p 0 --parent bd-auth-epic
$ bd create "Login: Session management" -p 0 --parent bd-auth-epic
$ bd create "Login: Remember me feature" -p 0 --parent bd-auth-epic

# Vertical Slice 3: Password Recovery
$ bd create "Recovery: Request reset" -p 0 --parent bd-auth-epic
$ bd create "Recovery: Token generation" -p 0 --parent bd-auth-epic
$ bd create "Recovery: Password update" -p 0 --parent bd-auth-epic

# Keuntungan: Setiap slice bisa deliver value independently
```

### Strategy 2: Horizontal Slicing

Memecah berdasarkan architectural layers.

```bash
# Epic: Payment System

# Layer 1: Database
$ bd create "Payment: Database schema" -p 0 --parent bd-payment-epic --label layer:data

# Layer 2: Backend API
$ bd create "Payment: API endpoints" -p 0 --parent bd-payment-epic --label layer:api
$ bd dep add bd-payment-api --blocks bd-payment-data

# Layer 3: Business Logic
$ bd create "Payment: Transaction processing" -p 0 --parent bd-payment-epic --label layer:logic
$ bd dep add bd-payment-logic --blocks bd-payment-api

# Layer 4: Frontend
$ bd create "Payment: Checkout UI" -p 0 --parent bd-payment-epic --label layer:ui
$ bd dep add bd-payment-ui --blocks bd-payment-logic

# Layer 5: Integration
$ bd create "Payment: Third-party gateway" -p 0 --parent bd-payment-epic --label layer:integration
$ bd dep add bd-payment-integration --blocks bd-payment-logic
```

### Strategy 3: Risk-Based Decomposition

Mengerjakan bagian paling berisiko dulu.

```bash
# Epic: Real-time Chat System

# High Risk: WebSocket connection stability
$ bd create "Chat: WebSocket connection handling" -p 0 --parent bd-chat-epic --label risk:high

# High Risk: Message persistence
$ bd create "Chat: Message storage and retrieval" -p 0 --parent bd-chat-epic --label risk:high

# Medium Risk: Typing indicators
$ bd create "Chat: Typing status feature" -p 0 --parent bd-chat-epic --label risk:medium

# Low Risk: Emoji reactions
$ bd create "Chat: Emoji reaction system" -p 0 --parent bd-chat-epic --label risk:low

# Priority berdasarkan risk
$ bd list --label risk:high --status ready
```

## Advanced Dependency Patterns

### Pattern: Conditional Dependencies

```bash
# Task A bisa dikerjakan, tapi ada opsional improvement
$ bd create "Implement basic search" -p 0
# Returns: bd-search-001

$ bd create "Add fuzzy search capability" -p 1
# Returns: bd-search-002

$ bd create "Implement search UI" -p 0
# Returns: bd-search-ui

# UI bisa dikerjakan dengan basic search
$ bd dep add bd-search-ui --blocks bd-search-001

# Tapi kalau fuzzy search selesai dulu, UI harus update
$ bd dep add bd-search-ui --related bd-search-002

# Query: task yang blocked tapi ada related work
$ bd list --has-related --status open
```

### Pattern: Alternative Paths

```bash
# Epic dengan multiple implementation options

$ bd create "Image Processing: Option A - Sharp library" -p 0 --parent bd-image-epic
$ bd create "Image Processing: Option B - Jimp library" -p 0 --parent bd-image-epic
$ bd create "Image Processing: Option C - Custom implementation" -p 0 --parent bd-image-epic

# Hanya satu yang akan dipilih
$ bd update bd-image-opt-a --status in_progress
$ bd update bd-image-opt-b --status cancelled
$ bd update bd-image-opt-c --status cancelled
```

### Pattern: Cyclic Dependency Resolution

```bash
# Cek circular dependencies
$ bd check-circular-deps

# Output:
# Circular dependency detected:
# bd-auth-middleware → bd-user-model → bd-auth-middleware

# Solusi: Introduce abstraction layer
$ bd create "Abstract User Interface" -p 0
$ bd dep add bd-auth-middleware --blocks bd-user-interface
$ bd dep add bd-user-model --blocks bd-user-interface

# Update existing dependencies
$ bd dep remove bd-auth-middleware bd-user-model
$ bd dep add bd-auth-middleware --blocks bd-user-interface
```

## Complex Query Patterns

### Query 1: Critical Path Analysis

```bash
# Temukan task yang blocking banyak work lainnya
$ bd query "SELECT id, title, COUNT(blocked_by) as blocker_count 
  FROM issues 
  WHERE status = 'open' 
  GROUP BY id 
  ORDER BY blocker_count DESC"

# Atau dengan CLI
$ bd list --is-blocker-for-count > 3
```

### Query 2: Bottleneck Detection

```bash
# Task yang sudah lama in_progress
$ bd list --status in_progress --inactive-for 3d

# Task dengan banyak blockers
$ bd list --blocker-count > 2

# Epic dengan progress paling lambat
$ bd epic-progress --sort by-velocity
```

### Query 3: Resource Allocation

```bash
# Lihat workload per agent
$ bd workload --by-assignee

# Output:
# agent-claude: 5 tasks (3 P0, 2 P1)
# agent-cursor: 3 tasks (1 P0, 2 P2)
# agent-copilot: 8 tasks (0 P0, 4 P1, 4 P2)

# Rebalance workload
$ bd assign bd-task-001 --assignee agent-cursor
```

## Event-Driven Workflows

### Pattern: Auto-Assignment

```bash
# .beads-hooks/on-create
#!/bin/bash
ISSUE_ID=$1
PRIORITY=$(bd show $ISSUE_ID --json | jq -r '.priority')
LABELS=$(bd show $ISSUE_ID --json | jq -r '.labels[]')

if [ "$PRIORITY" == "0" ]; then
  # Auto-assign critical issues to senior agent
  bd assign $ISSUE_ID --assignee agent-senior
  echo "🔴 Critical issue $ISSUE_ID auto-assigned to senior agent"
fi

if echo "$LABELS" | grep -q "specialist:database"; then
  bd assign $ISSUE_ID --assignee agent-database-specialist
fi
```

### Pattern: Status Cascade

```bash
# .beads-hooks/on-complete
#!/bin/bash
ISSUE_ID=$1
PARENT_ID=$(bd show $ISSUE_ID --json | jq -r '.parent')

if [ "$PARENT_ID" != "null" ]; then
  # Check if all siblings are done
  SIBLINGS=$(bd list --parent $PARENT_ID --status open | wc -l)
  
  if [ "$SIBLINGS" -eq 0 ]; then
    bd update $PARENT_ID --status ready
    echo "✅ All subtasks complete, $PARENT_ID marked as ready"
  fi
fi
```

### Pattern: Slack Integration

```bash
# .beads-hooks/on-block
#!/bin/bash
ISSUE_ID=$1
BLOCKER_ID=$2

MESSAGE="🚫 Task *$ISSUE_ID* is now blocked by *$BLOCKER_ID*"
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"'$MESSAGE'"}' \
  $SLACK_WEBHOOK_URL
```

## Federation dan Cross-Repo

### Setup Federation

```bash
# Repo utama: my-org/platform
$ bd federation init

# Link repo lain
$ bd federation add github.com/my-org/auth-service
$ bd federation add github.com/my-org/payment-service
$ bd federation add github.com/my-org/frontend-app

# Cross-repo dependencies
$ bd create "Update API contract" -p 0
$ bd dep add bd-api-contract --external github.com/my-org/frontend-app#bd-fe-update
```

### Query Cross-Repo

```bash
# Lihat semua issues di federated repos
$ bd federation list

# Cek dependencies antar repo
$ bd federation deps --graph

# Sync status
$ bd federation sync
```

## Performance Optimization

### Large Repository Management

```bash
# Archive old completed issues
$ bd archive --status done --older-than 30d --compress

# Partial loading
$ bd config set load.strategy partial
$ bd config set load.max-issues 1000

# Lazy loading untuk dependencies
$ bd config set dependencies.lazy-load true
```

### Caching Strategies

```bash
# Enable query cache
$ bd config set cache.enabled true
$ bd config set cache.ttl 300

# Cache specific queries
$ bd ready --cache-key "ready-tasks"

# Invalidate cache
$ bd cache invalidate --key "ready-tasks"
```

### Compaction Strategies

```bash
# Auto-compaction
$ bd config set compaction.enabled true
$ bd config set compaction.threshold 1000
$ bd config set compaction.strategy summary

# Manual compaction
$ bd compact --older-than 14d --strategy archive
$ bd compact --epic bd-old-epic --strategy full
```

## Testing Strategies dengan Beads

### Test-Driven Beads

```bash
# Buat test task sebelum implementation
$ bd create "Test: User registration flow" -p 0 --label type:test
$ bd create "Implement: User registration" -p 0 --label type:implement

# Test harus selesai dulu (TDD)
$ bd dep add bd-impl-reg --blocks bd-test-reg

# Tapi bisa juga parallel dengan proper mocking
$ bd dep add bd-impl-reg --related bd-test-reg
```

### Regression Testing Integration

```bash
# Saat bug ditemukan
$ bd create "Fix: Login timeout bug" -p 0
# Returns: bd-bug-001

$ bd create "Test: Login timeout regression" -p 0 --label type:regression-test
$ bd dep add bd-test-regression --blocks bd-bug-001

# Mark as regression test
$ bd update bd-test-regression --labels "regression,auth,timeout"

# Query regression tests
$ bd list --label regression --status done
```

## Metrics dan Analytics

### Custom Metrics

```bash
# Lead time by priority
$ bd metrics --metric lead-time --group-by priority

# Cycle time trend
$ bd metrics --metric cycle-time --time-series --interval weekly

# Discovery rate
$ bd metrics --metric discovery-rate --by-epic

# Blocker resolution time
$ bd metrics --metric blocker-resolution-time
```

### Dashboard Queries

```bash
# Generate dashboard data
$ bd dashboard-data --format json > dashboard.json

# Key metrics untuk dashboard:
# - Velocity (issues completed per week)
# - WIP (Work In Progress) count
# - Blocked ratio
# - Average lead time
# - Discovery rate
# - Agent utilization
```

### Predictive Analytics

```bash
# Estimate completion time
$ bd predict --epic bd-current-epic

# Output:
# Epic: User Authentication System
# Estimated completion: 14 days
# Confidence: 75%
# Risk factors: 2 high-risk tasks, 1 external dependency

# Identify at-risk tasks
$ bd predict --at-risk --threshold 0.7
```

## Migration dari Tools Lain

### Dari Jira

```bash
# Export Jira issues
# Jira → Issues → Export → JSON

# Convert ke format beads
$ bd import --from-jira jira-export.json --mapping priority:Priority,assignee:Assignee

# Preserve Jira IDs sebagai external refs
$ bd update bd-imported-001 --external-ref "JIRA-1234"
```

### Dari Linear

```bash
# Export dari Linear
# Linear → Settings → Export

# Import ke beads
$ bd import --from-linear linear-export.json

# Map cycles ke beads milestones
$ bd milestone create "Cycle 1" --date 2026-02-01
$ bd import --from-linear linear-export.json --mappings cycle:milestone
```

### Dari Notion/Kanban

```bash
# Export CSV dari Notion/Kanban

# Import ke beads
$ bd import --from-csv kanban-export.csv --columns "Title,Status,Priority,Assignee"

# Auto-generate dependencies berdasarkan status
$ bd import --from-csv kanban.csv --auto-deps --rule "blocked:blocks=in-progress"
```

## Kesimpulan

Advanced Beads patterns memungkinkan kita untuk:

✅ **Scale ke multiple agents** dengan swarm architecture
✅ **Manage complex projects** dengan proper decomposition
✅ **Handle dependencies** secara sophisticated
✅ **Optimize performance** untuk large repositories
✅ **Integrate** dengan existing tools dan workflows

Steve Yegge menyebutkan bahwa setelah menggunakan Beads dengan patterns ini, agents menjadi **"10x more productive"** dan **"100x less frustrating"**. Dengan swarm architecture yang tepat, kita bisa mencapai level produktivitas yang sebelumnya tidak mungkin dengan vibe coding tradisional.

**Next Steps:**
1. Pilih pattern yang paling sesuai dengan project Anda
2. Setup hooks dan automation
3. Monitor metrics dan adjust workflow
4. Scale gradually dari 1 agent ke multiple agents

Selamat mencoba advanced patterns! 🚀✨
