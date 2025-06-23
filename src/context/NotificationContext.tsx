import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  open: boolean;
  message: string;
  type: NotificationType;
  timestamp: number;
  duration: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationItem = ({ notification, onClose }: {
  notification: Notification;
  onClose: (id: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStyles = (type: NotificationType) => {
    const baseStyles = "backdrop-blur-sm border-l-4 shadow-lg";

    switch (type) {
      case 'success':
        return `${baseStyles} bg-emerald-50/90 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-100`;
      case 'error':
        return `${baseStyles} bg-red-50/90 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-100`;
      case 'warning':
        return `${baseStyles} bg-amber-50/90 dark:bg-amber-900/30 border-amber-500 text-amber-800 dark:text-amber-100`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50/90 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-100`;
    }
  };

  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef<NodeJS.Timeout>();
  
  // Calculate LED color based on time left (green -> yellow -> red)
  const getLedColor = (time: number) => {
    if (time > 3) return 'text-green-500';
    if (time > 1) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Add blinking effect for last second
  const getLedClass = (time: number) => {
    const baseClass = 'font-mono font-bold tracking-wider';
    const colorClass = getLedColor(time);
    const blinkClass = time <= 2 ? 'animate-pulse' : '';
    return `${baseClass} ${colorClass} ${blinkClass}`;
  };

  useEffect(() => {
    if (isVisible) {
      const endTime = notification.timestamp + notification.duration;
      
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.ceil((endTime - now) / 1000);
        setTimeLeft(Math.max(0, remaining));
        
        if (now < endTime) {
          timerRef.current = setTimeout(updateTimer, 200);
        }
      };
      
      updateTimer();
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isVisible, notification.timestamp, notification.duration]);

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  return (
    <div
      className={`
        notification-item
        relative overflow-hidden rounded-r-lg p-4 mb-3 w-full max-w-sm
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getStyles(notification.type)}
        hover:shadow-lg group cursor-pointer
        shadow-md
      `}
      style={{
        zIndex: 9999,
        position: 'relative',
        willChange: 'transform, opacity'
      }}
      onClick={handleClose}
    >
      <div className="relative flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-1.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm">
            {getIcon(notification.type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">
            {notification.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="flex-shrink-0 rounded-full p-1 -mr-1 hover:bg-black/5 dark:hover:bg-white/10 
                    transition-colors duration-150 opacity-70 hover:opacity-100"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar with timer */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5 dark:bg-white/10 overflow-hidden">
        <div className="flex items-center h-full">
          <div 
            className="h-full bg-current/80 animate-progress"
            style={{
              animation: 'progress 5s linear forwards'
            }}
          />
          <div className="relative flex items-center justify-center w-12 h-5 ml-1 rounded bg-black/20 dark:bg-white/10">
            <span className={`absolute inset-0 rounded opacity-20 ${getLedColor(timeLeft).replace('text-', 'bg-')}`}></span>
            <span className={getLedClass(timeLeft)}>
              {timeLeft}
              <span className="text-[8px] ml-0.5">s</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType = 'info', customDuration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = customDuration || 5000; // 5 seconds default
    const newNotification: Notification = {
      id,
      open: true,
      message,
      type,
      timestamp: Date.now(),
      duration,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Notification Container - Highest z-index to ensure it's always on top */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 w-full max-w-sm px-4 sm:px-0">
        {/* Global styles for notification container */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .notification-container {
              position: fixed;
              top: 1rem;
              right: 1rem;
              z-index: 9999;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }
            .notification-item {
              z-index: 9999 !important;
              position: relative !important;
              transform: translateZ(9999px) !important;
            }
          `
        }} />
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes progress {
          from { width: 100%; opacity: 1; }
          to { width: 0%; opacity: 0.7; }
        }
        
        .animate-progress {
          animation: progress 5s linear forwards;
          transform-origin: left;
        }
        
        .notification-item {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Demo Component
const NotificationDemo = () => {
  const { showNotification } = useNotification();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Modern Notification System
          </h1>
          <p className="text-slate-300 text-lg">
            Beautiful glassmorphism alerts with smooth animations
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6">Try the notifications</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => showNotification('Task completed successfully!', 'success')}
              className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Success
            </button>

            <button
              onClick={() => showNotification('Something went wrong. Please try again.', 'error')}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Error
            </button>

            <button
              onClick={() => showNotification('Please check your input before proceeding.', 'warning')}
              className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Warning
            </button>

            <button
              onClick={() => showNotification('This is an informational message.', 'info')}
              className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Info
            </button>
          </div>

          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-white font-medium mb-2">Features:</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Glassmorphism design with backdrop blur effects</li>
              <li>• Smooth slide-in animations from the right</li>
              <li>• Auto-dismiss after 5 seconds with progress bar</li>
              <li>• Hover effects and interactive close buttons</li>
              <li>• Multiple notification stacking</li>
              <li>• Responsive design with beautiful icons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <NotificationProvider>
      <NotificationDemo />
    </NotificationProvider>
  );
}
