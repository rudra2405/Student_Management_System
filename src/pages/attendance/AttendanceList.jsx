import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ConfirmDialog from '../../components/ConfirmDialog'
import { getAttendance, deleteAttendance } from '../../services/attendanceService'

export default function AttendanceList() {
  const [records,  setRecords]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [dateFilter, setDateFilter] = useState('')

  const fetchData = () => {
    setLoading(true)
    getAttendance().then(r => setRecords(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async () => {
    await deleteAttendance(deleteId)
    toast.success('Record deleted!')
    setDeleteId(null)
    fetchData()
  }

  const filtered = records.filter(r =>
    dateFilter ? r.date === dateFilter : true
  )

  const presentCount = filtered.filter(r => r.status === 'Present').length
  const absentCount  = filtered.filter(r => r.status === 'Absent').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{records.length} total records</p>
        </div>
        <Link to="/attendance/mark"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition text-sm text-center">
          + Mark Attendance
        </Link>
      </div>

      {/* Summary + Filter row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-3">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-green-600 dark:text-green-400">Present</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">{presentCount}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-red-600 dark:text-red-400">Absent</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-300">{absentCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-600 dark:text-gray-400">Filter by date:</label>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600
              bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-400" />
          {dateFilter && (
            <button onClick={() => setDateFilter('')}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕ Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-3xl">⏳</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p>No attendance records found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {['#','Student','Course','Date','Status','Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-5 py-4 text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{r.studentName}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{r.course}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{r.date}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                      ${r.status === 'Present'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                      {r.status === 'Present' ? '✅ Present' : '❌ Absent'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDeleteId(r.id)}
                      className="px-3 py-1.5 bg-red-50 dark:bg-red-900/40 text-red-600
                        dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <ConfirmDialog
          message="Delete this attendance record?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
