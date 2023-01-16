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

module.exports = { fetchUsers };
