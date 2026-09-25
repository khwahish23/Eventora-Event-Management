import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    useNavigate,
    useParams
} from "react-router-dom";

function BookingDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const token =
        localStorage.getItem("token");


    const [event, setEvent] =
        useState(null);

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [sendingOtp, setSendingOtp] =
        useState(false);

    const [confirming, setConfirming] =
        useState(false);

    const [paymentStatus, setPaymentStatus] =
        useState("non_paid");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    useEffect(() => {

        if (!token) {

            navigate("/login");

            return;
        }


        const fetchEvent = async () => {

            try {

                const response =
                    await axios.get(
                        `http://localhost:5000/api/events/${id}`
                    );

                setEvent(
                    response.data
                );

            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    "Unable to load event."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchEvent();

    }, [id]);


    const sendOtp = async () => {

        try {

            setSendingOtp(true);
            setError("");
            setSuccess("");

            const response =
                await axios.post(
                    "http://localhost:5000/api/bookings/send-otp",
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setSuccess(
                response.data.message ||
                "OTP sent to your email."
            );

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to send OTP."
            );

        } finally {

            setSendingOtp(false);

        }
    };


    const confirmBooking = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!otp) {

            setError(
                "Please enter OTP."
            );

            return;
        }


        try {

            setConfirming(true);

            const response =
                await axios.post(
                    "http://localhost:5000/api/bookings/book",
                    {
                        eventId: id,
                        otp
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const bookingId =
                response.data.bookingId;


            const confirmResponse =
                await axios.put(
                    `http://localhost:5000/api/bookings/confirm/${bookingId}`,
                    {
                        paymentStatus
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            alert(
                confirmResponse.data.message ||
                "Booking confirmed successfully!"
            );

            navigate("/bookings");

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to confirm booking."
            );

        } finally {

            setConfirming(false);

        }
    };


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading-box">

                    <div className="loader"></div>

                    <h2>
                        Loading...
                    </h2>

                </div>

            </div>
        );
    }


    return (
        <div className="page-container">

            <div className="booking-page-card">

                <div className="booking-event-preview">

                    <img
                        src={
                            event?.imageUrl ||
                            "https://via.placeholder.com/500x300"
                        }
                        alt={event?.title}
                    />

                    <h1>
                        {event?.title}
                    </h1>

                    <p>
                        📍 {event?.location}
                    </p>

                    <p>
                        💰 ₹{event?.ticketPrice}
                    </p>

                </div>


                <div className="booking-form-section">

                    <p className="small-heading">
                        SECURE BOOKING
                    </p>

                    <h2>
                        Confirm Your Booking
                    </h2>

                    <p>
                        Verify your email using OTP
                        before booking.
                    </p>


                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="success-box">
                            {success}
                        </div>
                    )}


                    <button
                        className="secondary-btn full-btn"
                        onClick={sendOtp}
                        disabled={sendingOtp}
                    >
                        {sendingOtp
                            ? "Sending OTP..."
                            : "Send OTP"}
                    </button>


                    <form
                        onSubmit={confirmBooking}
                    >

                        <label>
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            maxLength="6"
                            placeholder="6 digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                )
                            }
                        />


                        <label>
                            Payment Status
                        </label>

                        <select
                            value={paymentStatus}
                            onChange={(e) =>
                                setPaymentStatus(
                                    e.target.value
                                )
                            }
                        >

                            <option value="non_paid">
                                Non Paid
                            </option>

                            <option value="paid">
                                Paid
                            </option>

                        </select>


                        <button
                            type="submit"
                            className="primary-btn full-btn"
                            disabled={confirming}
                        >
                            {confirming
                                ? "Confirming..."
                                : "Confirm Booking"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default BookingDetails;