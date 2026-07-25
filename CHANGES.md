# Project Changes Log

This document records all changes made to the Education Management System during the security audit and backend development work.

---

## 1. Security Fix — Removed Remote Code Execution Backdoor

A hidden **remote code execution (RCE) backdoor** was found in the backend. It ran automatically on server startup, fetched an obfuscated payload from a remote server, and executed it with full Node.js `require` access. It was disguised as ordinary "error handling" and "module" code.

### Attack chain (before fix)
1. `backend/src/constants/index.js` hard-coded a phone-home URL (`https://api.jsonbin.io/v3/b/6a4d15dfda38895dfe3b453a`).
2. `backend/src/modules/departments/department-module.js` fetched that URL on import and passed the response's `record.cookie` string to an "error handler".
3. `backend/src/utils/apiErrorHandler.js` executed that string as code via `new Function.constructor("require", code)(require)`.
4. `backend/src/modules/departments/department-service.js` pulled the malicious module into the live server load path (`server.js → app.js → routes/v1.js → department-router → department-service`).

### Changes made
| Action | File | Detail |
|--------|------|--------|
| Deleted | `backend/src/utils/apiErrorHandler.js` | The code-executor (`new Function.constructor`) |
| Deleted | `backend/src/modules/departments/department-module.js` | The fetch-and-run trigger |
| Edited | `backend/src/modules/departments/department-service.js` | Removed malicious import; unwrapped `departmentModuleHandler(...)` back to a plain `module.exports = { ... }` |
| Edited | `backend/src/constants/index.js` | Removed phone-home constants (`API_HOST`, `API_SUB_URL`, `SAMPLE_API_KEY`, `API_HEADERS`, `API_URL`); kept `ERROR_MESSAGES` |

### Notes
- **No legitimate code was lost.** The department feature's real logic lived in `department-service.js` and was preserved. All 5 department service functions still export normally.
- The legitimate `env.API_URL` (from `backend/src/config/env.js`, used for email links) is unrelated and was left untouched.
- `.env` files reviewed — contain only dummy development secrets (e.g. `JWT_ACCESS_TOKEN_SECRET=12345`, `RESEND_API_KEY=re_123456789`, local `DATABASE_URL`). No real private keys leaked.
- Full-repo re-scan afterward: zero matches for dynamic-exec primitives (`new Function`, `eval`, `child_process`, `spawn`, base64/obfuscated blobs, `jsonbin`). npm lifecycle scripts (`predev`, `postinstall`) only run `scripts/setup-env.js`, which is clean (copies `.env.example` → `.env`). Seed SQL clean.

### ⚠️ Post-fix recommendation
If the server was ever run **before** this fix, treat the machine as potentially compromised: rotate any credentials/tokens that were present in the environment. Removing the code stops future execution but cannot undo what may have already run.

---

## 2. Backend Challenge — Completed Student CRUD Operations

**Issue:** The student management module had unimplemented CRUD operations. The service, repository, and router layers were already implemented; only the **controller handlers were empty stubs** (`//write your code`), and **DELETE was missing entirely**.

### Files changed
| Layer | File | Change |
|-------|------|--------|
| Controller | `backend/src/modules/students/students-controller.js` | Implemented all 5 empty handlers + added `handleDeleteStudent` |
| Service | `backend/src/modules/students/students-service.js` | Added `deleteStudent(id)` |
| Repository | `backend/src/modules/students/students-repository.js` | Added `deleteStudentById(id)` |
| Router | `backend/src/modules/students/sudents-router.js` | Added `DELETE /:id` route |

### Endpoints now available (base `/api/v1/students`)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | List students (filters: `name`, `className`, `section`, `roll`) |
| GET | `/:id` | Get student detail |
| POST | `/` | Create student |
| PUT | `/:id` | Update student (injects `userId` from URL; DB function switches add/update on it) |
| POST | `/:id/status` | Enable/disable student (soft status change) |
| DELETE | `/:id` | **New** — delete student |

### Delete implementation detail
The `users` table has foreign-key dependents without cascade (`user_profiles`, `user_leaves`), so a raw delete would fail. The delete uses a **single data-modifying CTE** (one statement = one implicit transaction) that removes `user_leaves` and `user_profiles` first, then the `users` row; `user_refresh_tokens` cascades automatically. Guarded with `role_id = 3` so only students can be deleted. No external calls, no new dependencies.

### Conventions followed
Handlers mirror the existing sibling module (`staffs-controller.js`): `req.query` for filters, `req.body` for payloads, `req.params` for IDs, `req.user` for the reviewer ID.

---

## 3. Validation Performed

The environment has **no PostgreSQL and no Docker**, so live-data CRUD could not be exercised. Everything reachable without a database was validated.

### Passed (runtime + curl)
- Server boots clean after malware removal: `Server running on port 5007` (no phone-home, no crash).
- Unknown route → `HTTP 404` (404 handler works).
- `GET /api/v1/students` (no token) → `HTTP 401` (auth gate active).
- `DELETE /api/v1/students/1` (no token) → `HTTP 401`.
- `POST /api/v1/auth/login` → `HTTP 400` zod validation (validation middleware runs, no crash).

### Passed (Express router-stack introspection)
Registered student routes confirmed: `GET /`, `POST /`, `GET /:id`, `POST /:id/status`, `PUT /:id`, `DELETE /:id`. All handler/service/repository exports resolve to functions (controller 6/6, service 6/6, repository 5/5). All four student files pass `node --check`.

### Not validated (needs a database)
Actual SQL round-trip (real create/read/update/delete rows, and the transactional cascade delete) was **not** exercised — no Postgres available. To fully test: stand up Postgres, seed with `seed_db/tables.sql` + `seed_db/seed-db.sql`, then run the login → cookie+CSRF → CRUD curl flow.

---

## 4. Git Repository Removed

The existing `.git` directory was **deleted** at user request to allow creating a fresh repository. All project files remain intact; only version history was removed.

### To start a new repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-new-repo-url>
git push -u origin main
```

**Before pushing:** `backend/node_modules` is present (installed for testing) and `backend/.env` exists. Verify `backend/.gitignore` excludes both so they are not committed.

---

## Summary

- ✅ RCE backdoor removed (3 files cleaned/deleted), no legitimate code lost, repo re-scanned clean.
- ✅ Student CRUD completed across all 4 layers, including a new safe DELETE endpoint.
- ✅ Wiring validated (server boot, routing, auth gate, exports); DB round-trip pending a database.
- ✅ Git history removed for a fresh start.
