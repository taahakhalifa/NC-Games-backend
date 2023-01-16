const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const { getReviews } = require("./controllers/reviews.controllers");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

module.exports = app;
