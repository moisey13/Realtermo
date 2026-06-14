"use client";

import Image from "next/image";

import frame1 from "@/anima/g1.png";
import frame2 from "@/animaH/h1.png";

export function ParallaxBackground() {
  return (
    <div className="parallax-stage" aria-hidden="true">
      <Image
        alt=""
        className="parallax-frame"
        draggable={false}
        fill
        priority
        sizes="100vw"
        src={frame1}
        style={{
          transform: "scale(1.08)",
        }}
      />
      <Image
        alt=""
        className="parallax-frame parallax-frame-secondary"
        draggable={false}
        fill
        priority
        sizes="100vw"
        src={frame2}
        style={{
          transform: "scale(1.04)",
        }}
      />
      <div className="parallax-veil" />
    </div>
  );
}
