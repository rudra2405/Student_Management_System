import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'

import Home            from './pages/Home'
import StudentList     from './pages/students/StudentList'
import StudentForm     from './pages/students/StudentForm'
import CourseList      from './pages/courses/CourseList'
import CourseForm      from './pages/courses/CourseForm'
import AttendanceList  from './pages/attendance/AttendanceList'
import MarkAttendance  from './pages/attendance/MarkAttendance'

export default function App() {
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar dark={dark} setDark={setDark} />
        <main>
          <Routes>
            <Route path="/"                   element={<Home />} />

            {/* Students */}
            <Route path="/students"           element={<StudentList />} />
            <Route path="/students/add"       element={<StudentForm />} />
            <Route path="/students/edit/:id"  element={<StudentForm />} />

            {/* Courses */}
            <Route path="/courses"            element={<CourseList />} />
            <Route path="/courses/add"        element={<CourseForm />} />
            <Route path="/courses/edit/:id"   element={<CourseForm />} />

            {/* Attendance */}
            <Route path="/attendance"         element={<AttendanceList />} />
            <Route path="/attendance/mark"    element={<MarkAttendance />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' }
        }} />
      </div>
    </div>
  )
}
