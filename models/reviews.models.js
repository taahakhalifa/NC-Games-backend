const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

function fetchAllReviews() {
    const sqlString = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, count(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8
  ORDER BY reviews.created_at ASC;
  `;

    return db.query(sqlString).then(({ rows: reviews }) => {
        delete reviews.review_body;
        return reviews;
    });
}

function fetchReviewObject(id) {
    const sqlString = `
  SELECT *
  FROM reviews
  WHERE reviews.review_id = $1;
  `;

    if (id) {
        return db.query(sqlString, [id]).then(({ rows: [review] }) => {
            return review;
        });
    } else {
        return Promise.reject();
    }
}

module.exports = { fetchAllReviews, fetchReviewObject };
