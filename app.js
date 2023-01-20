const express = require("express");
const app = express();
const { psqlErrors, customErrors, internalServerError } = require("./errors");
const apiRouter = require("./routers/api.router");

app.use(express.json());

app.use("/api", apiRouter);

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
