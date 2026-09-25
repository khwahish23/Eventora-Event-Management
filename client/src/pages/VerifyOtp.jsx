import React, { useState } from "react";
import axios from "axios";
import {
    Link,
    useNavigate
} from "react-router-dom";

function VerifyOtp() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState(
            localStorage.getItem(
                "verificationEmail"
            ) || ""
        );

    const [otp, setOtp] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleVerify = async (e) => {

        e.preventDefault();

        setError("");

        if (!email || !otp) {

            setError(
                "Please enter email and OTP."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await axios.post(
                    "http://localhost:5000/api/auth/verify-otp",
                    {
                        email,
                        otp
                    }
                );


            localStorage.setItem(
                "token",
                response.data.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify({
                    _id:
                        response.data._id,

                    name:
                        response.data.name,

                    email:
                        response.data.email,

                    role:
                        response.data.role
                })
            );


            localStorage.removeItem(
                "verificationEmail"
            );


            window.dispatchEvent(
                new Event(
                    "eventora-auth-change"
                )
            );


            alert(
                "Account verified successfully!"
            );


            navigate("/events", {
                replace: true
            });

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Invalid or expired OTP."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <div className="auth-logo">
                        ✓
                    </div>

                    <h1>
                        Verify Account
                    </h1>

                    <p>
                        Enter the OTP sent to your
                        email.
                    </p>

                </div>


                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleVerify}
                    className="auth-form"
                >

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                    />


                    <label>
                        OTP
                    </label>

                    <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter 6 digit OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value
                            )
                        }
                    />


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </form>


                <div className="auth-footer">

                    <Link to="/login">
                        Back to Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default VerifyOtp;