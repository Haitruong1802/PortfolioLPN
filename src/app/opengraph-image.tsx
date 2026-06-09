import { ImageResponse } from "next/og";

export const alt = "Marketing Freelancer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse 80% 60% at 80% 0%, rgba(99,102,241,0.45), transparent 70%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(236,72,153,0.35), transparent 70%), #0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #06b6d4, #6366f1, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            YN
          </div>
          <div style={{ fontSize: "24px", fontWeight: 600 }}>Your Name</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "26px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#22d3ee",
            }}
          >
            Marketing Freelancer
          </div>
          <div
            style={{
              fontSize: "92px",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Campaigns with</span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, #22d3ee, #818cf8, #f472b6)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              real results.
            </span>
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              maxWidth: "900px",
              marginTop: "10px",
            }}
          >
            Performance · Brand · Social · SEO · Integrated campaigns
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
