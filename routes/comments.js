const express = require("express");
const comments = express.Router();
const comCtrl = require("../controllers/comments");
const authToken = require("../middlewares/authToken");

comments.post("/", authToken, comCtrl.postComm);
comments.get("/pic/:id", comCtrl.getForAPic);
comments.delete("/:id", authToken, comCtrl.deleteOne);

module.exports = comments;
