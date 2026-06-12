import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ConfirmDialog from '../../components/ConfirmDialog'
import { getStudents, deleteStudent } from '../../services/studentService'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  const fetchStudents = () => {
    setLoading(true)
    getStudents()
      .then(r => setStudents(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStudents() }, [])

  const handleDelete = async () => {
    await deleteStudent(deleteId)
    toast.success('Student deleted!')
    setDeleteId(null)
    fetchStudents()
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Students</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{students.length} total students</p>
        </div>
        <Link to="/students/add"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition text-sm text-center">
          + Add Student
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name or course..."
          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm outline-none
            focus:ring-2 focus:ring-indigo-400" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-3xl">⏳</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🎓</div>
            <p>No students found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {['#','Name','Email','Phone','Course','Status','Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-5 py-4 text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{s.name}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{s.email}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{s.phone}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{s.course}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                      ${s.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link to={`/students/edit/${s.id}`}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600
                          dark:text-indigo-300 rounded-lg text-xs font-medium hover:bg-indigo-100 transition">
                        ✏️ Edit
                      </Link>
                      <button onClick={() => setDeleteId(s.id)}
                        className="px-3 py-1.5 bg-red-50 dark:bg-red-900/40 text-red-600
                          dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this student?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
