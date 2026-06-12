// import axios from 'axios'

// const BASE = 'http://localhost:3001/students'

// export const getStudents  = ()         => axios.get(BASE)
// export const addStudent   = (data)     => axios.post(BASE, data)
// export const updateStudent= (id, data) => axios.put(`${BASE}/${id}`, data)
// export const deleteStudent= (id)       => axios.delete(`${BASE}/${id}`)

// Dummy starting data — loads on first visit only
const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "Raj Patel",
    email: "raj@gmail.com",
    phone: "9876543210",
    course: "React JS",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Shah",
    email: "priya@gmail.com",
    phone: "9876543211",
    course: "Node JS",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@gmail.com",
    phone: "9876543212",
    course: "Python",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sneha Verma",
    email: "sneha@gmail.com",
    phone: "9876543213",
    course: "React JS",
    status: "Active",
  },
  {
    id: 5,
    name: "Rohan Mehta",
    email: "rohan@gmail.com",
    phone: "9876543214",
    course: "Java",
    status: "Active",
  },
];

// Run once — if localStorage empty, load dummy data
if (!localStorage.getItem("students")) {
  localStorage.setItem("students", JSON.stringify(INITIAL_STUDENTS));
}

// Helpers
const getAll = () => JSON.parse(localStorage.getItem("students")) || [];
const saveAll = (data) =>
  localStorage.setItem("students", JSON.stringify(data));

// These replace axios calls — same function names so pages don't change
export const getStudents = () => {
  return Promise.resolve({ data: getAll() });
};

export const addStudent = (student) => {
  const all = getAll();
  const newStudent = { ...student, id: Date.now() }; // id = timestamp (always unique)
  saveAll([...all, newStudent]);
  return Promise.resolve({ data: newStudent });
};

export const updateStudent = (id, student) => {
  const all = getAll();
  const updated = all.map((s) =>
    s.id === Number(id) ? { ...s, ...student } : s,
  );
  saveAll(updated);
  return Promise.resolve({ data: student });
};

export const deleteStudent = (id) => {
  const all = getAll();
  saveAll(all.filter((s) => s.id !== Number(id)));
  return Promise.resolve({});
};
