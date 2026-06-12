import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/',           label: '🏠 Dashboard' },
  { to: '/students',   label: '🎓 Students'  },
  { to: '/courses',    label: '📚 Courses'   },
  { to: '/attendance', label: '📋 Attendance'},
]

export default function Navbar({ dark, setDark }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-indigo-700 dark:bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <span className="font-bold text-xl tracking-wide">🎓 SMS</span>

        {/* Desktop links */}
        <div className="hidden md:flex gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${pathname === l.to
                  ? 'bg-white text-indigo-700'
                  : 'hover:bg-indigo-600 dark:hover:bg-gray-700'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button onClick={() => setDark(!dark)}
            className="p-2 rounded-lg hover:bg-indigo-600 dark:hover:bg-gray-700 text-lg">
            {dark ? '☀️' : '🌙'}
          </button>
          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-indigo-800 dark:bg-gray-800 px-4 pb-3 flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium
                ${pathname === l.to ? 'bg-white text-indigo-700' : 'hover:bg-indigo-700'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
