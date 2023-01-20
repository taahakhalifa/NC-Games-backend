const { endPointsJSONData } = require("../models/api.models");

function endPointsJSON(req, res, next) {
    endPointsJSONData()
        .then((endpoints) => {
            res.status(200).send({ endpoints });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { endPointsJSON };
