const model = require("../model/users");
const rmodel = require("../model/requetes");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const secretJWTKey =
  "14cd677100bee8a7fa0d49829806fbab2f6b32647f4106a713d6c5ea521e314254e846553de456654d702f4131e229c3b9f73ee17972d66b502b626e7e1437b2";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const validator = require("../error/validator");
require("dotenv").config;

class Users {
  static addReq = async (user) => {
    if (user.family_id) {
      const demandes = await rmodel.getOneFilter({
        family_id: user.family_id,
      });
      const famRequest = [];
      demandes.forEach((demande) => {
        famRequest.push(demande.user_id);
      });
      user = { ...user, familyRequest: famRequest };
    }
    return user;
  };

  static getOne = async (req, res, next) => {
    let result = await model.getOne(req.params.id);
    if (result.length > 0) {
      result = await this.addReq(result[0]);
    }

    res.status(200).json(result);
  };

  static postOne = async (req, res, next) => {
    if (!Object.keys(req.body).length > 0) {
      next(ApiError.emptyBody("Probleme avec le body"));
    }

    const { username, login, password, date_creation } = req.body;
    const refDat = date_creation.split("/").reverse().join("-");

    if (!validator.emailIsValid(login)) {
      next(ApiError.emptyBody("not email"));
      return;
    } else if (
      !validator.isMinSize(password, 8) ||
      !validator.isMinSize(username, 2)
    ) {
      next(ApiError.emptyBody("too short"));
      return;
    }

    const hashPass = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    }).catch((err) => {
      return err;
    });

    if (!hashPass) {
      next(ApiError.mysql("Probleme mot de pass hashing"));
      return;
    }

    const newUser = {
      username: username,
      login: login,
      password: hashPass,
      profile: req.body.picsCloud[0].url,
      date_creation: refDat,
    };

    const result = await model.postOne(newUser);

    if (result[0].length === 0) {
      next(ApiError.isMissing("Probleme Creation"));
      return;
    } else if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }

    const returnUser = await model.getOne(result.insertId);

    res.status(200).json(...returnUser);
  };

  static getToken = async (req, res, next) => {
    if (!Object.keys(req.body).length > 0) {
      next(ApiError.emptyBody("Probleme avec le body"));
    }
    const user = { id: req.body.userInfo.id };
    const token = jwt.sign(user, secretJWTKey);
    req.body.token = token;
    next();
  };

  static sendToken = async (req, res, next) => {
    if (!req.body.token) {
      next(ApiError.notLogged("not logged"));
      return;
    }
    delete req.body.userInfo.password;
    delete req.body.userInfo.login;
    const userInfo = await this.addReq(req.body.userInfo);
    res.json({ accessToken: req.body.token, user: userInfo });
  };

  static sendUser = async (req, res, next) => {
    const { id } = req.body.userInfo;
    const users = await model.getAll();
    let result = users.filter((user) => user.id === id);

    if (!result.length > 0) {
      next(ApiError.notLogged("pas d'utilisateur avec ce mot de passe"));
      return;
    }

    result = await this.addReq(result[0]);
    delete result.password;
    delete result.login;
    res.status(200).json(result);
  };

  static userCheck = async (req, res, next) => {
    const result = await model.userCheck(req.body);
    if (!result.length > 0) {
      next(ApiError.notLogged("E mail introuvable"));
      return;
    }
    const hashPass = result[0].password;
    const regPass = req.body.password;
    const compare = await new Promise((resolve, reject) => {
      bcrypt.compare(regPass, hashPass, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    }).catch((err) => err.message);

    if (!compare) {
      next(ApiError.notLogged("Mot de passe Incorrect"));
      return;
    }

    req.body.userInfo = { ...result[0] };
    next();
  };

  static getAll = async (req, res, next) => {
    const result = await model.getAll();
    if (!result.length > 0) {
      next(ApiError.isMissing("pas de users"));
      return;
    }
    res.status(200).json(result);
  };

  static deleteUser = async (req, res, next) => {
    const deletePics = await model.deleteUserPics(req.params.id);
    const deleteUser = await model.deleteUser(req.params.id);
    res.sendStatus(204);
  };

  static autoComp = async (req, res, next) => {
    const result = await model.autoComp(req.params.id);
    res.status(200).json(result);
  };

  static changePasswordLog = async (req, res, next) => {
    if (!req.body.login) {
      next(ApiError.emptyBody("Probleme dans le body"));
    }

    const checkUser = await model.userCheck({ login: req.body.login });

    if (typeof checkUser === "string") {
      next(ApiError.mysql(checkUser));
      return;
    } else if (checkUser.length === 0) {
      next(ApiError.notLogged("Mail non present dans la base de données"));
      return;
    }
    const userId = checkUser[0].id;
    res.status(200).json({ id: userId });
  };

  static changePassword = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      next(ApiError.emptyBody("Mot de passe vide"));
      return;
    }

    const password = req.body.password;
    const hashPass = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    }).catch((err) => {
      next(ApiError.mysql("hash problem"));
      return undefined;
    });

    if (!hashPass) {
      next(ApiError.mysql("Probleme mot de pass hashing"));
      return;
    }

    const result = await model.editUser({ password: hashPass }, req.body.id);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }
    res.status(200).send("Changement reussi");
  };

  static editUser = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      next(ApiError.emptyBody("Merci de renseigner une famille"));
      return;
    }

    const changeInfo = { ...req.body };
    delete changeInfo.userInfo;

    const result = await model.editUser(changeInfo, req.params.id);
    if (typeof result === "string") {
      next(ApiError.mysql(result));
      return;
    }
    res.status(200).send("Changement reussi");
  };
}

module.exports = Users;
