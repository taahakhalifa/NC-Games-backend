const db = require("../db/connection");

function fetchAllCategories() {
    const sqlString = `
    SELECT * 
    FROM categories;
  `;
    return db.query(sqlString).then(({ rows: categories }) => {
        return categories;
    });
}

module.exports = { fetchAllCategories };
