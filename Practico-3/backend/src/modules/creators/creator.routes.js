const { Router } = require("express");
const creatorController = require("./creator.controller");

const router = Router();

router.get("/", creatorController.getAll);
router.get("/search", creatorController.search);
router.get("/:id", creatorController.getPublicProfile);

module.exports = router;
