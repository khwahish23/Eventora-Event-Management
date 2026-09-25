const express = require("express");

const router = express.Router();

const {
    RegisterUser,
    LoginUser,
    verifyOtp,
    forgotPassword,
    resetPassword
} = require("../controllers/authControllers");

router.post("/register", RegisterUser);

router.post("/login", LoginUser);

router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;