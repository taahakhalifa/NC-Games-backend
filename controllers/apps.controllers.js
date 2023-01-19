const { endPointJSONData } = require("../models/apps.models");

function apiRouter(req, res, next) {
    endPointJSONData()
        .then((endpoints) => {
            res.status(200).send({ endpoints });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { apiRouter };
