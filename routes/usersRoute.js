import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // Бібліотека для безпечного зберігання паролів користувачів.
import jwt from "jsonwebtoken"; // Бібліотека для створення та верифікації токенів.

const prisma = new PrismaClient();
const router = express.Router();

// User registration

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body; // отримання даних, введені користувачем.
    const hashedPassword = await bcrypt.hash(password, 10); // 10 - робоча потужність генерації хеша пароля.(складність обчислень)
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Registration failed" });
  }
});

// User login

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body; // Отримання даних, введені користувачем.
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).send({ error: "Authentication failed" }); // Користувача не знайдено. Помилка (401) - невдала автентифікація
    }
    const passwordMatch = await bcrypt.compare(password, user.password); // COMPARE- порівнює наданий пароль з хешованим, що зберігається у базі данних.
    if (!passwordMatch) {
      return res.status(401).send({ error: "Authentication failed" });
    }
    //  const secretKey = crypto.randomBytes(32).toString('hex');  // генерація випадеових чисел для секретного ключа. (32байти по 2 символи в 16сис.числ. = 64 символи)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      // секретний ключ використовується при створені цифрового підпису ({ userId: user._id} - об'єкт який хочемо закодувати)
      expiresIn: "1h",
    });
    // секретний ключ був вписаний безпосредньо без генерації випадеових чисел
    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Login failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving tasks");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving task");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteuser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.send(deleteuser);
  } catch (error) {
    console.error(error);
    res.status(404).send("The user with the given ID not fournd");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateuser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.status(200).send(updateuser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

export default router;
