import { ImageResponse } from "next/og";
import { caseStudies } from "@/lib/content/case-studies";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT_RGB: Record<string, string> = {
  cyan: "34, 211, 238",
  magenta: "244, 114, 182",
  amber: "251, 191, 36",
  primary: "129, 140, 248",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: "#0a0a0a" }} />,
      { ...size },
    );
  }

  const rgb = ACCENT_RGB[cs.accent] ?? ACCENT_RGB.primary;

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
          background: `radial-gradient(ellipse 70% 60% at 100% 0%, rgba(${rgb},0.4), transparent 65%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(99,102,241,0.25), transparent 70%), #0a0a0a`,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #06b6d4, #6366f1, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              YN
            </div>
            <div style={{ fontSize: "22px", fontWeight: 600 }}>Your Name</div>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: `rgb(${rgb})`,
            }}
          >
            Case Study · {cs.year}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#a3a3a3",
            }}
          >
            {cs.category}
          </div>
          <div
            style={{
              fontSize: "80px",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {cs.title.en}
          </div>
          <div style={{ display: "flex", gap: "60px", marginTop: "20px" }}>
            {cs.metrics.map((m) => (
              <div
                key={m.label}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <div
                  style={{
                    fontSize: "44px",
                    fontWeight: 800,
                    color: `rgb(${rgb})`,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#a3a3a3",
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
