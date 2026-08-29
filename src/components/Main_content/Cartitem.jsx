import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`

const Cartitem = ({ items, onIncrement, onDecrement, onRemove }) => {
  if (!items.length) {
    return (
      <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center'>
        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm'>
          <ShoppingBag className='h-5 w-5' />
        </div>
        <p className='text-base font-semibold text-slate-800'>Your cart is empty</p>
        <p className='mt-1 text-sm text-slate-500'>Add a product from the catalog to continue shopping.</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {items.map((elem, index) => {
        const discountedPrice = Math.round(elem.originalPrice * (1 - elem.discountPercent / 100))

        return (
          <div
            key={elem.id}
            className={`flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.28)] transition duration-200 hover:border-orange-200 hover:shadow-[0_18px_30px_-24px_rgba(234,88,12,0.25)] sm:flex-row sm:items-center ${
              index !== items.length - 1 ? '' : ''
            }`}
          >
            <div className='overflow-hidden rounded-xl bg-slate-100'>
              <img src={elem.img} alt={elem.name} className='h-28 w-28 object-cover transition duration-300 hover:scale-[1.04] sm:h-32 sm:w-32' />
            </div>

            <div className='flex-1'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                  <p className='text-base font-semibold text-slate-900'>{elem.name}</p>
                  <p className='text-xs font-medium uppercase tracking-[0.14em] text-slate-400'>{elem.category}</p>
                </div>
                <button
                  type='button'
                  onClick={() => onRemove(elem.id)}
                  className='inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                  aria-label={`Remove ${elem.name}`}
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>

              <div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                <span className='rounded-full bg-slate-100 px-2 py-1'>Color: {elem.color}</span>
                <span className='rounded-full bg-slate-100 px-2 py-1'>Size: {elem.size}</span>
              </div>

              <div className='mt-3 flex flex-wrap items-center gap-2'>
                <span className='text-sm text-slate-400 line-through'>{formatRupees(elem.originalPrice)}</span>
                <span className='text-lg font-bold text-slate-900'>{formatRupees(discountedPrice)}</span>
                <span className='rounded-full bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-700'>
                  {elem.discountPercent}% off
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-2 sm:min-w-[164px] sm:flex-col sm:items-end sm:justify-center'>
              <p className='text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 sm:hidden'>Qty</p>
              <div className='flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm'>
                <button
                  type='button'
                  onClick={() => onDecrement(elem.id)}
                  className='flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100'
                  aria-label={`Decrease quantity of ${elem.name}`}
                >
                  <Minus size={12} />
                </button>
                <span className='min-w-5 text-center text-sm font-semibold text-slate-800'>{elem.quantity}</span>
                <button
                  type='button'
                  onClick={() => onIncrement(elem.id)}
                  className='flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-900 text-white transition hover:bg-slate-700'
                  aria-label={`Increase quantity of ${elem.name}`}
                >
                  <Plus size={12} />
                </button>
              </div>
              <p className='text-sm font-semibold text-slate-900 sm:mt-2'>
                {formatRupees(discountedPrice * elem.quantity)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Cartitem
