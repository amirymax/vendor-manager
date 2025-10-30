import { useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, title, onClose, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Close on overlay click (but ignore clicks inside panel)
  function onOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Keep mounted for transition? — here we unmount when closed for simplicity
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={panelRef}
        className="w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl
                   transition-all duration-200 ease-out
                   opacity-0 scale-95 animate-[modalIn_200ms_ease-out_forwards]"
      >
        <div className="px-5 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>

      {/* keyframes (scoped via tailwind arbitrary value) */}
      <style>{`
        @keyframes modalIn { 
          to { opacity: 1; transform: none; } 
        }
      `}</style>
    </div>
  );
}
