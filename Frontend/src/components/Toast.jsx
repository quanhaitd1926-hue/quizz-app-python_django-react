import { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const styles = {
    success: { border: "border-brand-limeDim", icon: "✓", iconColor: "text-brand-lime" },
    error: { border: "border-brand-redDim",  icon: "✕", iconColor: "text-brand-red"  },
    info: { border: "border-brand-blueDim", icon: "ℹ", iconColor: "text-brand-blue" },
  };

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div className="fixed bottom-7 right-7 z-50 flex flex-col gap-3">
        {toasts.map((t) => {
          const s = styles[t.type] || styles.success;
          return (
            <div
              key={t.id}
              className={`animate-fade-up flex items-center gap-3 rounded-xl border bg-brand-card px-5 py-3.5 text-sm shadow-card ${s.border}`}
            >
              <span className={`text-base font-bold ${s.iconColor}`}>{s.icon}</span>
              <span className="text-brand-text">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);