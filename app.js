import dotenv from "dotenv"; // завантаження модуля dotenv;
dotenv.config(); // виклик функції конфігурації, що завантажує змінні середовища з файлу;

import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import usersRoute from "./routes/usersRoute.js";
import protectedRoute from "./routes/protectedRoute.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/todo", todoRoutes);
app.use("/api/user", usersRoute);
app.use("/api/protected", protectedRoute);

app.listen(port, () => console.log(`Listening on port ${port}...`));
