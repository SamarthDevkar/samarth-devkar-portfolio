import { ImageResponse } from "next/og";

import { site } from "@/content";

export const alt = `${site.name} · ${site.roleLong}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card.
 *
 * Rendered by Satori, which supports a subset of CSS, no CSS custom
 * properties, and every element with more than one child needs an explicit
 * display. Token values are therefore inlined as hex equivalents of the
 * design system's OKLCH colours.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e1015",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              backgroundColor: "#e8a33d",
            }}
          />
          <div
            style={{
              color: "#8a8f9a",
              fontSize: "22px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Seattle, Washington
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f3f4f6",
              fontSize: "104px",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              color: "#e8a33d",
              fontSize: "30px",
              marginTop: "28px",
              letterSpacing: "-0.01em",
            }}
          >
            {site.roleLong}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #2b2f3a",
            paddingTop: "32px",
          }}
        >
          <div style={{ color: "#8a8f9a", fontSize: "24px" }}>
            Detection engineering · Threat hunting · Security telemetry
          </div>
          <div style={{ color: "#8a8f9a", fontSize: "24px" }}>
            IEEE ICDCS 2026
          </div>
        </div>
      </div>
    ),
    size,
  );
}
