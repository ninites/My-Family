const model = require("../model/comments");
const ApiError = require('../error/ApiError')


class Comments {
    static postComm = async (req, res, next) => {
        if (!req.body.contenu) {
            next(ApiError.emptyBody('Probleme de contenu'))
            return
        }

        const newCom = {
            contenu: req.body.contenu,
            pictures_id: req.body.picturesId,
            user_id: req.body.userId,
        }

        const comm = await model.postComm(newCom)
        if (!comm.insertId) {
            next(ApiError.mysql(comm))
            return;
        }
        const result = await model.getOne(comm.insertId)
        res.status(200).json(...result)
    }

    static getForAPic = async (req, res, next) => {
        const comments = await model.getForAPic(req.params.id);
        if (typeof comments === "string") {
            next(ApiError.mysql(comments))
            return
        } else if (!comments.length > 0) {
            res.status(200).json([])
            return
        }
        res.status(200).send(comments)
    }

    static deleteOne = async (req, res, next) => {
        const comments = await model.deleteOne(req.params.id)
        if (typeof comments === "string") {
            next(ApiError.mysql(comments))
            return
        }
        res.sendStatus(204)
    }


}

module.exports = Comments;