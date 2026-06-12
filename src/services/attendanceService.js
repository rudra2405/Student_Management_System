// import axios from 'axios'

// const BASE = 'http://localhost:3001/attendance'

// export const getAttendance  = ()         => axios.get(BASE)
// export const addAttendance  = (data)     => axios.post(BASE, data)
// export const deleteAttendance=(id)       => axios.delete(`${BASE}/${id}`)

const INITIAL_ATTENDANCE = [
  {
    id: 1,
    studentId: 1,
    studentName: "Raj Patel",
    course: "React JS",
    date: "2024-01-15",
    status: "Present",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Priya Shah",
    course: "Node JS",
    date: "2024-01-15",
    status: "Absent",
  },
  {
    id: 3,
    studentId: 3,
    studentName: "Amit Kumar",
    course: "Python",
    date: "2024-01-15",
    status: "Present",
  },
  {
    id: 4,
    studentId: 4,
    studentName: "Sneha Verma",
    course: "React JS",
    date: "2024-01-16",
    status: "Present",
  },
  {
    id: 5,
    studentId: 5,
    studentName: "Rohan Mehta",
    course: "Java",
    date: "2024-01-16",
    status: "Present",
  },
];

if (!localStorage.getItem("attendance")) {
  localStorage.setItem("attendance", JSON.stringify(INITIAL_ATTENDANCE));
}

const getAll = () => JSON.parse(localStorage.getItem("attendance")) || [];
const saveAll = (data) =>
  localStorage.setItem("attendance", JSON.stringify(data));

export const getAttendance = () => {
  return Promise.resolve({ data: getAll() });
};

export const addAttendance = (record) => {
  const all = getAll();
  const newRecord = { ...record, id: Date.now() };
  saveAll([...all, newRecord]);
  return Promise.resolve({ data: newRecord });
};

export const deleteAttendance = (id) => {
  const all = getAll();
  saveAll(all.filter((r) => r.id !== Number(id)));
  return Promise.resolve({});
};
