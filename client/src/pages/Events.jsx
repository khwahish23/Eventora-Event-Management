import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Events() {

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEvents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/events"
            );

            setEvents(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.events || []
            );

        } catch (error) {

            console.error(
                "Fetch events error:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Unable to load events."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchEvents();
    }, []);


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading-box">
                    <div className="loader"></div>

                    <h2>
                        Loading Events...
                    </h2>

                    <p>
                        Please wait while we find
                        available events.
                    </p>
                </div>

            </div>
        );
    }


    return (
        <div className="page-container">

            <section className="page-heading">

                <p className="small-heading">
                    DISCOVER
                </p>

                <h1>
                    Explore Events
                </h1>

                <p>
                    Find exciting events and book your
                    seat today.
                </p>

            </section>


            {error && (
                <div className="error-box event-error">
                    {error}

                    <button
                        onClick={fetchEvents}
                        className="retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            )}


            {!error && events.length === 0 && (

                <div className="empty-state">

                    <div className="empty-icon">
                        📅
                    </div>

                    <h2>
                        No Events Available
                    </h2>

                    <p>
                        There are currently no events
                        available.
                    </p>

                </div>

            )}


            {events.length > 0 && (

                <div className="events-grid">

                    {events.map((event) => (

                        <div
                            className="event-card-large"
                            key={event._id}
                        >

                            <div className="event-image-wrapper">

                                <img
                                    src={
                                        event.imageUrl ||
                                        "https://via.placeholder.com/600x350"
                                    }
                                    alt={event.title}
                                    className="event-image"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/600x350";
                                    }}
                                />

                                <span className="category-badge">
                                    {event.category}
                                </span>

                            </div>


                            <div className="event-card-content">

                                <h2>
                                    {event.title}
                                </h2>

                                <p className="event-description">
                                    {event.description}
                                </p>


                                <div className="event-info">

                                    <span>
                                        📅{" "}
                                        {new Date(
                                            event.date
                                        ).toLocaleDateString()}
                                    </span>

                                    <span>
                                        📍{" "}
                                        {event.location}
                                    </span>

                                    <span>
                                        🎟️{" "}
                                        {event.availableSeats} seats
                                    </span>

                                </div>


                                <div className="event-card-bottom">

                                    <strong>
                                        ₹{event.ticketPrice}
                                    </strong>

                                    <Link
                                        to={`/events/${event._id}`}
                                        className="view-event-btn"
                                    >
                                        View Event →
                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Events;