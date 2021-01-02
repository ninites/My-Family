const express = require("express");
const requetes = express.Router();
const requetesCtrl = require("../controllers/requetes");
const authToken = require("../middlewares/authToken");

requetes.post("/", authToken, requetesCtrl.postOne);
requetes.get("/", requetesCtrl.getOneFilter);
requetes.delete("/", authToken, requetesCtrl.deleteOne);

module.exports = requetes;
