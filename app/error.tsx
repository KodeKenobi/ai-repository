"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "3.75rem",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          500
        </h1>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "1rem",
          }}
        >
          Something went wrong!
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          An unexpected error occurred. Please try again.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "white",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: "500",
              display: "inline-block",
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
