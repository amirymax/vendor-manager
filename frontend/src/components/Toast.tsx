import { useEffect } from "react";

type ToastProps = {
  open: boolean;
  title?: string;
  message?: string;
  kind?: "success" | "error" | "info";
  onClose: () => void;
  durationMs?: number; // auto-hide
};

export function Toast({
  open,
  title,
  message,
  kind = "info",
  onClose,
  durationMs = 2500,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, durationMs);
    return () => clearTimeout(id);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  const palette =
    kind === "success"
      ? "bg-emerald-600"
      : kind === "error"
      ? "bg-rose-600"
      : "bg-slate-700";

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute bottom-6 right-6">
        <div
          className={`pointer-events-auto ${palette} text-white rounded-lg shadow-lg px-4 py-3 min-w-[260px]
                      opacity-0 translate-y-2 animate-[toastIn_180ms_ease-out_forwards]`}
          role="status"
          aria-live="polite"
        >
          {title && <div className="font-semibold text-sm">{title}</div>}
          {message && <div className="text-sm/5 opacity-90">{message}</div>}
          <button
            onClick={onClose}
            className="absolute top-1.5 right-2 text-white/80 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      <style>{`
        @keyframes toastIn { to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
