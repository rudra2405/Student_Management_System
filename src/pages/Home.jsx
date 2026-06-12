import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { getStudents } from '../services/studentService'
import { getCourses } from '../services/courseService'
import { getAttendance } from '../services/attendanceService'

export default function Home() {
  const [students,   setStudents]   = useState([])
  const [courses,    setCourses]    = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([getStudents(), getCourses(), getAttendance()])
      .then(([s, c, a]) => {
        setStudents(s.data)
        setCourses(c.data)
        setAttendance(a.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const presentCount = attendance.filter(a => a.status === 'Present').length
  const activeStudents = students.filter(s => s.status === 'Active').length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin text-4xl">⏳</div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome to Student Management System</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🎓" label="Total Students"  value={students.length}   color="indigo" />
        <StatCard icon="✅" label="Active Students" value={activeStudents}     color="green"  />
        <StatCard icon="📚" label="Total Courses"   value={courses.length}    color="orange" />
        <StatCard icon="📋" label="Present Today"   value={presentCount}      color="purple" />
      </div>

      {/* Recent Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white text-lg">Recent Students</h2>
          <Link to="/students"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {['Name','Email','Course','Status','Action'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {students.slice(0, 5).map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{s.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{s.email}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{s.course}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${s.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to="/students" className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/students/add', icon: '➕', label: 'Add New Student',    color: 'bg-indigo-500 hover:bg-indigo-600' },
          { to: '/courses',      icon: '📚', label: 'Manage Courses',     color: 'bg-orange-500 hover:bg-orange-600' },
          { to: '/attendance',   icon: '📋', label: 'Mark Attendance',    color: 'bg-purple-500 hover:bg-purple-600' },
        ].map(q => (
          <Link key={q.to} to={q.to}
            className={`${q.color} text-white rounded-2xl p-5 flex items-center gap-3 font-medium transition shadow-sm`}>
            <span className="text-2xl">{q.icon}</span>
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
