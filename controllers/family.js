const model = require("../model/family");
const userModel = require("../model/users");
const ApiError = require("../error/ApiError");

class Family {
  static getPicsForFamily = async (req, res, next) => {
    const result = await model.getPicsForFamily(req.params.id);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }
    res.status(200).send(result);
  };

  static autoCompPicsForFamily = async (req, res, next) => {
    if (!req.query.id || !req.query.lettres) {
      next(ApiError.emptyBody("probleme de body family"));
      return;
    }
    const { id, lettres } = req.query;
    const result = await model.autoCompPicsForFamily(id, lettres);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }
    res.status(200).send(result);
  };

  static postOne = async (req, res, next) => {
    let stopErr = false;
    for (const key in req.body) {
      if (!req.body[key]) {
        next(ApiError.emptyBody("Il manque le " + [key]));
        stopErr = true;
        break;
      }
    }
    if (stopErr) return;

    const { name, creator } = req.body;

    const result = await model.postOne({ name: name });
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }

    const addUserToFamily = await userModel.editUser(
      { family_id: result.insertId },
      creator
    );
    if (typeof addUserToFamily === "string") {
      next(ApiError.mysql(addUserToFamily));
      return;
    }

    const retour = await model.getOne(result.insertId);
    res.status(200).json(...retour);
  };

  static getOne = async (req, res, next) => {
    let result = await model.getOne(req.params.id);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }
    const team = await userModel.getFilterUser({ family_id: req.params.id });

    if (typeof team === "string") {
      next(ApiError.mysql(team));
      return;
    }
    if (result.length > 0) {
      team.forEach((mem) => {
        delete mem.password;
        delete mem.login;
      });
      result[0] = { ...result[0], familyMembers: team };
    }

    res.status(200).send(...result);
  };

  static autoC = async (req, res, next) => {
    if (Object.keys(req.params).length === 0) {
      res.status(200).json([]);
      return;
    }

    const result = await model.autoC(req.params.lettre);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }
    res.status(200).json(result);
  };

  static isMember = async (req, res, next) => {
    let result = false;
    if (req.query.user) {
      const { user, family } = req.query;
      const userInfo = await userModel.getOne(user);
      if (userInfo.length > 0) {
        if (userInfo[0].family_id === parseInt(family)) {
          result = true;
        }
      }
    }
    res.status(200).json(result);
  };
}

module.exports = Family;
