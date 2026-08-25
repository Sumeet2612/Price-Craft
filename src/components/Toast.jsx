import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Toast = () => {
  const { toast, setToast } = useCart()

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timeoutId)
  }, [setToast, toast])

  if (!toast) return null

  return (
    <div className="fixed bottom-6 right-6 z-[1100] flex items-center gap-2 rounded-md bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
      <CheckCircle2 size={16} className="text-green-400" />
      {toast}
    </div>
  )
}

export default Toast
