import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          color: "#0f172a",
          display: "flex",
          fontSize: 84,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          width: "100%",
          borderRadius: 36,
          border: "4px solid rgba(14, 165, 233, 0.2)",
        }}
      >
        РТ
      </div>
    ),
    size,
  );
}
