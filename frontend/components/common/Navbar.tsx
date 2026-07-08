'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="glass-card rounded-none rounded-b-2xl mx-4 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">📊</span>
              </div>
              <span className="text-xl font-bold gradient-text">Weekly Reports</span>
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center gap-4">
                {user.role === 'manager' && (
                  <Link 
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    <span>📈</span>
                    Dashboard
                  </Link>
                )}
                <Link 
                  href="/reports"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  <span>📋</span>
                  My Reports
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">{user.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'manager' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'manager' ? '👑 Manager' : '👤 Team Member'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary px-4 py-2 text-sm"
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