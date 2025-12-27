// src/compnents/ui/card.jsx
import clsx from "clsx";

export function Card({ className, ...props }) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl border border-white/8 bg-[#050316]/95 shadow-[0_26px_80px_rgba(0,0,0,0.95)] backdrop-blur",
        "before:pointer-events-none before:absolute before:inset-x-[-40%] before:-top-24 before:h-40 before:bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.35),transparent_60%)]",
        className
      )}
      {...props}
    />
  );
}
