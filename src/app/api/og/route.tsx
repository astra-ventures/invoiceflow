import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0F1E",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient orb */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            marginLeft: -300,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            marginBottom: 20,
          }}
        >
          Invoice
          <span style={{ color: "#6366F1" }}>Flow</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#9CA3AF",
            marginBottom: 40,
          }}
        >
          Professional invoices in 60 seconds
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#6366F1",
            color: "white",
            fontSize: 20,
            fontWeight: 600,
            padding: "16px 40px",
            borderRadius: 12,
          }}
        >
          Create Free Invoice →
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "#6B7280",
          }}
        >
          Free forever · No signup required · Instant PDF download
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
