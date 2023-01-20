const express = require("express");
const reviewsRouter = express.Router();
const {
    getReviews,
    getReviewObject,
    getComments,
    postComment,
    patchReview,
    postReview,
} = require("../controllers/reviews.controllers");

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter.route("/:review_id").get(getReviewObject).patch(patchReview);

reviewsRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewsRouter;
