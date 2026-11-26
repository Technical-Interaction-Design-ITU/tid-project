import { useCallback, useState } from "react";
import Toast from "../components/Toast.jsx";
import { ToastContext } from "../hooks/useToast.js";

// Renders one Toast for the whole app and lets any child show it via useToast().
// Because it lives above the routes, a toast stays visible when the page changes.
export default function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // useCallback keeps the same function between renders,
  // so components can safely use it in effects / dependency arrays.
  const showToast = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  // Only set open to false: message and severity stay while the Toast fades out.
  const handleClose = () => setToast((t) => ({ ...t, open: false }));

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
}
