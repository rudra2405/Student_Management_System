// import axios from 'axios'

// const BASE = 'http://localhost:3001/courses'

// export const getCourses  = ()         => axios.get(BASE)
// export const addCourse   = (data)     => axios.post(BASE, data)
// export const updateCourse= (id, data) => axios.put(`${BASE}/${id}`, data)
// export const deleteCourse= (id)       => axios.delete(`${BASE}/${id}`)

const INITIAL_COURSES = [
  {
    id: 1,
    name: "React JS",
    duration: "3 Months",
    fees: 15000,
    seats: 30,
    status: "Active",
  },
  {
    id: 2,
    name: "Node JS",
    duration: "2 Months",
    fees: 12000,
    seats: 25,
    status: "Active",
  },
  {
    id: 3,
    name: "Python",
    duration: "4 Months",
    fees: 18000,
    seats: 20,
    status: "Active",
  },
  {
    id: 4,
    name: "Java",
    duration: "5 Months",
    fees: 20000,
    seats: 35,
    status: "Inactive",
  },
];

if (!localStorage.getItem("courses")) {
  localStorage.setItem("courses", JSON.stringify(INITIAL_COURSES));
}

const getAll = () => JSON.parse(localStorage.getItem("courses")) || [];
const saveAll = (data) => localStorage.setItem("courses", JSON.stringify(data));

export const getCourses = () => {
  return Promise.resolve({ data: getAll() });
};

export const addCourse = (course) => {
  const all = getAll();
  const newCourse = { ...course, id: Date.now() };
  saveAll([...all, newCourse]);
  return Promise.resolve({ data: newCourse });
};

export const updateCourse = (id, course) => {
  const all = getAll();
  const updated = all.map((c) =>
    c.id === Number(id) ? { ...c, ...course } : c,
  );
  saveAll(updated);
  return Promise.resolve({ data: course });
};

export const deleteCourse = (id) => {
  const all = getAll();
  saveAll(all.filter((c) => c.id !== Number(id)));
  return Promise.resolve({});
};
