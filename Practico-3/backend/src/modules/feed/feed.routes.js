const { Router } = require("express");
const feedController = require("./feed.controller");
const authenticate = require("../../middlewares/authenticate");
const requireRole = require("../../middlewares/requireRole");

const router = Router();

router.get("/", authenticate, requireRole("FOLLOWER"), feedController.getFeed);

module.exports = router;
