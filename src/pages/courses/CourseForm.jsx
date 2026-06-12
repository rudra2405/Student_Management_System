import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getCourses, addCourse, updateCourse } from '../../services/courseService'

const empty = { name: '', duration: '', fees: '', seats: '', status: 'Active' }

export default function CourseForm() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const isEdit      = Boolean(id)
  const [form, setForm]     = useState(empty)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getCourses().then(r => {
        const c = r.data.find(c => c.id === Number(id))
        if (c) setForm(c)
      })
    }
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Course name is required'
    if (!form.duration.trim()) e.duration = 'Duration is required'
    if (!form.fees || form.fees <= 0)  e.fees  = 'Valid fees required'
    if (!form.seats || form.seats <= 0) e.seats = 'Valid seats required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const payload = { ...form, fees: Number(form.fees), seats: Number(form.seats) }
      if (isEdit) { await updateCourse(id, payload); toast.success('Course updated!') }
      else        { await addCourse(payload);         toast.success('Course added!')   }
      navigate('/courses')
    } catch { toast.error('Something went wrong') }
    finally { setSaving(false) }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }) }}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
          bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-400
          ${errors[key] ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`} />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEdit ? '✏️ Edit Course' : '➕ Add Course'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {isEdit ? 'Update course details' : 'Fill in details to add a new course'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        {field('name',     'Course Name',    'text',   'e.g. React JS')}
        {field('duration', 'Duration',       'text',   'e.g. 3 Months')}
        {field('fees',     'Fees (₹)',       'number', 'e.g. 15000')}
        {field('seats',    'Total Seats',    'number', 'e.g. 30')}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <div className="flex gap-4">
            {['Active', 'Inactive'].map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value={s} checked={form.status === s}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="accent-orange-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300
              text-white py-2.5 rounded-xl font-medium transition text-sm">
            {saving ? 'Saving...' : isEdit ? 'Update Course' : 'Add Course'}
          </button>
          <button onClick={() => navigate('/courses')}
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
