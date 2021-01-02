const transporter = require('../config/nodemailer')
const model = require('../model/users');
const ApiError = require('../error/ApiError')
const fs = require('fs')



class Mail {

    static passWord = async (req, res, next) => {
        if (!req.body.login) {
            next(ApiError.emptyBody('Probleme dans le body'))
        }


        const checkUser = await model.userCheck({ login: req.body.login })

        if (typeof checkUser === 'string') {
            next(ApiError.mysql(checkUser))
            return
        } else if (checkUser.length === 0) {
            next(ApiError.notLogged('Mail non present dans la base de données'))
            return
        }

        const userId = checkUser[0].id;

        const message = {
            from: "rmnheo@gmail.com",
            to: 'romheloise@gmail.com',
            subject: "Enregistrer un nouveau mot de passe",
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title> 
            </head>
            
            <body>
                <h1>My family </h1>
                <h2>Changement de mot de passe</h2>
                <a href="http://localhost:3000/changepwd/${id}">Cliquer ici pour changer de mot de passe</a>
            
            </body>
            </html>`
        };



        transporter.sendMail(message, (err, info) => {
            if (err) {
                next(ApiError.mysql("Probleme dans l'envoi de mail"))
                return
            }
            res.status(200).json('Mail envoyé')
        })

    }


    static readFile = async (filePath) => {
        const result = await new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                if (err) reject(err)
                resolve(data)
            })
        }).catch(err => err)
        return result
    }
}

module.exports = Mail;