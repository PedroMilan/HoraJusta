import * as React from "react";
import { cn } from "./utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={cn(
        "px-4 py-2 rounded-lg shadow-lg transition-all duration-300",
        typeStyles[type]
      )}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}