import React, { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";

import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";

import BookingDetails from "./pages/BookingDetails";
import MyBookings from "./pages/MyBookings";

import "./App.css";

// =====================================================
// NAVBAR
// =====================================================

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onLogout();

    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          EVENTORA
        </Link>

        {/* NAVIGATION */}
        <div className="nav-links">

          <Link
            to="/"
            className={
              location.pathname === "/"
                ? "active-nav"
                : ""
            }
          >
            Home
          </Link>

          <Link
            to="/events"
            className={
              location.pathname === "/events"
                ? "active-nav"
                : ""
            }
          >
            Explore Events
          </Link>

          {isLoggedIn && (
            <Link
              to="/bookings"
              className={
                location.pathname === "/bookings"
                  ? "active-nav"
                  : ""
              }
            >
              My Bookings
            </Link>
          )}

          {/* ADMIN ONLY */}
          {user?.role === "admin" && (
            <Link
              to="/create-event"
              className="create-event-nav"
            >
              + Create Event
            </Link>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="nav-login"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-register"
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              <span className="welcome-user">
                Hi, {user?.name || "User"}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}


// =====================================================
// HOME PAGE
// =====================================================

function Home({ user }) {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            ✦ Discover • Connect • Experience
          </div>

          <h1>
            Create Memories.
            <br />
            <span>Attend Amazing Events.</span>
          </h1>

          <p>
            Discover exciting events, book your seats,
            and create unforgettable experiences with
            Eventora.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/events")}
            >
              Explore Events →
            </button>

            {!user && (
              <button
                className="secondary-btn"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            )}

          </div>

        </div>

        <div className="hero-visual">

          <div className="event-card card-one">
            <span>🎵</span>
            <div>
              <h4>Music Festival</h4>
              <p>Live • Music • Fun</p>
            </div>
          </div>

          <div className="event-card card-two">
            <span>💻</span>
            <div>
              <h4>Tech Conference</h4>
              <p>Learn • Build • Connect</p>
            </div>
          </div>

          <div className="event-card card-three">
            <span>🎨</span>
            <div>
              <h4>Art Exhibition</h4>
              <p>Creative • Artistic</p>
            </div>
          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section className="features-section">

        <div className="section-heading">
          <p>WHY EVENTORA?</p>
          <h2>Everything You Need For Events</h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              🔎
            </div>

            <h3>Discover Events</h3>

            <p>
              Find interesting events happening
              around you in one simple place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              🎟️
            </div>

            <h3>Easy Booking</h3>

            <p>
              Book your event seat quickly and
              securely with OTP verification.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              ✨
            </div>

            <h3>Great Experiences</h3>

            <p>
              Join events, meet people and create
              memorable experiences.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="home-cta">

        <h2>
          Ready to discover your next event?
        </h2>

        <p>
          Explore events and start your Eventora
          experience today.
        </p>

        <button
          onClick={() => navigate("/events")}
          className="primary-btn"
        >
          Explore Events →
        </button>

      </section>

    </div>
  );
}


// =====================================================
// APP
// =====================================================

function App() {

  const getStoredUser = () => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);

    } catch (error) {
      console.error(
        "Error reading user:",
        error
      );

      return null;
    }
  };

  const [user, setUser] = useState(
    getStoredUser()
  );

  // =================================================
  // LISTEN FOR LOGIN / LOGOUT
  // =================================================

  useEffect(() => {

    const updateUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener(
      "eventora-auth-change",
      updateUser
    );

    return () => {
      window.removeEventListener(
        "eventora-auth-change",
        updateUser
      );
    };

  }, []);


  return (
    <div className="app">

      <Navbar
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={
              <Home user={user} />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyOtp />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />

          <Route
            path="/booking/:id"
            element={<BookingDetails />}
          />

          <Route
            path="/bookings"
            element={<MyBookings />}
          />

          <Route
            path="/create-event"
            element={<CreateEvent />}
          />

          <Route
            path="/edit-event/:id"
            element={<CreateEvent />}
          />

        </Routes>

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-container">

          <div>
            <h2>EVENTORA</h2>

            <p>
              Discover. Book. Experience.
            </p>
          </div>

          <div className="footer-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/events">
              Explore Events
            </Link>

            {!user && (
              <Link to="/login">
                Login
              </Link>
            )}

          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Eventora. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default App;