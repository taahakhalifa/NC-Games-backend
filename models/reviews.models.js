const db = require("../db/connection");
const { fetchAllCategories } = require("./categories.models");

function fetchAllReviews(
    category,
    sort = "created_at",
    order = "desc",
    limit,
    p
) {
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
SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST(COUNT(comments.review_id) AS INT) AS comment_count
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
`;

    if (!validSortArg.includes(sort) || !validOrderArg.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    if (category) {
        sqlString += `\n WHERE reviews.category = $1 \n GROUP BY reviews.review_id \n ORDER BY reviews.${sort} ${order}
        `;
        pushedQuery.push(category);
    } else if (sort === "comment_count") {
        sqlString += `\n GROUP BY reviews.review_id \n ORDER BY comments.${sort} ${order}`;
    } else {
        sqlString += `\n GROUP BY reviews.review_id \n ORDER BY reviews.${sort} ${order}`;
    }

    if (limit) {
        sqlString += `\n LIMIT $1`;
        pushedQuery.push(limit);
    } else {
        sqlString += `\n LIMIT 10`;
    }

    if (p && limit) {
        sqlString += `\n OFFSET $2`;
        const offsetNum = p * limit - limit;
        pushedQuery.push(offsetNum);
    } else if (p) {
        sqlString += `\n OFFSET $1`;
        const offsetNum = p * 10 - 10;
        pushedQuery.push(offsetNum);
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

    const dbQueryReviewCount = db
        .query(`SELECT * FROM REVIEWS;`)
        .then(({ rows: reviews }) => {
            return reviews.length;
        });

    const dbQuery = db
        .query(sqlString, pushedQuery)
        .then(({ rows: reviews }) => {
            return reviews;
        });

    return Promise.all([checkMatch, dbQueryReviewCount, dbQuery]).then(
        ([checkMatch, dbQueryReviewCount, dbQuery]) => {
            return { reviews: dbQuery, total_count: dbQueryReviewCount };
        }
    );
}

function fetchReviewObject(id) {
    const sqlString = `
    SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count
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

function fetchComments(id, limit, p) {
    let sqlString = `
    SELECT *
    FROM comments
    WHERE comments.review_id = $1
    ORDER BY comments.created_at DESC
    `;

    const pushedQuery = [id];

    if (limit) {
        sqlString += `\n LIMIT $2`;
        pushedQuery.push(limit);
    } else {
        sqlString += `\n LIMIT 10`;
    }

    if (p && limit) {
        sqlString += `\n OFFSET $3`;
        const offsetNum = p * limit - limit;
        pushedQuery.push(offsetNum);
    } else if (p) {
        sqlString += `\n OFFSET $2`;
        const offsetNum = p * 10 - 10;
        pushedQuery.push(offsetNum);
    }

    return db.query(sqlString, pushedQuery).then(({ rows: comments }) => {
        return comments;
    });
}

function insertComment({ username, body }, id) {
    const sqlString = `
  INSERT INTO comments
  (author, body, review_id)
  VALUES ($1, $2, $3)
  RETURNING *;
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
    ]).then(
        ([
            reviewWithoutCommentCount,
            {
                rows: [review],
            },
        ]) => {
            return review;
        }
    );
}

function removeReview(id) {
    const sqlString = `
  DELETE FROM reviews
  WHERE review_id = $1
  `;

    return db.query(sqlString, [id]).then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
    });
}

module.exports = {
    fetchAllReviews,
    fetchReviewObject,
    fetchComments,
    insertComment,
    updateReview,
    insertReview,
    removeReview,
};
