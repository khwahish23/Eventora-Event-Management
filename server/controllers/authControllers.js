const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { sendOTPEmail } = require("../utils/email");

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


// ===============================
// REGISTER USER
// ===============================
exports.RegisterUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Please provide name, email and password"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            isVerified: false
        });

        // Generate OTP
        const otp = generateOTP();

        // Delete old OTP if exists
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

        // Send OTP to email
        await sendOTPEmail(
            email,
            otp,
            "account_verification"
        );

        // Response
        res.status(201).json({
            message: "Registration successful. OTP sent to your email.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ===============================
// LOGIN USER
// ===============================
exports.LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }

        // Check verification
        if (!user.isVerified) {
            return res.status(400).json({
                error: "Please verify your account first"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = generateToken(
            user._id,
            user.role
        );

        // Response
        res.json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ===============================
// VERIFY OTP
// ===============================
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check fields
        if (!email || !otp) {
            return res.status(400).json({
                error: "Email and OTP are required"
            });
        }

        // Find OTP
        const otpRecord = await OTP.findOne({
            email: email,
            otp: otp,
            action: "account_verification"
        });

        // OTP not found
        if (!otpRecord) {
            return res.status(400).json({
                error: "Invalid or expired OTP"
            });
        }

        // Find and verify user
        const user = await User.findOneAndUpdate(
            { email: email },
            { isVerified: true },
            { new: true }
        );

        // User not found
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Delete OTP after successful verification
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
            message: "Account verified successfully. You can now log in.",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
};