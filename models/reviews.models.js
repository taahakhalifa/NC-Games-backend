const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");
const formatComments = require("../db/seeds/utils");
const format = require("pg-format");

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

function fetchComments(id) {
    const sqlString = `
  SELECT *
  FROM comments
  WHERE comments.review_id = $1
  `;

    if (id) {
        return db.query(sqlString, [id]).then(({ rows: comments }) => {
            return comments;
        });
    } else {
        return Promise.reject();
    }
}

function insertComment({ author, body }, id) {
    const sqlString = `
INSERT INTO comments
(author, body, review_id)
VALUES ($1, $2, $3)
RETURNING author AS username, body;
`;
    const commentValues = [author, body, id];

    return db.query(sqlString, commentValues).then(({ rows: [comment] }) => {
        return comment;
    });
}

function updateReview(id, { inc_votes }) {
    const incrementValue = inc_votes;
    const initialVotes = Number((reviews.review_id = id));
    const incrementedVote = initialVotes + incrementValue;

    const sqlString = `
    UPDATE reviews
    SET votes = $1
    WHERE review_id = $2
    RETURNING *
    `;

    const sqlStringValues = [incrementedVote, id];
    return db.query(sqlString, sqlStringValues).then(({ rows: review }) => {
        return review;
    });
}

module.exports = {
    fetchAllReviews,
    fetchReviewObject,
    fetchComments,
    insertComment,
    updateReview,
};
