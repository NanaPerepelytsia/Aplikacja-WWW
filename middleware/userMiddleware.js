import jwt from "jsonwebtoken";
//const secretKey = require ('../routes/usersRoute.mjs').secretKey;

/* Перед тим як обробити запит перевіряємо, чи валідний токен, переданий у запиті. Якщо так, то продовжуємо обробку ,
інакше відмовляємо у доступі й повертаємо відповідь з відповідним статусом помилки */

function verifyToken(req, res, next) {
  const token = req.header("Authorization"); // отримання токену з заголовку запиту.
  if (!token) return res.status(401).send({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, "your-secret-key"); // jwt.verify - метод, що перевіряє токен на валідність
    req.userId = decoded.userId; // розшифрування даних з токена та збереження ID користувача задля використання в подальших операціях
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
}

export default verifyToken;
