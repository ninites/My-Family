const express = require("express");
const email = express.Router();

const mailCtrl = require("../controllers/email");

email.post('/', mailCtrl.passWord)

module.exports = email;
