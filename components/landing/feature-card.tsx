"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const rx = ((e.clientY - r.top - r.height / 2) / r.height) * -10;
    const ry = ((e.clientX - r.left - r.width / 2) / r.width) * 10;
    setTilt({ x: rx, y: ry, active: true });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0, active: false });
  }

  return (
    <div style={{ perspective: "900px" }} className="h-full">
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${tilt.active ? 18 : 0}px)`,
          transition: tilt.active
            ? "transform 0.1s ease-out, box-shadow 0.15s ease"
            : "transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease",
          boxShadow: tilt.active
            ? "0 28px 52px -8px oklch(0 0 0 / 0.2), 0 10px 20px -6px oklch(0 0 0 / 0.1)"
            : "0 1px 4px oklch(0 0 0 / 0.05)",
        }}
        className="group relative h-full cursor-default overflow-hidden rounded-2xl border bg-card p-6"
      >
        {/* Top-left shimmer on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: tilt.active ? 1 : 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%)",
          }}
        />

        {/* Brand glow orb behind icon */}
        <div
          className="pointer-events-none absolute -left-3 -top-3 h-24 w-24 rounded-full blur-2xl transition-opacity duration-500"
          style={{
            background: "var(--brand)",
            opacity: tilt.active ? 0.22 : 0,
          }}
        />

        {/* Icon box */}
        <div
          className={cn(
            "relative mb-4 flex size-10 items-center justify-center rounded-xl border transition-all duration-300",
            tilt.active
              ? "border-brand/30 bg-brand/10 text-brand shadow-[0_0_18px_var(--brand-glow)]"
              : "border-border bg-muted text-muted-foreground"
          )}
        >
          {icon}
        </div>

        {/* Text */}
        <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Bottom brand accent line */}
        <div
          className="pointer-events-none absolute bottom-0 left-8 right-8 h-px transition-opacity duration-500"
          style={{
            opacity: tilt.active ? 1 : 0,
            background:
              "linear-gradient(90deg, transparent, var(--brand), transparent)",
          }}
        />
      </div>
    </div>
  );
}
