const { Router } = require("express");
const donationController = require("./donation.controller");
const authenticate = require("../../middlewares/authenticate");
const requireRole = require("../../middlewares/requireRole");
const validate = require("../../middlewares/validate");
const { createDonationDto } = require("./donation.dto");

const router = Router();

router.use(authenticate);

router.post("/", requireRole("FOLLOWER"), validate(createDonationDto), donationController.send);
router.get("/history", requireRole("FOLLOWER"), donationController.getFollowerHistory);
router.get("/income", requireRole("CREATOR"), donationController.getCreatorIncome);

module.exports = router;
