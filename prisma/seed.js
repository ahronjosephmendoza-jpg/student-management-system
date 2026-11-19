require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const records = [
    {studentNo:"2026-0001",firstName:"Alex",lastName:"Reyes",email:"alex.reyes@example.com",course:"BS Information Technology",yearLevel:2},
    {studentNo:"2026-0002",firstName:"Jamie",lastName:"Santos",email:"jamie.santos@example.com",course:"BS Computer Science",yearLevel:1},
    {studentNo:"2026-0003",firstName:"Taylor",lastName:"Cruz",email:"taylor.cruz@example.com",course:"BS Information Technology",yearLevel:3}
  ];
  for (const student of records) await prisma.student.upsert({where:{studentNo:student.studentNo},update:{},create:student});
  console.log("Sample student records are ready.");
}
main().catch(error => {console.error(error);process.exit(1);}).finally(() => prisma.$disconnect());
