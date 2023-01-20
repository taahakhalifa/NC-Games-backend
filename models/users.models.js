const db = require("../db/connection");

function fetchUsers() {
    const sqlString = `
  SELECT * 
  FROM users
  `;

    return db.query(sqlString).then(({ rows: users }) => {
        return users;
    });
}

function fetchUser(username) {
    const sqlString = `
  SELECT *
  FROM USERS
  WHERE username = $1
  `;

    return db.query(sqlString, [username]).then(({ rows: [user] }) => {
        if (user === undefined) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
            return user;
        }
    });
}

module.exports = { fetchUsers, fetchUser };
