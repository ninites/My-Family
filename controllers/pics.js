const model = require("../model/pics");
const ApiError = require("../error/ApiError");
const fs = require("fs");

class Pics {
  static postOne = async (req, res, next) => {
    
    if (!Object.keys(req.body).length > 0) {
      next(ApiError.emptyBody("body problem"));
      return;
    }

    for (const key in req.body) {
      if (req.body[key] === "") {
        next(ApiError.emptyBody([key] + " n'est pas rempli"));
        return;
      }
    }
    if (req.files.length === 0) {
      next(ApiError.emptyBody("Merci de rajouter une photo"));
      return;
    }

    const final = async () => {
      return Promise.all(
        req.files.map(async (file) => {
          if (fs.existsSync(file.path)) {
            const { title, desc, user_id, creation } = req.body;
            const newPics = {
              title: title,
              desc: desc,
              user_id: user_id,
              path: file.path,
              creation: creation,
              private: req.body.private === "false" ? 0 : 1,
            };
            const result = await model.postPic(newPics);
            if (typeof result === "string") {
              return result;
            }
            return result;
          }
        })
      );
    };

    res.status(200).json(await final());
  };

  static getOne = async (req, res, next) => {
    const result = await model.getOne(req.params.id);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }

    res.status(200).json(...result);
  };

  static getAll = async (req, res, next) => {
    const result = await model.getAll(req.query);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }
    res.status(200).send(result);
  };

  static sendPics = async (req, res) => {
    res.sendFile(req.path, { root: "./" });
  };

  static deletePic = async (req, res, next) => {
    const deleteCom = await model.deleteCom(req.params.id);
    if (typeof deleteCom === "string") {
      next(ApiError.mysql(deleteCom));
      return;
    }
    const getPath = await model.getOne(req.params.id);
    if (getPath.length === 0) {
      res.sendStatus(200);
      return;
    }

    const isExisting = await new Promise((resolve, reject) => {
      fs.stat(getPath[0].path, (err, stats) => {
        if (err) reject(err);
        resolve(stats);
      });
    }).catch((err) => err.message);

    if (typeof isExisting !== "string") {
      fs.unlinkSync(getPath[0].path);
    } else {
      console.log("nexste pas");
    }

    const deletePicture = await model.deletePic(req.params.id);
    if (typeof deletePicture === "string") {
      next(ApiError.mysql(deleteCom));
      return;
    }

    res.sendStatus(209);
  };
}

module.exports = Pics;
