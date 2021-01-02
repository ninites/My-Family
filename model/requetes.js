const { connection } = require("../config/mysql");

class Requetes {
  static postOne = async (value) => {
    const sql = "INSERT INTO requetes SET ?";
    const result = await connection
      .query(sql, value)
      .catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static deleteOne = async (value) => {
    const sql = "DELETE FROM requetes where ?";
    const result = await connection
      .query(sql, value)
      .catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static getOne = async (id) => {
    const sql = "SELECT * FROM requetes where id= ? ";
    const result = await connection.query(sql, id).catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static getAll = async (filter) => {
    const sql = `SELECT * FROM requetes ${
      Object.keys(filter).length > 0 && "WHERE ?"
    }`;
    const result = await connection
      .query(sql, filter)
      .catch((err) => err.message);     
    return typeof result === "string" ? result : result[0];
  };

  static getOneFilter = async (filter) => {
    const sql = "SELECT * FROM requetes where ? ";
    const result = await connection
      .query(sql, filter)
      .catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };
}

module.exports = Requetes;
