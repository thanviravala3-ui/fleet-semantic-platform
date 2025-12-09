# Fleet-Style Semantic Platform

I built this as a hands-on way to practice the kind of distributed, low-latency systems that power real production environments.  
It’s a small end-to-end platform with a Rails-style Node.js backend, a Redis-backed job queue for async work, and a React dashboard to monitor job flow in real time—similar to how internal tools at Tesla visualize fleet data and request pipelines.

---

## What this project demonstrates

- A **distributed retrieval pipeline** that turns incoming requests into background jobs using Bull + Redis  
- A **JWT-secured API layer**, designed with clean routing and predictable response patterns  
- An **event-driven worker path** that processes retrieval tasks asynchronously and returns consistent, low-latency results  
- A simple **React dashboard** that drives the API, visualizes job states, and surfaces system behavior the way internal fleet tools would

Overall, this project was my way of practicing how to design components that are **fault-tolerant, observable, and scalable**—all core ideas behind fleet data platforms, telemetry systems, and distributed services.

---

## High-Level Architecture

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
