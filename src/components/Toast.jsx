import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { useCart } from '../context/CartContext'

const toastStyles = {
  success: {
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600'
  },
  error: {
    accent: 'border-red-200 bg-red-50 text-red-700',
    icon: AlertCircle,
    iconClass: 'text-red-600'
  },
  warning: {
    accent: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: TriangleAlert,
    iconClass: 'text-amber-600'
  },
  info: {
    accent: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Info,
    iconClass: 'text-sky-600'
  }
}

const Toast = () => {
  const { toast, setToast } = useCart()

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timeoutId)
  }, [setToast, toast])

  if (!toast) return null

  const payload = typeof toast === 'string'
    ? { type: 'success', message: toast }
    : { type: 'info', ...toast }

  const style = toastStyles[payload.type] || toastStyles.info
  const Icon = style.icon

  return (
    <div className='pointer-events-none fixed bottom-5 right-5 z-[1200] animate-[fadeIn_0.2s_ease-out]'>
      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_24px_-16px_rgba(15,23,42,0.5)] backdrop-blur-sm ${style.accent}`}>
        <div className='flex h-7 w-7 items-center justify-center rounded-full bg-white/70'>
          <Icon size={15} className={style.iconClass} />
        </div>
        <span className='text-sm font-medium'>{payload.message}</span>
      </div>
    </div>
  )
}

export default Toast
