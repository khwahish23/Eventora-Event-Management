import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyBookings() {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const token =
        localStorage.getItem("token");


    const fetchBookings = async () => {

        if (!token) {

            setError(
                "Please login to view your bookings."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            const response =
                await axios.get(
                    "http://localhost:5000/api/bookings/my",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setBookings(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.bookings || []
            );

        } catch (error) {

            console.error(
                "Bookings error:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Unable to load bookings."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchBookings();
    }, []);


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading-box">

                    <div className="loader"></div>

                    <h2>
                        Loading Your Bookings...
                    </h2>

                </div>

            </div>
        );
    }


    return (
        <div className="page-container">

            <section className="page-heading">

                <p className="small-heading">
                    YOUR ACTIVITY
                </p>

                <h1>
                    My Bookings
                </h1>

                <p>
                    View all your Eventora bookings.
                </p>

            </section>


            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}


            {!error &&
                bookings.length === 0 && (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🎟️
                        </div>

                        <h2>
                            No Bookings Yet
                        </h2>

                        <p>
                            You haven't booked any events
                            yet.
                        </p>

                        <Link
                            to="/events"
                            className="primary-btn"
                        >
                            Explore Events →
                        </Link>

                    </div>
                )}


            {bookings.length > 0 && (

                <div className="bookings-list">

                    {bookings.map((booking) => {

                        const event =
                            booking.eventId ||
                            booking.event;

                        return (

                            <div
                                className="booking-card"
                                key={booking._id}
                            >

                                <div className="booking-image">

                                    <img
                                        src={
                                            event?.imageUrl ||
                                            "https://via.placeholder.com/300x200"
                                        }
                                        alt={
                                            event?.title ||
                                            "Event"
                                        }
                                    />

                                </div>


                                <div className="booking-content">

                                    <h2>
                                        {event?.title ||
                                            "Event"}
                                    </h2>

                                    <p>
                                        📍{" "}
                                        {event?.location ||
                                            "Location unavailable"}
                                    </p>

                                    <p>
                                        📅{" "}
                                        {event?.date
                                            ? new Date(
                                                event.date
                                            ).toLocaleString()
                                            : "Date unavailable"}
                                    </p>


                                    <div className="booking-meta">

                                        <span>
                                            Booking ID:
                                            {" "}
                                            {booking._id}
                                        </span>

                                        <span>
                                            Amount:
                                            {" "}
                                            ₹
                                            {booking.amount ||
                                                0}
                                        </span>

                                    </div>


                                    <div className="booking-status-row">

                                        <span
                                            className={
                                                booking.status ===
                                                    "confirmed"
                                                    ? "status confirmed"
                                                    : "status pending"
                                            }
                                        >
                                            {booking.status}
                                        </span>

                                        <span
                                            className={
                                                booking.paymentStatus ===
                                                    "paid"
                                                    ? "status paid"
                                                    : "status unpaid"
                                            }
                                        >
                                            {booking.paymentStatus}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>
    );
}

export default MyBookings;