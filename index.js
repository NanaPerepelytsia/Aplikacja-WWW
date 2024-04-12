import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post(`/singup`, async (req, res) => {
  const { username, password, writtenassignments } = req.body;

  const assignmentData = writtenassignments
    ? writtenassignments.map((assignment) => {
        return {
          title: assignment.title,
          description: assignment.description || undefined,
        };
      })
    : [];

  const result = await prisma.user.create({
    data: {
      username,
      password,
      writtenassignments: {
        create: assignmentData,
      },
    },
  });
  res.send(result);
}); // витягування даних з тіла запиту + створення нового користувача в базі.

app.post(`/createassignment`, async (req, res) => {
  const { title, description } = req.body;

  const result = await prisma.assignment.create({
    data: {
      title,
      description,
    },
  });
  res.send(result);
}); // витягування даних з тіла запиту + створення нового завдання в базі.

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
}); // список користувачів

app.get("/getassignments/:id", async (req, res) => {
  const { id } = req.params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: Number(id) },
  });
  res.send(assignment);
}); // пошук завдання за ID

app.put(`/updateassignment/:id`, async (req, res) => {
  const { id } = req.params;

  try {
    const assignmentData = await prisma.assignment.findUnique({
      where: { id: Number(id) },
    });

    if (!assignmentData) {
      return res.status(404).send({
        error: `Assignment with id ${id} does not exist in the database `,
      });
    }

    const updatedassignment = await prisma.assignment.update({
      where: { id: Number(id) },
      data: {
        title: req.body.title,
        description: req.body.description,
      },
    });

    res.send(updatedassignment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Failed to update post with ID ${id}` });
  }
}); // апдейт завдання

app.delete("/deleteassignment/:id", async (req, res) => {
  const { id } = req.params;
  const assignment = await prisma.assignment.delete({
    where: {
      id: Number(id),
    },
  });
  res.send(assignment);
}); // видалення завдання з поверненням

const server = app.listen(3000, () =>
  console.log(`Server is running on http://localhost:3000`)
);
