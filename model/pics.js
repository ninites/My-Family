const { connection } = require("../config/mysql");

class Pics {
  static getOne = async (id) => {
    const result = await connection
      .query("SELECT * from pictures where id = ? ", id)
      .catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static getAll = async (filter) => {
    const sql = `SELECT * from pictures ${
      Object.keys(filter).length > 0 ? "where ?" : ""
    } ORDER BY pictures.id DESC`;

    const result = await connection
      .query(sql, filter)
      .catch((err) => err.message);

    return typeof result === "string" ? result : result[0];
  };

  static postPic = async (info) => {
    const result = await connection
      .query("INSERT INTO pictures SET ?", info)
      .catch((err) => err.message);
    return typeof result === "string"
      ? result
      : this.getOne(result[0].insertId);
  };

  static deleteCom = async (id) => {
    const sql = "DELETE FROM comments where pictures_id = ?";
    const result = await connection.query(sql, id).catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static deletePic = async (id) => {
    const sql = " DELETE FROM pictures WHERE id = ? ";
    const result = await connection.query(sql, id).catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  
}
module.exports = Pics;
