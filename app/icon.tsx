import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          color: "#0f172a",
          display: "flex",
          fontSize: 16,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          width: "100%",
          borderRadius: 8,
          border: "1px solid rgba(14, 165, 233, 0.25)",
        }}
      >
        РТ
      </div>
    ),
    size,
  );
}
