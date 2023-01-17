const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");
const formatComments = require("../db/seeds/utils");
const format = require("pg-format");

function fetchAllReviews(category, sort = "created_at", order = "desc") {
    const validSortArg = [
        "owner",
        "title",
        "review_id",
        "category",
        "review_img_url",
        "created_at",
        "votes",
        "designer",
        "comment_count",
    ];
    const validOrderArg = ["asc", "desc"];
    const pushedQuery = [];
    let sqlString = `
SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, count(comments.review_id) AS comment_count
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
`;
    if (validSortArg.includes(sort) && validOrderArg.includes(order)) {
        if (category) {
            sqlString += `\n WHERE reviews.category = $1 \n GROUP BY reviews.review_id
        `;
            pushedQuery.push(category);
        } else {
            sqlString += `\n GROUP BY reviews.review_id \n ORDER BY reviews.${sort} ${order}`;
        }

        return db.query(sqlString, pushedQuery).then(({ rows: reviews }) => {
            return reviews;
        });
    }
}

function fetchReviewObject(id) {
    const sqlString = `
  SELECT *
  FROM reviews
  WHERE reviews.review_id = $1;
  `;

    return db.query(sqlString, [id]).then(({ rows: [review] }) => {
        return review;
    });
}

function fetchComments(id) {
    const sqlString = `
  SELECT *
  FROM comments
  WHERE comments.review_id = $1
  `;

    return db.query(sqlString, [id]).then(({ rows: comments }) => {
        return comments;
    });
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
