require("dotenv").config();
const express = require("express");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
function validateStudent(body) {
  const studentNo = String(body.studentNo || "").trim();
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const course = String(body.course || "").trim();
  const yearLevel = Number(body.yearLevel);
  if (!studentNo || !firstName || !lastName || !email || !course) return { error: "Please complete all required fields." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (!Number.isInteger(yearLevel) || yearLevel < 1 || yearLevel > 6) return { error: "Year level must be a whole number from 1 to 6." };
  return { data: { studentNo, firstName, lastName, email, course, yearLevel } };
}
app.get("/api/students", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const students = await prisma.student.findMany({
      where: q ? { OR: [{ studentNo: { contains: q } }, { firstName: { contains: q } }, { lastName: { contains: q } }, { email: { contains: q } }, { course: { contains: q } }] } : undefined,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }]
    });
    res.json(students);
  } catch (error) { console.error(error); res.status(500).json({ error: "Unable to retrieve students." }); }
});
app.get("/api/students/:id", async (req, res) => {
  try { const student = await prisma.student.findUnique({ where: { id: Number(req.params.id) } }); if (!student) return res.status(404).json({ error: "Student not found." }); res.json(student); }
  catch { res.status(400).json({ error: "Invalid student ID." }); }
});
app.post("/api/students", async (req, res) => {
  const v = validateStudent(req.body); if (v.error) return res.status(400).json({ error: v.error });
  try { res.status(201).json(await prisma.student.create({ data: v.data })); }
  catch (error) { if (error.code === "P2002") return res.status(409).json({ error: "Student number or email already exists." }); console.error(error); res.status(500).json({ error: "Unable to create student." }); }
});
app.put("/api/students/:id", async (req, res) => {
  const v = validateStudent(req.body); if (v.error) return res.status(400).json({ error: v.error });
  try { res.json(await prisma.student.update({ where: { id: Number(req.params.id) }, data: v.data })); }
  catch (error) { if (error.code === "P2025") return res.status(404).json({ error: "Student not found." }); if (error.code === "P2002") return res.status(409).json({ error: "Student number or email already exists." }); if (error.code === "P2023") return res.status(400).json({ error: "Invalid student ID." }); console.error(error); res.status(500).json({ error: "Unable to update student." }); }
});
app.delete("/api/students/:id", async (req, res) => {
  try { await prisma.student.delete({ where: { id: Number(req.params.id) } }); res.status(204).end(); }
  catch (error) { if (error.code === "P2025") return res.status(404).json({ error: "Student not found." }); if (error.code === "P2023") return res.status(400).json({ error: "Invalid student ID." }); console.error(error); res.status(500).json({ error: "Unable to delete student." }); }
});
app.get("/portfolio", (_req, res) => res.sendFile(path.join(__dirname, "portfolio", "index.html")));
const server = app.listen(PORT, () => console.log("Student Management System running at http://localhost:" + PORT));
async function shutdown() { server.close(async () => { await prisma.$disconnect(); process.exit(0); }); }
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
