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

function insertCategory({ slug, description }) {
    const sqlString = `
    INSERT INTO categories
    (slug, description)
    VALUES ($1, $2)
    RETURNING *
    `;

    return db
        .query(sqlString, [slug, description])
        .then(({ rows: [category] }) => {
            if (category.description === null) {
                return Promise.reject({ status: 400, msg: "Bad Request" });
            } else {
                return category;
            }
        });
}

module.exports = { fetchAllCategories, insertCategory };
