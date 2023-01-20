const express = require("express");
const usersRouter = express.Router();
const { getUsers, getUser } = require("../controllers/users.controllers");

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
