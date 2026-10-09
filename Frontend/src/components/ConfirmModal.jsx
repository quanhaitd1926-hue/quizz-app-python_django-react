export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm animate-fade-up rounded-2xl border border-brand-borderHi bg-brand-card p-8 text-center shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-5xl">🗑️</div>
        <h3 className="mb-2 font-display text-3xl tracking-widest text-brand-text">
          Confirm Delete
        </h3>
        <p className="mb-7 text-sm text-brand-muted">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-brand-borderHi bg-transparent px-5 py-2.5 text-sm font-semibold text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl border border-brand-redDim bg-brand-redDim px-5 py-2.5 text-sm font-semibold text-brand-red transition-all hover:bg-brand-red hover:text-white hover:shadow-[0_0_16px_rgba(255,59,78,0.35)]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}