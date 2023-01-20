const express = require("express");
const apiRouter = express.Router();
const categoriesRouter = require("../routers/categories.router");
const commentsRouter = require("../routers/comments.router");
const reviewsRouter = require("../routers/reviews.router");
const usersRouter = require("../routers/users.router");
const { endPointsJSON } = require("../controllers/api.controllers");

apiRouter.route("/").get(endPointsJSON);

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
