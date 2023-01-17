const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const {
    getReviews,
    getReviewObject,
    getComments,
} = require("./controllers/reviews.controllers");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewObject);
app.get("/api/reviews/:review_id/comments", getComments);

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
