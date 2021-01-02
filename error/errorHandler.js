const ApiError = require("./ApiError");
const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  } else if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(500).json("Pas plus de 5 fichiers");
    } else if (err.code === "LIMIT_FILE_SIZE") {
      res.status(500).json("Un des fichiers est trop gros");
    }
    return;
  }
  return res.status(500).send("internal server error");
};

module.exports = errorHandler;
