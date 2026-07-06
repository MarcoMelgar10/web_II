const { Router } = require("express");
const goalController = require("./goal.controller");
const authenticate = require("../../middlewares/authenticate");
const requireRole = require("../../middlewares/requireRole");
const validate = require("../../middlewares/validate");
const { createGoalDto } = require("./goal.dto");

const router = Router();

router.get("/creator/:creatorId", goalController.getByCreator);

router.post("/", authenticate, requireRole("CREATOR"), validate(createGoalDto), goalController.create);
router.delete("/:id", authenticate, requireRole("CREATOR"), goalController.remove);

module.exports = router;
