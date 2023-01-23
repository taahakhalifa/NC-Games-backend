const {
    fetchAllCategories,
    insertCategory,
} = require("../models/categories.models");

function getCategories(req, res, next) {
    fetchAllCategories()
        .then((categories) => {
            res.status(200).send({ categories });
        })
        .catch((err) => {
            next(err);
        });
}

function postCategory(req, res, next) {
    const postedCategory = req.body;

    insertCategory(postedCategory)
        .then((category) => {
            res.status(201).send({ category });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { getCategories, postCategory };
