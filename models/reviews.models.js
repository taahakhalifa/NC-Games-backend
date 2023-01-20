const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");
const { fetchAllCategories } = require("./categories.models");

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

    if (!validSortArg.includes(sort) || !validOrderArg.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    } else if (category) {
        sqlString += `\n WHERE reviews.category = $1 \n GROUP BY reviews.review_id
        `;
        pushedQuery.push(category);
    } else {
        sqlString += `\n GROUP BY reviews.review_id \n ORDER BY reviews.${sort} ${order}`;
    }
    const checkMatch = fetchAllCategories()
        .then((categoriesArray) => {
            return categoriesArray.some(({ slug }) => slug === category);
        })
        .then((result) => {
            if (result === false && typeof category === "string") {
                return Promise.reject({ status: 404, msg: "Not Found" });
            }
        });

    const dbQuery = db
        .query(sqlString, pushedQuery)
        .then(({ rows: reviews }) => {
            return reviews;
        });

    return Promise.all([checkMatch, dbQuery]).then(([checkMatch, dbQuery]) => {
        return dbQuery;
    });
}

function fetchReviewObject(id) {
    const sqlString = `
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
  `;

    return db.query(sqlString, [id]).then(({ rows: [review] }) => {
        if (Object.keys(review).length === 0) {
            return Promise.reject({
                status: 404,
                msg: `Not Found:`,
            });
        } else {
            return review;
        }
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

function insertComment({ username, body }, id) {
    const sqlString = `
  INSERT INTO comments
  (author, body, review_id)
  VALUES ($1, $2, $3)
  RETURNING author AS username, body;
  `;
    const commentValues = [username, body, id];

    return db.query(sqlString, commentValues).then(({ rows: [comment] }) => {
        return comment;
    });
}

function updateReview(id, { inc_votes }) {
    const incrementalValue = inc_votes;

    const sqlString = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *
    `;

    const sqlStringValues = [incrementalValue, id];
    return db.query(sqlString, sqlStringValues).then(({ rows: review }) => {
        return review;
    });
}

function insertReview({ title, designer, owner, review_body, category }) {
    const sqlStringWithoutCommentCount = `
  INSERT INTO reviews
  (title, designer, owner, review_body, category)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
  `;
    const reviewValues = [title, designer, owner, review_body, category];

    const reviewWithoutCommentCount = db.query(
        sqlStringWithoutCommentCount,
        reviewValues
    );

    const sqlStringWithCommentCount = `
    SELECT reviews.*, count(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE title = $1
    GROUP BY reviews.review_id;
    `;
    const reviewWithCommentCount = db.query(sqlStringWithCommentCount, [title]);

    return Promise.all([
        reviewWithoutCommentCount,
        reviewWithCommentCount,
    ]).then(([reviewWithoutCommentCount, reviewWithCommentCount]) => {
        return reviewWithCommentCount.rows[0];
    });
}

module.exports = {
    fetchAllReviews,
    fetchReviewObject,
    fetchComments,
    insertComment,
    updateReview,
    insertReview,
};

// .then(({ rows: [review] }) => {
//   return review;
// });
