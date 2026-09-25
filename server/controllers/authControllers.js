const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const {
    sendOTPEmail
} = require("../utils/email");


// =====================================================
// GENERATE 6 DIGIT OTP
// =====================================================

const generateOTP = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};


// =====================================================
// REGISTER USER
// =====================================================

exports.RegisterUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check required fields

        if (!name || !email || !password) {

            return res.status(400).json({
                error:
                    "Please provide name, email and password"
            });

        }


        // Check if user already exists

        const existingUser = await User.findOne({
            email: email
        });


        if (existingUser) {

            return res.status(400).json({
                error:
                    "User already exists with this email"
            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // IMPORTANT:
        // Every newly registered account is a USER.
        // Admin should be assigned manually.

        const user = await User.create({

            name: name,

            email: email,

            password: hashedPassword,

            role: "user",

            isVerified: false

        });


        // Generate OTP

        const otp = generateOTP();


        // Remove old verification OTP

        await OTP.findOneAndDelete({

            email: email,

            action: "account_verification"

        });


        // Save new OTP

        await OTP.create({

            email: email,

            otp: otp,

            action: "account_verification"

        });


        // Send OTP

        await sendOTPEmail(
            email,
            otp,
            "account_verification"
        );


        // Response

        res.status(201).json({

            message:
                "Registration successful. OTP sent to your email.",

            user: {

                _id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                isVerified: user.isVerified

            }

        });


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        res.status(500).json({

            error: error.message

        });

    }

};



// =====================================================
// LOGIN USER
// =====================================================

exports.LoginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check required fields

        if (!email || !password) {

            return res.status(400).json({

                error:
                    "Email and password are required"

            });

        }


        // Find user

        const user = await User.findOne({
            email: email
        });


        if (!user) {

            return res.status(400).json({

                error:
                    "Invalid email or password"

            });

        }


        // Check verification

        if (!user.isVerified) {

            return res.status(400).json({

                error:
                    "Please verify your account first"

            });

        }


        // Compare password

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(400).json({

                error:
                    "Invalid email or password"

            });

        }


        // Generate JWT

        const token = generateToken(
            user._id,
            user.role
        );


        // Send response

        res.json({

            message:
                "Login successful",

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            token: token

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            error: error.message

        });

    }

};



// =====================================================
// VERIFY ACCOUNT OTP
// =====================================================

exports.verifyOtp = async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;


        // Check fields

        if (!email || !otp) {

            return res.status(400).json({

                error:
                    "Email and OTP are required"

            });

        }


        // Find OTP

        const otpRecord = await OTP.findOne({

            email: email,

            otp: otp,

            action: "account_verification"

        });


        if (!otpRecord) {

            return res.status(400).json({

                error:
                    "Invalid or expired OTP"

            });

        }


        // Verify user

        const user =
            await User.findOneAndUpdate(

                {
                    email: email
                },

                {
                    isVerified: true
                },

                {
                    new: true
                }

            );


        if (!user) {

            return res.status(404).json({

                error:
                    "User not found"

            });

        }


        // Delete OTP

        await OTP.deleteMany({

            email: email,

            action: "account_verification"

        });


        // Generate token

        const token = generateToken(
            user._id,
            user.role
        );


        // Response

        res.json({

            message:
                "Account verified successfully. You can now log in.",

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            token: token

        });


    } catch (error) {

        console.error(
            "Verify OTP Error:",
            error
        );


        res.status(500).json({

            error: error.message

        });

    }

};



// =====================================================
// FORGOT PASSWORD
// SEND PASSWORD RESET OTP
// =====================================================

exports.forgotPassword = async (req, res) => {

    try {

        const {
            email
        } = req.body;


        // Check email

        if (!email) {

            return res.status(400).json({

                error:
                    "Email is required"

            });

        }


        // Find user

        const user = await User.findOne({

            email: email

        });


        if (!user) {

            return res.status(404).json({

                error:
                    "No account found with this email"

            });

        }


        // Generate OTP

        const otp = generateOTP();


        // Delete previous password reset OTP

        await OTP.findOneAndDelete({

            email: email,

            action: "password_reset"

        });


        // Save new OTP

        await OTP.create({

            email: email,

            otp: otp,

            action: "password_reset"

        });


        // Send OTP email

        await sendOTPEmail(

            email,

            otp,

            "password_reset"

        );


        // Response

        res.json({

            message:
                "Password reset OTP sent to your email"

        });


    } catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );


        res.status(500).json({

            error: error.message

        });

    }

};



// =====================================================
// RESET PASSWORD
// =====================================================

exports.resetPassword = async (req, res) => {

    try {

        const {
            email,
            otp,
            newPassword,
            confirmPassword
        } = req.body;


        // Check fields

        if (
            !email ||
            !otp ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({

                error:
                    "Email, OTP and passwords are required"

            });

        }


        // Check passwords match

        if (
            newPassword !== confirmPassword
        ) {

            return res.status(400).json({

                error:
                    "Passwords do not match"

            });

        }


        // Check password length

        if (newPassword.length < 6) {

            return res.status(400).json({

                error:
                    "Password must be at least 6 characters long"

            });

        }


        // Find password reset OTP

        const otpRecord =
            await OTP.findOne({

                email: email,

                otp: otp,

                action: "password_reset"

            });


        if (!otpRecord) {

            return res.status(400).json({

                error:
                    "Invalid or expired OTP"

            });

        }


        // Find user

        const user =
            await User.findOne({

                email: email

            });


        if (!user) {

            return res.status(404).json({

                error:
                    "User not found"

            });

        }


        // Hash new password

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // Update password

        user.password =
            hashedPassword;


        await user.save();


        // Delete used OTP

        await OTP.deleteMany({

            email: email,

            action: "password_reset"

        });


        // Response

        res.json({

            message:
                "Password reset successfully. You can now login."

        });


    } catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );


        res.status(500).json({

            error: error.message

        });

    }

};