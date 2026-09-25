import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError(
                "Please enter email and password"
            );
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            // ==========================================
            // SAVE TOKEN
            // ==========================================

            localStorage.setItem(
                "token",
                response.data.token
            );

            // ==========================================
            // SAVE USER
            // ==========================================

            const userData = {
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            };

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            // ==========================================
            // TELL APP THAT LOGIN HAPPENED
            // ==========================================

            window.dispatchEvent(
                new Event("eventora-auth-change")
            );

            // ==========================================
            // GO TO EVENTS
            // ==========================================

            navigate("/events", {
                replace: true
            });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Login failed. Please try again."
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
                        Welcome Back
                    </h1>

                    <p>
                        Login to continue your Eventora
                        experience.
                    </p>

                </div>


                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleLogin}
                    className="auth-form"
                >

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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />


                    <div className="forgot-row">

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </div>


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Don't have an account?
                    </p>

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;