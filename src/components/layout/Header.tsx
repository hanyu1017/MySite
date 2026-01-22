'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Menu, X, LogOut, BarChart } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = session && session.user?.role === 'ADMIN'

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            MySite
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/#about" className="text-gray-600 hover:text-gray-900 transition">
              關於我
            </Link>
            <Link href="/#projects" className="text-gray-600 hover:text-gray-900 transition">
              專案展示
            </Link>
            <Link href="/#contact" className="text-gray-600 hover:text-gray-900 transition">
              聯絡方式
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <BarChart size={18} />
                  分析
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <LogOut size={18} />
                  登出
                </button>
              </>
            )}

            {!session && (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                登入
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              href="/#about"
              className="block text-gray-600 hover:text-gray-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              關於我
            </Link>
            <Link
              href="/#projects"
              className="block text-gray-600 hover:text-gray-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              專案展示
            </Link>
            <Link
              href="/#contact"
              className="block text-gray-600 hover:text-gray-900 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              聯絡方式
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/dashboard/analytics"
                  className="block text-gray-600 hover:text-gray-900 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  分析
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 transition"
                >
                  登出
                </button>
              </>
            )}

            {!session && (
              <Link
                href="/login"
                className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                登入
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
