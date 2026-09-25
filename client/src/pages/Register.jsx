import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setError(
                "Please fill all fields"
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match"
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters"
            );
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            localStorage.setItem(
                "verificationEmail",
                email
            );

            alert(
                response.data.message ||
                "OTP sent to your email"
            );

            navigate("/verify-otp");

        } catch (error) {

            console.error(
                "Register error:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Registration failed"
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
                        E
                    </div>

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Join Eventora and discover amazing
                        events.
                    </p>

                </div>


                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleRegister}
                    className="auth-form"
                >

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />


                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />


                    <label>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;