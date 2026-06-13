"use client";

import frame1 from "@/anima/g1.png";

export function ParallaxBackground() {
  return (
    <div className="parallax-stage" aria-hidden="true">
      <img
        alt=""
        className="parallax-frame"
        draggable={false}
        src={frame1.src}
        style={{
          transform: "translate3d(-50%, -50%, 0) scale(1.08)",
        }}
      />
      <div className="parallax-veil" />
    </div>
  );
}
