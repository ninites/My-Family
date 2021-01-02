const { connection } = require("../config/mysql");

class Comments {

    static postComm = async (info) => {
        const sql = 'INSERT INTO comments SET ?';
        const result = await connection.query(sql, info).catch(err => err.message)
        return typeof result === 'string' ? result : result[0];
    }

    static getOne = async (id) => {
        const sql = 'select * from comments where id = ? ';
        const result = await connection.query(sql, id).catch(err => err.message)
        return typeof result === 'string' ? result : result[0];
    }


    static getForAPic = async (id) => {
        const sql = `SELECT * from comments WHERE pictures_id = ? ORDER BY id DESC `
        const result = await connection.query(sql, id).catch(err => err.message);
        return typeof result === 'string' ? result : result[0];
    }

    static comNumber = async (id) => {
        const sql = `SELECT COUNT(*)  from comments WHERE pictures_id = ? `
        const result = await connection.query(sql, id).catch(err => err.message);
        return typeof result === 'string' ? result : result[0];
    }

    static deleteOne = async (id) => {
        const sql = ' DELETE FROM comments where id = ? '
        const result = await connection.query(sql, id).catch(err => err.message);
        return typeof result === 'string' ? result : result[0];
    }

}

module.exports = Comments;