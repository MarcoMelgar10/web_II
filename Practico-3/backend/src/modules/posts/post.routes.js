const { Router } = require("express");
const postController = require("./post.controller");
const authenticate = require("../../middlewares/authenticate");
const requireRole = require("../../middlewares/requireRole");
const upload = require("../../middlewares/upload");

const router = Router();

router.use(authenticate);

router.get("/creator/:creatorId", postController.getByCreator);
router.get("/:id", postController.getById);

router.post(
  "/",
  requireRole("CREATOR"),
  upload.single("image"),
  postController.create
);

router.delete("/:id", requireRole("CREATOR"), postController.remove);

module.exports = router;
