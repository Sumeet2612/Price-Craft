import React from 'react'
import { ArrowUpRight, Camera, Mail, MapPin, ShieldCheck, Truck } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    Shop: ['New Arrivals', 'Best Sellers', 'Accessories', 'Gift Cards'],
    Support: ['Shipping', 'Returns', 'Care Guide', 'Contact'],
    Company: ['About', 'Journal', 'Sustainability', 'Privacy'],
  }

  return (
    <footer className='mt-16 border-t border-slate-200 bg-white/80'>
      <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]'>
          <div>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-lg font-bold text-orange-700'>P</div>
              <div>
                <p className='text-lg font-bold tracking-tight text-slate-900'>Price-Craft</p>
                <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>Curated essentials</p>
              </div>
            </div>

            <p className='mt-4 max-w-sm text-sm leading-6 text-slate-600'>
              Premium everyday essentials designed for movement, comfort, and confident living.
            </p>

            <div className='mt-5 flex flex-wrap gap-3 text-sm text-slate-600'>
              <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5'>
                <Truck className='h-4 w-4 text-orange-600' />
                Next-day dispatch
              </div>
              <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5'>
                <ShieldCheck className='h-4 w-4 text-emerald-600' />
                Secure checkout
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className='text-sm font-semibold uppercase tracking-[0.14em] text-slate-500'>{section}</p>
              <ul className='mt-4 space-y-2 text-sm text-slate-600'>
                {links.map((link) => (
                  <li key={link}>
                    <a href='#' className='transition hover:text-slate-900'> {link} </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.14em] text-slate-500'>Contact</p>
            <ul className='mt-4 space-y-3 text-sm text-slate-600'>
              <li className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-orange-600' />
                hello@pricecraft.in
              </li>
              <li className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-orange-600' />
                Mumbai, India
              </li>
              <li className='flex items-center gap-2'>
                <Camera className='h-4 w-4 text-orange-600' />
                @pricecraft
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 flex flex-col gap-4 border-t border-slate-200 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
          <p>© 2026 Price-Craft. All rights reserved.</p>
          <div className='flex items-center gap-2'>
            <span>Made for modern living</span>
            <ArrowUpRight className='h-4 w-4 text-slate-400' />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
