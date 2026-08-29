import { AlertCircle, CheckCircle2, ShieldCheck, Sparkles, Tag, TicketPercent, X } from 'lucide-react'

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`

const Ordersummary = ({
  subtotal,
  discountedSubtotal,
  itemCount,
  deliveryFee,
  serviceFee,
  tax,
  tip,
  total,
  useCredit,
  deliveryMethod,
  couponCode,
  couponStatus,
  discountAmount,
  appliedCoupons,
  setCouponCode,
  setTip,
  setUseCredit,
  setDeliveryMethod,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  return (
    <div className='space-y-5'>
      <div className='rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.38)]'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-orange-50 p-2 text-orange-600'>
              <TicketPercent className='h-4 w-4' />
            </div>
            <p className='text-sm font-semibold text-slate-800'>Coupon code</p>
          </div>
          {appliedCoupons?.length ? <Sparkles className='h-4 w-4 text-emerald-500' /> : null}
        </div>

        <div className='flex gap-2 sm:flex-col'>
          <input
            type='text'
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder='Enter coupon code'
            className='h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100'
            onKeyDown={(event) => {
              if (event.key === 'Enter') onApplyCoupon()
            }}
            aria-label='Coupon code'
          />

          <button
            type='button'
            onClick={onApplyCoupon}
            className='h-11 rounded-xl bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200'
          >
            Apply
          </button>
        </div>

        {couponStatus?.message ? (
          <div
            className={`mt-3 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${
              couponStatus.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : couponStatus.type === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {couponStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{couponStatus.message}</span>
          </div>
        ) : null}

        {appliedCoupons?.length ? (
          <div className='mt-3 flex flex-wrap gap-2'>
            {appliedCoupons.map((code) => (
              <span
                key={code}
                className='inline-flex items-center gap-2 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-orange-100'
              >
                <Tag size={11} />
                {code}
                <button
                  type='button'
                  onClick={() => onRemoveCoupon(code)}
                  className='rounded-full p-0.5 transition hover:bg-orange-100'
                  aria-label={`Remove coupon ${code}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <aside className='rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.38)]'>
        <div className='mb-5 flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'>Your Order</p>
            <h2 className='mt-1 text-2xl font-bold text-slate-900'>Summary</h2>
          </div>
          <div className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600'>
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </div>
        </div>

        <div className='space-y-3 text-sm'>
          <div className='flex items-center justify-between text-slate-600'>
            <span>Subtotal</span>
            <span className='font-semibold text-slate-800'>{formatRupees(subtotal)}</span>
          </div>

          {discountAmount > 0 ? (
            <div className='flex items-center justify-between text-emerald-600'>
              <span>Discount</span>
              <span className='font-semibold'>-{formatRupees(discountAmount)}</span>
            </div>
          ) : null}

          <div className='flex items-center justify-between text-slate-600'>
            <span>Discounted subtotal</span>
            <span className='font-semibold text-slate-800'>{formatRupees(discountedSubtotal)}</span>
          </div>
        </div>

        <div className='my-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4'>
          <p className='mb-3 text-sm font-semibold text-slate-700'>Delivery</p>

          <label className='mb-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200'>
            <span className='flex items-center gap-2'>
              <input
                type='radio'
                name='delivery'
                checked={deliveryMethod === 'delivery'}
                onChange={() => setDeliveryMethod('delivery')}
                className='h-4 w-4 accent-orange-600'
              />
              Standard delivery
            </span>
            <span className='font-semibold'>{formatRupees(deliveryFee)}</span>
          </label>

          <div className='flex items-center justify-between gap-3'>
            <label className='flex cursor-pointer items-center gap-2 text-sm text-slate-700'>
              <input
                type='radio'
                name='delivery'
                checked={deliveryMethod === 'pickup'}
                onChange={() => setDeliveryMethod('pickup')}
                className='h-4 w-4 accent-orange-600'
              />
              Pick up
            </label>

            <select className='rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none transition focus:border-orange-400'>
              <option>Asap</option>
              <option>10 AM</option>
              <option>12 PM</option>
              <option>3 PM</option>
            </select>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <p className='text-sm font-semibold text-slate-700'>Optional tip</p>
            <span className='text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400'>Support</span>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            {[
              { value: 0, label: 'No tip' },
              { value: 20, label: 'Rs. 20' },
              { value: 40, label: 'Rs. 40' },
              { value: 70, label: 'Rs. 70' }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  tip === option.value ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <input
                  type='radio'
                  name='tip'
                  checked={tip === option.value}
                  onChange={() => setTip(option.value)}
                  className='h-4 w-4 accent-orange-600'
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className='mt-5 space-y-3 text-sm text-slate-600'>
          <div className='flex items-center justify-between'>
            <span>Service fee</span>
            <span className='font-semibold text-slate-800'>{formatRupees(serviceFee)}</span>
          </div>

          <div className='flex items-center justify-between'>
            <span>Tax</span>
            <span className='font-semibold text-slate-800'>{formatRupees(tax)}</span>
          </div>

          <label className='flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2'>
            <span className='flex items-center gap-2 text-slate-700'>
              <input
                type='checkbox'
                checked={useCredit}
                onChange={() => setUseCredit(!useCredit)}
                className='h-4 w-4 accent-orange-600'
              />
              Use credits
            </span>
            <span className='font-semibold text-slate-800'>-Rs. 80.00</span>
          </label>
        </div>

        <div className='mt-6 rounded-2xl bg-slate-900 p-4 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-300'>Total payable</p>
              <p className='mt-1 text-3xl font-bold tracking-tight'>{formatRupees(total)}</p>
            </div>
            <div className='rounded-full bg-white/10 p-2 text-orange-300'>
              <ShieldCheck className='h-5 w-5' />
            </div>
          </div>
        </div>

        <button className='mt-5 w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100'>
          Proceed to checkout
        </button>
      </aside>
    </div>
  )
}

export default Ordersummary
