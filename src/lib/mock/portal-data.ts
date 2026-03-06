export const teacherGroups = [
  {
    id: "10A",
    grade: "Grade 10",
    students: 35,
    homeroom: "2026",
    subject: "Mathematics",
    attendance: 96,
  },
  {
    id: "9B",
    grade: "Grade 9",
    students: 32,
    homeroom: "2026",
    subject: "Mathematics",
    attendance: 93,
  },
];

export const activities = [
  {
    title: "Algebra quiz",
    group: "10A",
    period: "P1",
    dueDate: "2026-03-18",
    status: "Published",
    submissions: 31,
  },
  {
    title: "Geometry workshop",
    group: "9B",
    period: "P1",
    dueDate: "2026-03-20",
    status: "Draft",
    submissions: 0,
  },
  {
    title: "Functions project",
    group: "10A",
    period: "P2",
    dueDate: "2026-04-08",
    status: "Scheduled",
    submissions: 0,
  },
];

export const gradebookRows = [
  {
    student: "Sofia Gomez",
    group: "10A",
    activity: "Algebra quiz",
    score: 4.7,
    feedback: "Strong logic",
  },
  {
    student: "Mateo Rojas",
    group: "10A",
    activity: "Algebra quiz",
    score: 3.8,
    feedback: "Practice equations",
  },
  {
    student: "Valentina Ruiz",
    group: "9B",
    activity: "Geometry workshop",
    score: 0,
    feedback: "Pending",
  },
];

export const attendanceRows = [
  { student: "Sofia Gomez", group: "10A", date: "2026-03-05", status: "Present" },
  { student: "Mateo Rojas", group: "10A", date: "2026-03-05", status: "Late" },
  { student: "Valentina Ruiz", group: "9B", date: "2026-03-05", status: "Excused" },
];

export const studentSubjects = [
  { code: "MAT", name: "Mathematics", teacher: "Ana Perez", current: 4.2 },
  { code: "SCI", name: "Science", teacher: "Luis Torres", current: 4.0 },
  { code: "ENG", name: "English", teacher: "Martha Diaz", current: 4.5 },
  { code: "SOC", name: "Social studies", teacher: "Carlos Mora", current: 3.9 },
];

export const studentActivities = [
  { title: "Algebra quiz", subject: "Mathematics", dueDate: "2026-03-18", progress: "Submitted" },
  { title: "Lab report", subject: "Science", dueDate: "2026-03-22", progress: "In progress" },
  { title: "Essay", subject: "English", dueDate: "2026-03-26", progress: "Pending" },
];

export const studentGrades = [
  { subject: "Mathematics", p1: 4.2, p2: 0, p3: 0, p4: 0 },
  { subject: "Science", p1: 4.0, p2: 0, p3: 0, p4: 0 },
  { subject: "English", p1: 4.5, p2: 0, p3: 0, p4: 0 },
  { subject: "Social studies", p1: 3.9, p2: 0, p3: 0, p4: 0 },
];

export const reportSummary = {
  student: "Sofia Gomez",
  average: 4.15,
  rank: "Top 12%",
  attendance: "95%",
  behavior: "Excellent",
};

export const guardianChildren = [
  { name: "Sofia Gomez", grade: "10A", average: 4.15, attendance: "95%" },
  { name: "Nicolas Gomez", grade: "7C", average: 3.92, attendance: "97%" },
];

export const guardianAnnouncements = [
  { title: "Parents meeting", scope: "Group 10A", date: "2026-03-12" },
  { title: "Science fair", scope: "Global", date: "2026-03-20" },
  { title: "Payment reminder", scope: "Global", date: "2026-03-25" },
];

export const coordinationRisks = [
  {
    caseId: "R-1002",
    student: "Mateo Rojas",
    type: "Academic",
    level: "Medium",
    owner: "Counseling",
  },
  {
    caseId: "R-1021",
    student: "Paula Nunez",
    type: "Attendance",
    level: "High",
    owner: "Coordination",
  },
  { caseId: "R-1030", student: "Julian Castro", type: "Behavior", level: "Low", owner: "Homeroom" },
];
