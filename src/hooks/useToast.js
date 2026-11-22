import { createContext, useContext } from "react";

// Shared between ToastProvider (which fills it) and useToast (which reads it).
export const ToastContext = createContext(null);

// Show a global toast from any page or component inside <ToastProvider>.
// Usage:
//   const showToast = useToast();
//   showToast("Record added");             // success (default)
//   showToast("Could not save", "error");  // "success" | "info" | "warning" | "error"
export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return showToast;
}
