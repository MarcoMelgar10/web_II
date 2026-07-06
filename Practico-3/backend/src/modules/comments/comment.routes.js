const { Router } = require("express");
const commentController = require("./comment.controller");
const authenticate = require("../../middlewares/authenticate");
const requireRole = require("../../middlewares/requireRole");
const validate = require("../../middlewares/validate");
const { createCommentDto } = require("./comment.dto");

const router = Router();

router.use(authenticate);

router.get("/post/:postId", commentController.getByPost);
router.post("/", requireRole("FOLLOWER"), validate(createCommentDto), commentController.add);

module.exports = router;
