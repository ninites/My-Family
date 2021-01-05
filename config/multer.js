const multer = require("multer");
const ApiError = require("../error/ApiError");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
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
