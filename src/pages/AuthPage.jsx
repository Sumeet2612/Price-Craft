import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const initialForm = {
  name: '',
  email: '',
  password: ''
}

const AuthPage = () => {
  const navigate = useNavigate()
  const { user, login, signup, logout, isAuthenticated } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(initialForm)
      setError('')
    }
  }, [isAuthenticated, user])

  const heading = useMemo(() => mode === 'login' ? 'Welcome back' : 'Create account', [mode])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        login({ email: form.email, password: form.password })
      } else {
        signup({ name: form.name, email: form.email, password: form.password })
      }

      navigate('/')
    } catch (authError) {
      setError(authError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)]">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <UserRound className="h-8 w-8" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange-600">Account</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Hello, {user.name}</h1>
          <p className="mt-2 text-slate-600">{user.email}</p>

          <div className="mt-8 space-y-3">
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Continue shopping
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-orange-600">Access</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{heading}</h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <LockKeyhole className="h-7 w-7" />
          </div>
        </div>

        <div className="mb-6 inline-flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' ? (
            <label className="block text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Full name</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                <UserRound className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your name"
                  className="w-full border-0 bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </label>
          ) : null}

          <label className="block text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Email</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@example.com"
                className="w-full border-0 bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400"
                required
              />
            </div>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Password</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
              <LockKeyhole className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="••••••••"
                className="w-full border-0 bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400"
                required
              />
            </div>
          </label>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login to continue' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need to browse first?{' '}
          <Link to="/" className="font-semibold text-orange-600 transition hover:text-orange-700">
            Back to catalog
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthPage
