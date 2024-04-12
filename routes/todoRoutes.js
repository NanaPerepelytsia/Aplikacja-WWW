import express from "express";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.todo.findMany();
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving tasks`);
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const createtask = await prisma.todo.create({
      data: {
        title,
        description,
        authorId: id,
      },
    });
    res.send(createtask);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error create task`);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const existingTask = await prisma.todo.findUnique({
      where: { id: id },
    });
    if (!existingTask) {
      return res.status(404).send("Task not found");
    }

    const updatetask = await prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
      },
    });
    res.send(updatetask);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletetask = await prisma.todo.delete({
      where: {
        id: id,
      },
    });
    res.send(deletetask);
  } catch (error) {
    console.error(error);
    res.status(404).send("The task with the given ID was not found");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving task");
  }
});

router.get("/:userId/tasks", async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userid,
      },
      include: {
        writtenAssignments: true,
      },
    });

    if (!user) {
      res.status(404).send("User not found");
    }

    const tasks = user.writtenAssignments;
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("");
  }
});

export default router;
