const { Router } = require("express");
const creatorProfileController = require("./creatorProfile.controller");
const authenticate = require("../../middlewares/authenticate");
const requireRole = require("../../middlewares/requireRole");
const validate = require("../../middlewares/validate");
const upload = require("../../middlewares/upload");
const { createProfileDto, updateProfileDto } = require("./creatorProfile.dto");

const router = Router();

router.use(authenticate, requireRole("CREATOR"));

router.get("/me", creatorProfileController.getMe);
router.post("/", validate(createProfileDto), creatorProfileController.create);
router.put("/", validate(updateProfileDto), creatorProfileController.update);
router.post("/avatar", upload.single("avatar"), creatorProfileController.uploadAvatar);
router.post("/banner", upload.single("banner"), creatorProfileController.uploadBanner);

module.exports = router;
