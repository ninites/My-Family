const express = require("express");
const family = express.Router({ strict: true });
const familyCtrl = require("../controllers/family");
const authToken = require("../middlewares/authToken");

family.get("/pics/:id", familyCtrl.getPicsForFamily);
family.get("/pics/search/", familyCtrl.autoCompPicsForFamily);
family.post("/", authToken, familyCtrl.postOne);
family.get("/:id", familyCtrl.getOne);
family.get("/search/:lettre", familyCtrl.autoC);
family.get("/ismember/", familyCtrl.isMember);

module.exports = family;
