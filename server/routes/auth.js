const express = require("express");

const router = express.Router();

const {
    RegisterUser,
    LoginUser,
    verifyOtp
} = require("../controllers/authControllers");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/verify-otp", verifyOtp);

module.exports = router;