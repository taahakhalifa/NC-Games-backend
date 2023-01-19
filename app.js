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

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewObject);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReview);
app.get("/api/users", getUsers);

//POSTGRES ERROR
app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    }
    if (err.code === "22003") {
        res.status(404).send({ msg: "Not Found" });
    } else {
        next(err);
    }
});

//CUSTOM ERROR
app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

//INTERNAL SEVER ERROR 500
app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
