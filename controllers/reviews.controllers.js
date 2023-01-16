const {
    fetchAllReviews,
    fetchReviewObject,
    fetchComments,
    insertComment,
} = require("../models/reviews.models");

function getReviews(req, res, next) {
    fetchAllReviews()
        .then((reviews) => {
            res.status(200).send({ reviews });
        })
        .catch((err) => {
            next(err);
        });
}

function getReviewObject(req, res, next) {
    const { review_id } = req.params;
    fetchReviewObject(review_id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            next(err);
        });
}

function getComments(req, res, next) {
    const { review_id } = req.params;

    fetchComments(review_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
}

function postComment(req, res, next) {
    const newComment = req.body;
    const { review_id } = req.params;

    insertComment(newComment, review_id)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { getReviews, getReviewObject, getComments, postComment };
