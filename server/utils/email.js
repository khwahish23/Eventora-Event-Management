const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Send OTP Email
const sendOTPEmail = async (email, otp, action) => {

    const subject =
        action === "account_verification"
            ? "Eventora - Account Verification OTP"
            : "Eventora - Booking OTP";

    const message =
        action === "account_verification"
            ? `Your Eventora account verification OTP is ${otp}. This OTP is valid for a limited time.`
            : `Your Eventora event booking OTP is ${otp}. This OTP is valid for a limited time.`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message
    });
};


// Send Booking Email
const sendBookingEmail = async (email, eventTitle, bookingId) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Eventora - Booking Confirmation",
        text: `Your booking for ${eventTitle} has been created. Booking ID: ${bookingId}`
    });
};


module.exports = {
    sendOTPEmail,
    sendBookingEmail
};