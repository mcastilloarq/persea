import { useState, createContext, useContext, useEffect } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('warning');

  const toast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setIsToastOpen(true);
  };

  const resetToast = () => {
    setToastMessage('');
    setToastType('warning');
    setIsToastOpen(false);
  };

  const toastColor = {
    success: 'emerald',
    warning: 'yellow',
    danger: 'red',
  }[toastType];

  useEffect(() => {
    if (isToastOpen) {
      const timeout = setTimeout(() => {
        resetToast();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isToastOpen]);

  return (
    <ToastContext.Provider value={{ toast }}>
      { children }
      {isToastOpen && (
        <div className={`text-white p-4 border-0 rounded absolute bottom-0 right-0 mb-4 mr-4 bg-${toastColor}-500 flex items-center`}>
          <span className="text-xl inline-block mr-5 align-middle pr-4">
            <i className="fas fa-bell"></i>
          </span>
          <span className="inline-block align-middle mr-8">
            {toastMessage}
          </span>
          <button className="bg-transparent text-2xl font-semibold leading-none right-0 top-0 mr-6 pl-4 outline-none focus:outline-none"
            onClick={resetToast}
          >
            <span>×</span>
          </button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error ('useToast must be used within a I18NProvicer')
  }

  return context
}
