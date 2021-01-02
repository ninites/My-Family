const express = require("express");
const users = express.Router({ strict: true });
const upload = require("../config/multer");
const authToken = require("../middlewares/authToken");
const usCont = require("../controllers/users");

users.post("/signin/", usCont.userCheck, usCont.getToken, usCont.sendToken);
users.get("/signin/", authToken, usCont.sendUser);
users.post("/prof/", upload.single("image"), usCont.getToken, usCont.postOne);
users.get("/:id", usCont.getOne);
users.get("/", usCont.getAll);
users.delete("/:id", authToken, usCont.deleteUser);
users.get("/autocomp/:id", usCont.autoComp);
users.post("/changepwd/", usCont.changePasswordLog);
users.put("/changepwd/:id", usCont.changePassword);
users.put("/:id", authToken, usCont.editUser);

module.exports = users;
