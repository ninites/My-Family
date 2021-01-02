const { format } = require("mysql2");
const { connection } = require("../config/mysql");

class Family {
  static getPicsForFamily = async (familyid) => {
    const sql = `SELECT pictures.id,pictures.title,pictures.desc,
                    pictures.path,pictures.creation,pictures.user_id,
                    pictures.private
                    FROM pictures
                    join user ON pictures.user_id = user.id 
                    WHERE user.family_id = ?         
                    ORDER BY pictures.id DESC     
                    `;
    const result = await connection
      .query(sql, familyid)
      .catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static autoCompPicsForFamily = async (familyid, lettres) => {
    let sql = `SELECT pictures.id,pictures.title,pictures.desc,
    pictures.path,pictures.creation,pictures.user_id,
    pictures.private
    FROM pictures
    join user ON pictures.user_id = user.id AND user.family_id = ?  
    WHERE pictures.title LIKE ? OR pictures.desc LIKE ?    
    `;
    const inserts = [familyid, `${lettres}%`, `%#${lettres}%`];
    sql = format(sql, inserts);
    const result = await connection.query(sql).catch((err) => err.message);

    return typeof result === "string" ? result : result[0];
  };

  static postOne = async (body) => {
    const sql = "INSERT INTO family SET ? ";
    const result = await connection
      .query(sql, body)
      .catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static getOne = async (id) => {
    const sql = "SELECT * FROM family where id = ? ";
    const result = await connection.query(sql, id).catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };

  static autoC = async (lettre) => {
    const sql = "SELECT * from family WHERE name like ?";
    const result = await connection
      .query(sql, `${lettre}%`)
      .catch((err) => err.message);
    return typeof result === "string" ? result : result[0];
  };
}

module.exports = Family;
