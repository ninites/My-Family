require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretJWTKey =
  "14cd677100bee8a7fa0d49829806fbab2f6b32647f4106a713d6c5ea521e314254e846553de456654d702f4131e229c3b9f73ee17972d66b502b626e7e1437b2";

const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === "null") {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, secretJWTKey, (err, result) => {
    req.body.userInfo = result;
  });
  next();
};

module.exports = authToken;
