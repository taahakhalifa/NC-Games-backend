const { fetchAllReviews } = require("../models/reviews.models");

function getReviews(req, res, next) {
    fetchAllReviews()
        .then((reviews) => {
            res.status(200).send({ reviews });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { getReviews };
