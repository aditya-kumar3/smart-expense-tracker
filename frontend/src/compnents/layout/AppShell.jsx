// src/compnents/layout/AppShell.jsx

function AppShell({ children, showGrid = true }) {
  return (
    <div className="min-h-screen bg-[#02010a] text-slate-50 relative overflow-hidden">
      {/* Gold + amber glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.25),transparent_60%),radial-gradient(circle_at_bottom,_rgba(248,113,113,0.18),transparent_65%),radial-gradient(circle_at_center,_rgba(15,23,42,0.9),transparent_70%)]" />

      {/* Subtle grid */}
      {showGrid && (
        <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] [background-size:44px_44px]" />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AppShell;
