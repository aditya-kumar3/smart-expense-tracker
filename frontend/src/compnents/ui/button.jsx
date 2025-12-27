// src/compnents/ui/button.jsx
import clsx from "clsx";

export function Button({ className, variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400 focus-visible:ring-offset-[#02010a] disabled:opacity-60 disabled:pointer-events-none active:scale-[0.97]";

  const variants = {
    primary:
      "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#111827] px-5 py-2.5 shadow-[0_14px_40px_rgba(251,191,36,0.55)] hover:brightness-110",
    ghost:
      "bg-transparent border border-amber-400/60 text-amber-100 px-4 py-2 hover:bg-amber-400/10",
    subtle:
      "bg-[#050316]/80 border border-white/5 text-slate-200 px-4 py-2 hover:bg-white/5",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...props}
    />
  );
}
