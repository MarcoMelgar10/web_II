const { Router } = require("express");
const favoriteController = require("./favorite.controller");
const authenticate = require("../../middlewares/authenticate");
const requireRole = require("../../middlewares/requireRole");

const router = Router();

router.use(authenticate, requireRole("FOLLOWER"));

router.get("/", favoriteController.getAll);
router.post("/:creatorId", favoriteController.toggle);

module.exports = router;
