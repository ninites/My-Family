const express = require("express");
const pics = express.Router();
const upload = require("../config/multer");
const picsController = require("../controllers/pics");
const authToken = require("../middlewares/authToken");

pics.post("/pic", authToken, upload.array("image", 5), picsController.postOne);
pics.get("/:id", picsController.getOne);
pics.get("/", picsController.getAll);
pics.get("/uploads/:user/:file", picsController.sendPics);
pics.delete("/delete/:id", authToken, picsController.deletePic);

module.exports = pics;
