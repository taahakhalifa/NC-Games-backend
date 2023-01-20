const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

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

function updateComment(id, { inc_votes }) {
    incrementalValue = inc_votes;

    const sqlString = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  `;

    return db
        .query(sqlString, [incrementalValue, id])
        .then(({ rows: [comment] }) => {
            delete comment.comment_id;
            return comment;
        });
}

module.exports = { removeComment, updateComment };
