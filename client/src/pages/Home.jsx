import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import axios from "axios";


function EventDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");


    // =====================================================
    // GET EVENT
    // =====================================================

    useEffect(() => {

        const fetchEvent = async () => {

            try {

                const response = await axios.get(
                    `http://localhost:5000/api/events/${id}`
                );

                setEvent(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load event"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchEvent();

    }, [id]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("email");

        navigate("/");

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="loading-page">
                Loading event...
            </div>
        );

    }


    if (error) {

        return (
            <div className="error-page">
                <h2>{error}</h2>

                <Link to="/events">
                    Back to Events
                </Link>
            </div>
        );

    }


    if (!event) {

        return (
            <div className="error-page">
                <h2>Event not found</h2>

                <Link to="/events">
                    Back to Events
                </Link>
            </div>
        );

    }


    return (

        <div className="app-page">


            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <div
                    className="logo"
                    onClick={() => navigate("/")}
                >
                    EVENTORA
                </div>


                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/events">
                        Explore Events
                    </Link>


                    {token && (
                        <Link to="/bookings">
                            My Bookings
                        </Link>
                    )}


                    {token && role === "admin" && (
                        <Link to="/create-event">
                            Create Event
                        </Link>
                    )}


                    {!token && (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Create Account
                            </Link>
                        </>
                    )}


                    {token && (
                        <button
                            className="nav-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}

                </div>

            </nav>


            {/* ================= EVENT DETAILS ================= */}

            <main className="event-details-page">

                <div className="event-details-container">


                    {/* IMAGE */}

                    <div className="event-details-image">

                        <img
                            src={event.imageUrl}
                            alt={event.title}
                        />

                    </div>


                    {/* INFORMATION */}

                    <div className="event-details-content">

                        <span className="event-category">
                            {event.category}
                        </span>


                        <h1>
                            {event.title}
                        </h1>


                        <p className="event-description">
                            {event.description}
                        </p>


                        <div className="event-info-grid">


                            <div className="event-info-box">

                                <span>
                                    DATE
                                </span>

                                <strong>
                                    {new Date(
                                        event.date
                                    ).toLocaleDateString()}
                                </strong>

                            </div>


                            <div className="event-info-box">

                                <span>
                                    TIME
                                </span>

                                <strong>
                                    {new Date(
                                        event.date
                                    ).toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }
                                    )}
                                </strong>

                            </div>


                            <div className="event-info-box">

                                <span>
                                    LOCATION
                                </span>

                                <strong>
                                    {event.location}
                                </strong>

                            </div>


                            <div className="event-info-box">

                                <span>
                                    AVAILABLE SEATS
                                </span>

                                <strong>
                                    {event.availableSeats}
                                </strong>

                            </div>


                            <div className="event-info-box">

                                <span>
                                    TICKET PRICE
                                </span>

                                <strong>
                                    ₹{event.ticketPrice}
                                </strong>

                            </div>

                        </div>


                        {/* ================= BUTTONS ================= */}

                        <div className="event-action-buttons">


                            {/* ADMIN */}

                            {token && role === "admin" && (

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            `/edit-event/${event._id}`
                                        )
                                    }
                                >
                                    Edit Event
                                </button>

                            )}


                            {/* USER */}

                            {token && role !== "admin" && (

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            `/booking/${event._id}`
                                        )
                                    }
                                    disabled={
                                        event.availableSeats <= 0
                                    }
                                >
                                    {event.availableSeats > 0
                                        ? "Book Event"
                                        : "Sold Out"
                                    }
                                </button>

                            )}


                            {/* NOT LOGGED IN */}

                            {!token && (

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Login to Book
                                </button>

                            )}


                            <button
                                className="secondary-button"
                                onClick={() =>
                                    navigate("/events")
                                }
                            >
                                Back to Events
                            </button>

                        </div>

                    </div>

                </div>

            </main>


            {/* FOOTER */}

            <footer className="footer">

                <h3>
                    EVENTORA
                </h3>

                <p>
                    Your gateway to amazing events.
                </p>

            </footer>

        </div>

    );

}

export default EventDetails;