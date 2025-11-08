import React, { useState, useEffect } from 'react';

// Simple class name merging function
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white'
};

const Toast: React.FC<ToastProps> = ({
  message, 
  type = 'info', 
  duration = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div 
      className={cn(
        "fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg",
        "transform transition-all duration-300 ease-in-out",
        toastStyles[type]
      )}
    >
      {message}
    </div>
  );
};

// Utility hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const newToast: ToastProps = {
      ...toast,
      onClose: () => removeToast(toast)
    };
    setToasts(currentToasts => [...currentToasts, newToast]);
  };

  const removeToast = (toastToRemove: Omit<ToastProps, 'onClose'>) => {
    setToasts(currentToasts => 
      currentToasts.filter(toast => 
        toast.message !== toastToRemove.message || 
        toast.type !== toastToRemove.type
      )
    );
  };

  const ToastContainer: React.FC = () => (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </div>
  );

  return { addToast, removeToast, ToastContainer };
};

export default Toast;