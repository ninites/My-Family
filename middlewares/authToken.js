require("dotenv").config();
const jwt = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === "null") {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, process.env.DB_JWT, (err, result) => {
    req.body.userInfo = result;
  });
  next();
};

module.exports = authToken;
