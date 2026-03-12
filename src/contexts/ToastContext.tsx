import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border animate-in slide-in-from-right-10 fade-in duration-500 min-w-[320px] max-w-md ${
              toast.type === 'success' ? 'bg-white border-green-100' :
              toast.type === 'error' ? 'bg-white border-red-100' :
              toast.type === 'warning' ? 'bg-white border-amber-100' :
              'bg-white border-slate-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-green-50 text-green-500' :
              toast.type === 'error' ? 'bg-red-50 text-red-500' :
              toast.type === 'warning' ? 'bg-amber-50 text-amber-500' :
              'bg-slate-50 text-legal-gold'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'warning' && <AlertTriangle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-0.5">
                    {toast.type === 'success' ? 'Operation Success' : 
                     toast.type === 'error' ? 'Security Alert' : 
                     toast.type === 'warning' ? 'System Warning' : 'Information'}
                </p>
                <p className="text-sm font-bold text-slate-700">{toast.message}</p>
            </div>
            <button 
                onClick={() => removeToast(toast.id)}
                className="text-slate-200 hover:text-slate-400 p-1"
            >
                <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
