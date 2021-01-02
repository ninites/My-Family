const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../error/ApiError");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    let path = `uploads${req.path}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        file.originalname.split("").slice(0, 2).join("") +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb) => {
    const fileType = ["image/jpeg", "image/png"];
    if (!fileType.includes(file.mimetype)) {
      cb(ApiError.mysql("Mauvais type de fichier"));
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;
