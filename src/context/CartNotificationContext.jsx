import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartNotificationContext = createContext(null)

const ALERT_STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-violet-200 bg-violet-50 text-violet-800',
}

function CartNotificationAlert({ notification, onDismiss }) {
  const style = ALERT_STYLES[notification.type] || ALERT_STYLES.info

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${style}`}
    >
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        className="rounded-full px-2 py-0.5 text-xs font-semibold opacity-70 transition hover:opacity-100"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}

export function CartNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const dismissNotification = useCallback((id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id))
  }, [])

  const showCartNotification = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      setNotifications((current) => [...current, { id, message, type }])

      window.setTimeout(() => {
        dismissNotification(id)
      }, 4000)
    },
    [dismissNotification],
  )

  const value = useMemo(
    () => ({ showCartNotification }),
    [showCartNotification],
  )

  return (
    <CartNotificationContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3"
      >
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto animate-[slideIn_0.25s_ease-out]">
            <CartNotificationAlert notification={notification} onDismiss={dismissNotification} />
          </div>
        ))}
      </div>
    </CartNotificationContext.Provider>
  )
}

export function useCartNotification() {
  const context = useContext(CartNotificationContext)

  if (!context) {
    throw new Error('useCartNotification must be used within CartNotificationProvider')
  }

  return context
}
