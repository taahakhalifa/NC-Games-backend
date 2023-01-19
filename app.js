const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const {
    getReviews,
    getReviewObject,
    getComments,
    postComment,
    patchReview,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { psqlErrors, customErrors, internalServerError } = require("./errors");
const { deleteComment } = require("./controllers/comments.controllers");

const { apiRouter } = require("./controllers/apps.controllers");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewObject);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReview);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api", apiRouter);

//POSTGRES ERROR
app.use(psqlErrors);

//CUSTOM ERROR
app.use(customErrors);

//INTERNAL SEVER ERROR 500
app.use(internalServerError);

//PATH NOT FOUND ERROR
app.use((req, res) => {
    res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
