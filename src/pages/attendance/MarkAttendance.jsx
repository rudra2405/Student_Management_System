import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getStudents } from '../../services/studentService'
import { addAttendance } from '../../services/attendanceService'

export default function MarkAttendance() {
  const navigate  = useNavigate()
  const [students, setStudents] = useState([])
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0])
  const [marks,    setMarks]    = useState({})   // { studentId: 'Present' | 'Absent' }
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    getStudents().then(r => {
      setStudents(r.data.filter(s => s.status === 'Active'))
    })
  }, [])

  const toggle = (id, status) => setMarks(prev => ({ ...prev, [id]: status }))

  const handleSave = async () => {
    if (Object.keys(marks).length === 0) {
      toast.error('Mark at least one student')
      return
    }
    setSaving(true)
    try {
      const promises = Object.entries(marks).map(([studentId, status]) => {
        const student = students.find(s => s.id === Number(studentId))
        return addAttendance({
          studentId: Number(studentId),
          studentName: student.name,
          course: student.course,
          date,
          status,
        })
      })
      await Promise.all(promises)
      toast.success('Attendance marked!')
      navigate('/attendance')
    } catch { toast.error('Something went wrong') }
    finally { setSaving(false) }
  }

  const allPresent = () => {
    const all = {}
    students.forEach(s => { all[s.id] = 'Present' })
    setMarks(all)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Mark Attendance</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Mark attendance for active students</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {/* Date + All Present */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <button onClick={allPresent}
            className="sm:ml-auto text-sm bg-green-50 dark:bg-green-900/40 text-green-600
              dark:text-green-300 px-4 py-2 rounded-xl hover:bg-green-100 transition font-medium">
            ✅ Mark All Present
          </button>
        </div>

        {/* Student rows */}
        <div className="space-y-3">
          {students.map(s => (
            <div key={s.id}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">{s.name}</p>
                <p className="text-xs text-gray-400">{s.course}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(s.id, 'Present')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${marks[s.id] === 'Present'
                      ? 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}`}>
                  ✅ Present
                </button>
                <button onClick={() => toggle(s.id, 'Absent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${marks[s.id] === 'Absent'
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}`}>
                  ❌ Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {Object.keys(marks).length} / {students.length} marked
          </span>
          <div className="flex gap-3">
            <button onClick={() => navigate('/attendance')}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700
                dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400
                text-white font-medium transition">
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
