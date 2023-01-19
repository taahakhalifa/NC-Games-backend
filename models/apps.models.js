const fs = require("fs/promises");

function endPointJSONData() {
    return fs
        .readFile(`${__dirname}/../endpoints.json`, "utf-8")
        .then((endpoints) => {
            return JSON.parse(endpoints);
        });
}

module.exports = { endPointJSONData };
