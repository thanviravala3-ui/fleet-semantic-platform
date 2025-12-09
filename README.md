# Fleet-Style Semantic Platform

Distributed retrieval + API system inspired by Fleet-style architectures.  
The platform combines a Rails-style Node.js backend, a Redis-backed job queue, and a small React dashboard for monitoring jobs end-to-end.

---

## ✨ What this project demonstrates

- **Distributed retrieval pipeline** using a lightweight job queue (Bull + Redis)
- **JWT-protected API** for enqueueing and inspecting retrieval jobs
- **Event-driven update path**: jobs are processed asynchronously by workers
- **React dashboard** to drive the API and visualize system behaviour

---

## 🧱 High-Level Architecture

```text
[ React Dashboard ]  ──(HTTP)──>  [ Node.js API ]
                             POST /api/jobs
                                  │
                                  ▼
                       [ Redis-backed Queue ]
                                  │
                                  ▼
                         [ Retrieval Worker ]
                                  │
                            async result
                                  │
                                  ▼
                      GET /api/jobs/:id (status)
