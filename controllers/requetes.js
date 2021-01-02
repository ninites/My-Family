const model = require("../model/requetes");
const usrModel = require("../model/users");
const ApiError = require("../error/ApiError");

class Requetes {
  static postOne = async (req, res, next) => {
    for (const key in req.body) {
      if (!req.body[key]) {
        next(ApiError.emptyBody(`pas de ${[key]}`));
        return;
      }
    }

    const alreadyIn = await usrModel.getOne(req.body.user_id);
    if (typeof alreadyIn === "string") {
      next(ApiError.mysql(alreadyIn));
      return;
    } else if (alreadyIn[0].family_id === req.body.family_id) {
      next(ApiError.mysql("Vous etes deja dans cette famille"));
      return;
    }

    const allReq = await model.getAll({ family_id: req.body.family_id });   
    if (typeof allReq === "string") {
      next(ApiError.mysql(allReq));
      return;
    }
    let endPost = false;
    allReq.forEach((element) => {
      if (
        element.user_id === req.body.user_id &&
        element.family_id === req.body.family_id
      ) {
        endPost = true;
      }
    });

    if (endPost) {
      next(
        ApiError.mysql("Vous avez deja fait une demande pour cette famille")
      );
      return;
    }
    const newFamilyReq = {
      family_id: req.body.family_id,
      user_id: req.body.user_id,
    };

    const result = await model.postOne(newFamilyReq);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }

    res.status(200).json(...(await model.getOne(result.insertId)));
  };

  static getOneFilter = async (req, res, next) => {
    const result = await model.getOneFilter(req.query);

    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }

    res.status(200).send(...result);
  };

  static deleteOne = async (req, res, next) => {
    const result = await model.deleteOne(req.query);
    res.sendStatus(204);
  };
}

module.exports = Requetes;
