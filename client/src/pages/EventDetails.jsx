import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    useNavigate,
    useParams
} from "react-router-dom";

function EventDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const token =
        localStorage.getItem("token");


    const fetchEvent = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `http://localhost:5000/api/events/${id}`
            );

            setEvent(response.data);

        } catch (error) {

            console.error(
                "Event details error:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Unable to load event."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchEvent();
    }, [id]);


    const handleDelete = async () => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:5000/api/events/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Event deleted successfully"
            );

            navigate("/events");

        } catch (error) {

            alert(
                error.response?.data?.error ||
                "Unable to delete event"
            );

        }
    };


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading-box">
                    <div className="loader"></div>

                    <h2>
                        Loading Event...
                    </h2>
                </div>

            </div>
        );
    }


    if (error || !event) {

        return (
            <div className="page-container">

                <div className="empty-state">

                    <div className="empty-icon">
                        ⚠️
                    </div>

                    <h2>
                        Event Not Found
                    </h2>

                    <p>
                        {error ||
                            "This event does not exist."}
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate("/events")
                        }
                    >
                        Back to Events
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="page-container">

            <button
                className="back-btn"
                onClick={() =>
                    navigate("/events")
                }
            >
                ← Back to Events
            </button>


            <div className="event-details-card">

                <div className="event-details-image">

                    <img
                        src={
                            event.imageUrl ||
                            "https://via.placeholder.com/800x500"
                        }
                        alt={event.title}
                    />

                </div>


                <div className="event-details-content">

                    <span className="category-badge">
                        {event.category}
                    </span>

                    <h1>
                        {event.title}
                    </h1>

                    <p className="event-details-description">
                        {event.description}
                    </p>


                    <div className="details-list">

                        <div>
                            <span>📅</span>
                            <div>
                                <small>
                                    Date & Time
                                </small>

                                <strong>
                                    {new Date(
                                        event.date
                                    ).toLocaleString()}
                                </strong>
                            </div>
                        </div>


                        <div>
                            <span>📍</span>
                            <div>
                                <small>
                                    Location
                                </small>

                                <strong>
                                    {event.location}
                                </strong>
                            </div>
                        </div>


                        <div>
                            <span>🎟️</span>
                            <div>
                                <small>
                                    Available Seats
                                </small>

                                <strong>
                                    {event.availableSeats}
                                </strong>
                            </div>
                        </div>


                        <div>
                            <span>💰</span>
                            <div>
                                <small>
                                    Ticket Price
                                </small>

                                <strong>
                                    ₹{event.ticketPrice}
                                </strong>
                            </div>
                        </div>

                    </div>


                    {/* ADMIN CONTROLS */}

                    {user?.role === "admin" ? (

                        <div className="admin-actions">

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    navigate(
                                        `/edit-event/${event._id}`
                                    )
                                }
                            >
                                ✏️ Edit Event
                            </button>

                            <button
                                className="delete-btn"
                                onClick={handleDelete}
                            >
                                🗑️ Delete Event
                            </button>

                        </div>

                    ) : (

                        <button
                            className="primary-btn book-main-btn"
                            disabled={
                                event.availableSeats <= 0
                            }
                            onClick={() => {

                                if (!token) {

                                    navigate(
                                        "/login",
                                        {
                                            state: {
                                                from:
                                                    `/events/${event._id}`
                                            }
                                        }
                                    );

                                    return;
                                }

                                navigate(
                                    `/booking/${event._id}`
                                );

                            }}
                        >
                            {event.availableSeats <= 0
                                ? "Sold Out"
                                : "Book This Event →"}
                        </button>

                    )}

                </div>

            </div>

        </div>
    );
}

export default EventDetails;