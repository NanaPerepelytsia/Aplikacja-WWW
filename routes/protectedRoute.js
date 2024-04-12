import express from "express";
const router = express.Router();

import verifyToken from "../middleware/userMiddleware.js";

router.get("/", verifyToken, (req, res) => {
  res.status(200).send({ message: "Protected route accessed" });
});

export default router;
