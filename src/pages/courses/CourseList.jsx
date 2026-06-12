import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ConfirmDialog from '../../components/ConfirmDialog'
import { getCourses, deleteCourse } from '../../services/courseService'

export default function CourseList() {
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [search,   setSearch]   = useState('')

  const fetchCourses = () => {
    setLoading(true)
    getCourses().then(r => setCourses(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCourses() }, [])

  const handleDelete = async () => {
    await deleteCourse(deleteId)
    toast.success('Course deleted!')
    setDeleteId(null)
    fetchCourses()
  }

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{courses.length} total courses</p>
        </div>
        <Link to="/courses/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition text-sm text-center">
          + Add Course
        </Link>
      </div>

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search courses..."
          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-400" />
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-3xl">⏳</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📚</div>
          <p>No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{c.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${c.status === 'Active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {c.status}
                  </span>
                </div>
                <span className="text-2xl">📚</span>
              </div>
              <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <p>⏱ Duration: <span className="font-medium text-gray-700 dark:text-gray-200">{c.duration}</span></p>
                <p>💰 Fees: <span className="font-medium text-gray-700 dark:text-gray-200">₹{c.fees.toLocaleString()}</span></p>
                <p>🪑 Seats: <span className="font-medium text-gray-700 dark:text-gray-200">{c.seats}</span></p>
              </div>
              <div className="flex gap-2">
                <Link to={`/courses/edit/${c.id}`}
                  className="flex-1 text-center px-3 py-1.5 bg-orange-50 dark:bg-orange-900/40 text-orange-600
                    dark:text-orange-300 rounded-lg text-xs font-medium hover:bg-orange-100 transition">
                  ✏️ Edit
                </Link>
                <button onClick={() => setDeleteId(c.id)}
                  className="flex-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/40 text-red-600
                    dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this course?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
