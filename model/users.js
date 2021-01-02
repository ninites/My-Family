const { connection } = require("../config/mysql");


class Users {
  static getOne = async (id) => {
    const sql = "select id,date_creation,profile,username,login,family_id from user where id = ?";
    const result = await connection.query(sql, id);
    return result[0];
  };

  static getAll = async () => {
    const sql = "select * from user";
    const result = await connection.query(sql);
    return result[0];
  };

  static getFilterUser = async (filter) => {
    const sql = 'SELECT * FROM user where ? '
    const result = await connection.query(sql, filter).catch(err => err.message)
    return typeof result === 'string' ? result : result[0]
  }

  static postOne = async (body) => {
    const sql = "INSERT INTO user SET ?";
    const result = await connection.query(sql, body).catch((err) => err.message)
    return typeof result === 'string' ? result : this.getOne(result[0].insertId);
  };

  static userCheck = async ({ login }) => {
    const sql = "SELECT * from user where login = ? ";
    const result = await connection.query(sql, login).catch((err) => err.message)
    return typeof result === 'string' ? result : result[0];
  };

  static deleteUser = async (id) => {
    const sql = 'DELETE FROM user WHERE id = ?'
    const result = await connection.query(sql, id).catch(err => err)
    return typeof result === 'string' ? result : result[0];
  }

  static deleteUserPics = async (id) => {
    const sql = 'DELETE from pictures where user_id = ? '
    const result = await connection.query(sql, id);
    return result[0]
  }

  static autoComp = async (letters) => {
    const sql = "select id,username,profile from user where username like  ? "
    const result = await connection.query(sql, `${letters}%`);
    return result[0]
  }

  static editUser = async (changes, userId) => {
    const sql = 'UPDATE user SET ? WHERE id = ?'
    const result = await connection.query(sql, [changes, userId]).catch(err => err.message)
    return typeof result === 'string' ? result : result[0];
  }



}

module.exports = Users;
