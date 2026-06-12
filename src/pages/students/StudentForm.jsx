import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getStudents, addStudent, updateStudent } from '../../services/studentService'

const COURSES = ['React JS', 'Node JS', 'Python', 'Java', 'Vue JS', 'Angular']
const empty = { name: '', email: '', phone: '', course: '', status: 'Active' }

export default function StudentForm() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const isEdit      = Boolean(id)
  const [form, setForm]     = useState(empty)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getStudents().then(r => {
        const s = r.data.find(s => s.id === Number(id))
        if (s) setForm(s)
      })
    }
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.name.trim())               e.name   = 'Name is required'
    if (!form.email.match(/\S+@\S+\.\S+/)) e.email = 'Valid email required'
    if (!form.phone.match(/^\d{10}$/))   e.phone  = '10-digit phone required'
    if (!form.course)                    e.course = 'Select a course'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      if (isEdit) {
        await updateStudent(id, form)
        toast.success('Student updated!')
      } else {
        await addStudent(form)
        toast.success('Student added!')
      }
      navigate('/students')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }) }}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
          bg-white dark:bg-gray-700 text-gray-800 dark:text-white
          focus:ring-2 focus:ring-indigo-400
          ${errors[key] ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`} />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? '✏️ Edit Student' : '➕ Add Student'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {isEdit ? 'Update student information' : 'Fill in details to add a new student'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        {field('name',  'Full Name',  'text',  'e.g. Raj Patel')}
        {field('email', 'Email',      'email', 'e.g. raj@gmail.com')}
        {field('phone', 'Phone',      'tel',   'e.g. 9876543210')}

        {/* Course dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
          <select value={form.course}
            onChange={e => { setForm({ ...form, course: e.target.value }); setErrors({ ...errors, course: '' }) }}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400
              ${errors.course ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}>
            <option value="">Select course</option>
            {COURSES.map(c => <option key={c}>{c}</option>)}
          </select>
          {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <div className="flex gap-4">
            {['Active', 'Inactive'].map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value={s} checked={form.status === s}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="accent-indigo-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
              text-white py-2.5 rounded-xl font-medium transition text-sm">
            {saving ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
          </button>
          <button onClick={() => navigate('/students')}
            className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700
              dark:text-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50
              dark:hover:bg-gray-700 transition text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
