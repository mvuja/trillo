# Trillo — Kanban Board

A full-featured Kanban board app built with **Next.js 13**, **Tailwind CSS**, and **hello-pangea/dnd**. Inspired by Trello. Built as a portfolio project demonstrating modern React patterns, accessibility, and clean UI/UX.

---

## Features

### Board
- **Drag & drop columns** — reorder entire lists by dragging the grip handle on the column header
- **Add columns** — create new lists from the header bar
- **Rename columns** — click the ✏️ icon on any column header to rename inline; confirm with Enter or blur
- **Delete columns** — click the 🗑️ icon; an inline confirmation prevents accidental deletion
- **Card count badge** — each column shows a live count of its tasks
- **Empty state** — friendly illustration when a column has no tasks
- **Board title editing** — double-click the board title to rename it; persisted across sessions

### Cards / Tasks
- **Add tasks** — click "Add task" at the bottom of any column
- **Drag & drop cards** — move cards between columns or reorder within a column using the grip handle
- **Edit tasks** — pencil icon opens a modal to edit title and due date
- **Delete tasks** — trash icon triggers a confirmation dialog
- **Priority labels** — Low / Medium / High with colour-coded badges; click to change inline
- **Due dates** — optional; shown on each card; overdue dates are highlighted in red
- **Search / filter** — search bar in the header dims non-matching cards across all columns in real time

### UX & Accessibility
- All interactive elements have `aria-label` attributes
- Modals have `role="dialog"`, `aria-modal`, and focus management
- `Escape` closes any open modal or form
- Confirmation dialogs auto-focus the destructive action
- Smooth enter animations on cards and columns (CSS keyframes)
- Dark mode toggle
- **Reset board** button restores default seed data (with confirmation)
- Data persisted to `localStorage` — survives page refreshes

---

## Tech Stack

| Tool                                                                    | Purpose |
|-------------------------------------------------------------------------|---|
| [Next.js 16](https://nextjs.org/)                                       | React framework (App Router, `'use client'`) |
| [Tailwind CSS 3](https://tailwindcss.com/)                              | Utility-first styling |
| [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) | Form element base styles |
| [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)                | Drag & drop for cards and columns (maintained fork of react-beautiful-dnd) |
| [react-toastify](https://fkhadra.github.io/react-toastify/)             | Toast notifications |


---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/trillo.git
cd trillo

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.