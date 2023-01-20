const { removeComment, updateComment } = require("../models/comments.models");

function deleteComment(req, res, next) {
    const { comment_id } = req.params;

    removeComment(comment_id)
        .then(() => {
            res.status(204).send({});
        })
        .catch((err) => {
            next(err);
        });
}

function patchComment(req, res, next) {
    const { comment_id } = req.params;
    const incrementalValue = req.body;

    updateComment(comment_id, incrementalValue)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { deleteComment, patchComment };
