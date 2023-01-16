const db = require("../db/connection");

function fetchAllReviews() {
    const sqlString = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, count(comments.review_id) AS comment_count
  FROM reviews
  JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8
  ORDER BY reviews.created_at ASC;
  `;

    return db.query(sqlString).then(({ rows }) => {
        delete rows.review_body;
        return rows;
    });
}

module.exports = { fetchAllReviews };
