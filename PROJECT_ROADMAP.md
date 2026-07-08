# Elola ERP Enterprise Roadmap

> Project: Elola Tires & Batteries ERP
> Status: Active Development
> Main Branch: main
> Development Branch: develop

---

# Vision

Build Elola into a complete ERP platform including:

- Website
- ERP Dashboard
- Finance
- Warehouses
- Wallets
- AI Assistant
- Firestore Cloud Database
- Mobile Application
- Analytics
- Reports

---

# Development Rules

- Never modify large files directly if logic can be moved elsewhere.
- Always use Services, Repositories and Engines.
- Keep React Components responsible for UI only.
- Every major step must be tested.
- Every completed phase must be committed to GitHub.
- Firestore will become the main database.
- localStorage will remain only for offline cache.

---

# Current Phase

## Phase 1 - Foundation

Status: In Progress

### Completed

- [x] Git Repository
- [x] GitHub Repository
- [x] develop branch
- [x] Firebase Project
- [x] Firestore Database
- [x] Cart Refactor Started

### In Progress

- [ ] Firestore Repository
- [ ] Orders Repository
- [ ] Wallet Repository
- [ ] Checkout Service
- [ ] Store Refactoring

### Future

- [ ] Firestore Sync
- [ ] Offline Mode
- [ ] AI ERP
- [ ] Mobile API
- [ ] Notifications
- [ ] Reports

---

# Backup Policy

After every successful phase:

git add .

git commit -m "Describe completed phase"

git push

Verify GitHub

---

# Notes

This document is the official roadmap of the Elola ERP project.