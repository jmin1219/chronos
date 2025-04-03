# 🧠 Chronos AI — Master the Discipline of Focus

Chronos AI is an AI-powered productivity system that helps users **plan**, **track**, and **optimize deep work**. It bridges the gap between task scheduling and actual time usage, enabling users to build discipline and clarity in how they work.

---

## 🚀 MVP Feature Summary

| Feature                   | Status | Description |
|--------------------------|--------|-------------|
| Task Management UI       | ✅ Done | Add, edit, delete tasks; assign to projects; include priorities and estimated durations |
| Sidebar Navigation       | ✅ Done | ShadCN UI-based responsive sidebar with icons and quick actions |
| Deep Work Timer          | ✅ Done | Pomodoro-style timer with live tracking, notes, and post-session logging |
| Notes Panel              | ✅ Done | Notes textarea + recent session notes with project filtering |
| Deep Work Calendar View  | ✅ Done | Daily view with scrollable timeline, session blocks, edit dialogs |
| Edit Deep Work Sessions  | ✅ Done | Modal dialog to edit task, start/end times, and notes |
| Calendar Scheduling Page | ⚙️ In Progress | Weekly/Monthly calendar to drag & drop tasks, create scheduled or deep work sessions |
| Task Scheduling via Drag & Drop | ⚙️ In Progress | Drag from task list to calendar to create or update task schedules |
| Summaries & Insights     | ❌ Not Started | Visual summaries based on planned vs actual time, project focus, and productivity trends |
| Toast Notifications      | ❌ Not Started | Feedback for user actions across all features |

---

## 📚 Features in Detail

### 🗂 Tasks & Projects
- Tasks can be assigned priorities (`Must Do`, `Should Do`, `Could Do`)
- Linked to projects with associated color
- Support for `estimatedDuration`, `actualDuration`, and `dueDate`

### ⏱️ Deep Work Timer
- Start/stop deep work sessions
- Track expected vs actual duration
- Break periods included
- Notes saved per session
- Zustand for persistent timer state (across tabs/pages)

### 📓 Notes Panel
- Session-specific notes entry
- Recent sessions listed and filterable by current task's project
- Data enriched from task/project information

### 📆 Calendar Views
- Daily view (deep work sessions only)
- Weekly & monthly calendar (FullCalendar)
- Drag-and-drop support for scheduling tasks

### 🧩 Schedule Management
- Tasks dropped in future → `taskSchedules`
- Tasks dropped in past → `deepWorkSessions`
- Tasks can be dropped, moved, resized (adjusts `startTime`, `endTime`)
- Color-coded by project

---

## 🏗️ Tech Stack

| Layer            | Stack |
|------------------|-------|
| Frontend         | Next.js, TypeScript, TailwindCSS, ShadCN UI, Zustand, FullCalendar |
| Backend API      | Next.js API routes, RESTful architecture |
| Database         | SQLite via Drizzle ORM |
| State Management | Zustand + Tanstack Query |
| Time Utilities   | `date-fns` |

---

## 🧱 Project Structure

```
/src
 ├── app/                ← Next.js route app directory
 │    ├── (features)/
 │    │    ├── tasks/
 │    │    ├── deepwork/
 │    │    └── schedule/
 │    └── api/           ← API route handlers
 ├── components/         ← Reusable UI components (cards, buttons, form controls)
 ├── db/                 ← Drizzle schema definitions
 ├── hooks/              ← React hooks (Zustand stores, React Query hooks)
 ├── lib/                ← Utility functions and type definitions
 └── styles/             ← Tailwind config, globals
```

---

## 📈 Future (Phase 2) — AI Enhancements

| Feature                             | Status |
|------------------------------------|--------|
| AI suggestions for time adjustments | ❌ Not Started |
| Deep work trend analysis           | ❌ Not Started |
| Habit tracking & streak logic      | ❌ Not Started |
| Weekly/monthly productivity reports | ❌ Not Started |

---

## 🧪 Development Practices

- Task-level planning and work logs tracked in Obsidian
- GitHub repo: [Chronos AI](https://github.com/jmin1219/chronos)
- Components structured for reusability and scalability
- Use of enriched query results to reduce frontend joins

---

## ✅ Getting Started (Local Dev)

```bash
pnpm install
pnpm dev
```

Requires:
- Node.js 18+
- SQLite preinstalled or Docker optional
- `.env` with database URL: `DATABASE_URL=file:./db.sqlite`
