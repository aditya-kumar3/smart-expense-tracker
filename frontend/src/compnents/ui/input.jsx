// src/compnents/ui/input.jsx
import clsx from "clsx";

export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl bg-[#050316]/80 border border-white/10 px-3.5 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 shadow-[0_0_0_1px_rgba(15,23,42,0.8)] focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-amber-300",
        className
      )}
      {...props}
    />
  );
}
