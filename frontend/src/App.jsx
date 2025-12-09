import { useState } from "react";

const API_BASE = "/api";

export default function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [itemId, setItemId] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobData, setJobData] = useState(null);
  const [logs, setLogs] = useState([]);

  function log(msg) {
    setLogs(prev => [`${new Date().toLocaleTimeString()}  ${msg}`, ...prev]);
  }

  async function login() {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        log("Authenticated and received JWT.");
      } else {
        log("Login failed.");
      }
    } catch (e) {
      log("Login error: " + e.message);
    }
  }

  async function enqueueJob() {
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
      });
      const data = await res.json();
      if (data.jobId) {
        setJobId(data.jobId);
        setJobData(null);
        log(`Enqueued retrieval job ${data.jobId} for item ${itemId}.`);
      } else {
        log("Failed to enqueue job.");
      }
    } catch (e) {
      log("Enqueue error: " + e.message);
    }
  }

  async function checkJob() {
    try {
      const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setJobData(data);
      log(`Polled job ${jobId} → state: ${data.state}`);
    } catch (e) {
      log("Status error: " + e.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        background: "#050816",
        color: "#f9fafb",
        padding: "2rem"
      }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>Fleet-Style Semantic Platform</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Distributed retrieval + API dashboard (JWT auth, job queue, status polling).
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr",
          gap: "1.5rem",
          marginTop: "2rem"
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Auth card */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              background: "#0b1120",
              border: "1px solid #1f2937"
            }}
          >
            <h2 style={{ marginTop: 0 }}>1. Authenticate</h2>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Simulated login endpoint that returns a signed JWT for the platform.
            </p>
            <input
              placeholder="engineer@fleet-semantic.dev"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                marginBottom: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#f9fafb"
              }}
            />
            <button
              onClick={login}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                border: "none",
                background: "#38bdf8",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Get JWT
            </button>
            {token && (
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.8 }}>
                Token: <code style={{ fontSize: "0.7rem" }}>•••{token.slice(-12)}</code>
              </p>
            )}
          </div>

          {/* Enqueue card */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              background: "#0b1120",
              border: "1px solid #1f2937"
            }}
          >
            <h2 style={{ marginTop: 0 }}>2. Enqueue Retrieval Job</h2>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Sends a retrieval request into the Redis-backed queue.
            </p>
            <input
              placeholder="CAD-1234, DOC-42, etc."
              value={itemId}
              onChange={e => setItemId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                marginBottom: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#f9fafb"
              }}
            />
            <button
              onClick={enqueueJob}
              disabled={!token}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                border: "none",
                background: token ? "#22c55e" : "#4b5563",
                cursor: token ? "pointer" : "not-allowed",
                fontWeight: 600
              }}
            >
              Enqueue Job
            </button>
            {jobId && (
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.8 }}>
                Job ID: <code style={{ fontSize: "0.7rem" }}>{jobId}</code>
              </p>
            )}
          </div>

          {/* Poll card */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              background: "#0b1120",
              border: "1px solid #1f2937"
            }}
          >
            <h2 style={{ marginTop: 0 }}>3. Poll Job Status</h2>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Demonstrates the event-driven update path by polling the API.
            </p>
            <button
              onClick={checkJob}
              disabled={!jobId || !token}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                border: "none",
                background:
                  jobId && token ? "#f97316" : "#4b5563",
                cursor: jobId && token ? "pointer" : "not-allowed",
                fontWeight: 600
              }}
            >
              Check Status
            </button>

            {jobData && (
              <pre
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  background: "#020617",
                  fontSize: "0.75rem",
                  maxHeight: "220px",
                  overflow: "auto"
                }}
              >
{JSON.stringify(jobData, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Right column — logs */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "0.75rem",
            background: "#020617",
            border: "1px solid #1f2937",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Event Log</h2>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            Lightweight trace of API calls and queue interactions.
          </p>
          <div
            style={{
              marginTop: "0.5rem",
              flexGrow: 1,
              overflow: "auto",
              fontSize: "0.75rem",
              borderRadius: "0.5rem",
              background: "#020617",
              border: "1px solid #111827",
              padding: "0.75rem"
            }}
          >
            {logs.length === 0 ? (
              <span style={{ opacity: 0.7 }}>No events yet. Authenticate to begin.</span>
            ) : (
              logs.map((line, idx) => <div key={idx}>{line}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
