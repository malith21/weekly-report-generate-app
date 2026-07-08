'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('team_member')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await register(name, email, password, role)
      router.push(user.role === 'manager' ? '/dashboard' : '/reports')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden fade-in-up">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-purple-300 dark:bg-purple-900 blur-3xl opacity-20 -z-10 animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-300 dark:bg-indigo-900 blur-3xl opacity-20 -z-10 animate-pulse duration-[8000ms]"></div>

      <div className="max-w-md w-full space-y-8 glass-card p-8 sm:p-10 border border-slate-100/50 shadow-2xl shadow-slate-100/40">
        <div>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white text-xl font-bold">📊</span>
            </div>
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Join the reporting dashboard and start tracking progress
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            
            <div>
              <label className="form-label">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:0.75rem] bg-[right_1rem_center] bg-no-repeat pr-10"
              >
                <option value="team_member">👤 Team Member</option>
                <option value="manager">👑 Manager (Dashboard Access)</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                'Register & Get Started'
              )}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link href="/login" className="font-semibold text-violet-600 hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
