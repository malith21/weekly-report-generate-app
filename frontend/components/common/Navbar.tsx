'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="glass-card rounded-2xl mx-auto max-w-7xl border border-slate-200/50 shadow-lg shadow-slate-100/30 bg-white/70 backdrop-blur-md mt-4 sticky top-4 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200 group-hover:scale-105 transition-transform">
                <span className="text-white text-base">📊</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 group-hover:opacity-90 transition-opacity">
                Weekly<span className="gradient-text">Reports</span>
              </span>
            </Link>
            
            {/* Logged in Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center gap-1">
                {user.role === 'manager' && (
                  <Link 
                    href="/dashboard"
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/dashboard')
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>📈</span>
                    Dashboard
                  </Link>
                )}
                <Link 
                  href="/reports"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/reports') || isActive('/reports/new') || pathname.startsWith('/reports/')
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>📋</span>
                  My Reports
                </Link>
              </div>
            )}
          </div>

          {/* User Info / Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3 border-r border-slate-100 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-violet-100">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-sm font-bold text-slate-700">{user.name}</p>
                    <span className={`inline-block text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${
                      user.role === 'manager' 
                        ? 'bg-violet-100 text-violet-700' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {user.role === 'manager' ? '👑 Manager' : '👤 Member'}
                    </span>
                  </div>
                </div>
                
                {/* Mobile visible links */}
                <div className="flex md:hidden gap-2">
                  {user.role === 'manager' && (
                    <Link
                      href="/dashboard"
                      className={`p-2 rounded-lg ${isActive('/dashboard') ? 'bg-violet-50 text-violet-700' : 'text-slate-600'}`}
                      title="Dashboard"
                    >
                      📈
                    </Link>
                  )}
                  <Link
                    href="/reports"
                    className={`p-2 rounded-lg ${isActive('/reports') ? 'bg-violet-50 text-violet-700' : 'text-slate-600'}`}
                    title="My Reports"
                  >
                    📋
                  </Link>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-all duration-200 border border-red-100/50 hover:shadow-sm"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary py-2 px-4.5 text-sm font-semibold shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}