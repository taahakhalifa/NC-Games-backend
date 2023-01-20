const fs = require("fs/promises");

function endPointsJSONData() {
    return fs
        .readFile(`${__dirname}/../endpoints.json`, "utf-8")
        .then((endpoints) => {
            return JSON.parse(endpoints);
        });
}

module.exports = { endPointsJSONData };
