const db = require("../db/connection");

function removeComment(id) {
    const sqlString = `
  DELETE FROM comments
  WHERE comment_id = $1
  `;

    return db.query(sqlString, [id]).then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
    });
}

module.exports = { removeComment };
