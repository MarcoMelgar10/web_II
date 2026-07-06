const { Router } = require("express");
const authController = require("./auth.controller");
const validate = require("../../middlewares/validate");
const authenticate = require("../../middlewares/authenticate");
const { registerDto, loginDto } = require("./auth.dto");

const router = Router();

router.post("/register", validate(registerDto), authController.register);
router.post("/login", validate(loginDto), authController.login);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
