import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const token = localStorage.getItem("token");


    // =====================================================
    // CREATE EVENT FORM
    // =====================================================

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        availableSeats: "",
        ticketPrice: "",
        imageUrl: ""
    });


    // =====================================================
    // EVENTS
    // =====================================================

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [eventsLoading, setEventsLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    // =====================================================
    // EDIT MODE
    // =====================================================

    const [editingEvent, setEditingEvent] = useState(null);


    // =====================================================
    // FETCH EVENTS
    // =====================================================

    useEffect(() => {

        if (!token || !user || user.role !== "admin") {
            return;
        }

        fetchEvents();

    }, []);


    const fetchEvents = async () => {

        try {

            setEventsLoading(true);

            const response = await axios.get(
                "http://localhost:5000/api/events"
            );

            setEvents(
                response.data.events
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load events."
            );

        } finally {

            setEventsLoading(false);

        }

    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    // =====================================================
    // CREATE EVENT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setMessage("");

        setError("");


        try {

            const response = await axios.post(

                "http://localhost:5000/api/events",

                {

                    ...formData,

                    totalSeats:
                        Number(formData.totalSeats),

                    availableSeats:
                        Number(formData.availableSeats),

                    ticketPrice:
                        Number(formData.ticketPrice)

                },

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );


            console.log(response.data);


            setMessage(
                "Event created successfully!"
            );


            setFormData({

                title: "",
                description: "",
                date: "",
                location: "",
                category: "",
                totalSeats: "",
                availableSeats: "",
                ticketPrice: "",
                imageUrl: ""

            });


            fetchEvents();


        } catch (error) {

            console.error(error);

            setError(

                error.response?.data?.error ||

                "Unable to create event."

            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // DELETE EVENT
    // =====================================================

    const handleDelete = async (eventId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            setError("");

            setMessage("");


            await axios.delete(

                `http://localhost:5000/api/events/${eventId}`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );


            setMessage(
                "Event deleted successfully!"
            );


            fetchEvents();


        } catch (error) {

            console.error(error);

            setError(

                error.response?.data?.error ||

                "Unable to delete event."

            );

        }

    };


    // =====================================================
    // START EDIT
    // =====================================================

    const handleEdit = (event) => {

        setEditingEvent(event);


        setFormData({

            title: event.title,

            description: event.description,

            date: event.date
                ? new Date(event.date)
                    .toISOString()
                    .slice(0, 16)
                : "",

            location: event.location,

            category: event.category,

            totalSeats:
                event.totalSeats,

            availableSeats:
                event.availableSeats,

            ticketPrice:
                event.ticketPrice,

            imageUrl:
                event.imageUrl

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =====================================================
    // UPDATE EVENT
    // =====================================================

    const handleUpdate = async (e) => {

        e.preventDefault();

        setLoading(true);

        setMessage("");

        setError("");


        try {

            const response = await axios.put(

                `http://localhost:5000/api/events/${editingEvent._id}`,

                {

                    ...formData,

                    totalSeats:
                        Number(formData.totalSeats),

                    availableSeats:
                        Number(formData.availableSeats),

                    ticketPrice:
                        Number(formData.ticketPrice)

                },

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );


            console.log(response.data);


            setMessage(
                "Event updated successfully!"
            );


            setEditingEvent(null);


            setFormData({

                title: "",
                description: "",
                date: "",
                location: "",
                category: "",
                totalSeats: "",
                availableSeats: "",
                ticketPrice: "",
                imageUrl: ""

            });


            fetchEvents();


        } catch (error) {

            console.error(error);

            setError(

                error.response?.data?.error ||

                "Unable to update event."

            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {

        setEditingEvent(null);

        setFormData({

            title: "",
            description: "",
            date: "",
            location: "",
            category: "",
            totalSeats: "",
            availableSeats: "",
            ticketPrice: "",
            imageUrl: ""

        });

        setMessage("");

        setError("");

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    };


    // =====================================================
    // ACCESS DENIED
    // =====================================================

    if (
        !token ||
        !user ||
        user.role !== "admin"
    ) {

        return (

            <div>

                <nav className="navbar">

                    <div className="navbar-container">

                        <Link
                            to="/"
                            className="logo"
                        >
                            Eventora
                        </Link>

                        <div className="nav-links">

                            <Link to="/">
                                Home
                            </Link>

                            <Link to="/events">
                                Events
                            </Link>

                            <Link to="/bookings">
                                My Bookings
                            </Link>

                        </div>

                    </div>

                </nav>


                <div className="events-message">

                    <h2>
                        Access Denied
                    </h2>

                    <p>
                        Only administrators can access
                        this page.
                    </p>

                    <br />

                    <Link
                        to="/"
                        className="event-button"
                    >
                        Back to Home
                    </Link>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN ADMIN PAGE
    // =====================================================

    return (

        <div>

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="navbar">

                <div className="navbar-container">

                    <Link
                        to="/"
                        className="logo"
                    >
                        Eventora
                    </Link>


                    <div className="nav-links">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/events">
                            Events
                        </Link>

                        <Link to="/bookings">
                            My Bookings
                        </Link>

                        <span className="admin-label">
                            Admin
                        </span>

                        <button
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </nav>


            {/* =========================
                ADMIN PAGE
            ========================= */}

            <section className="admin-page">

                <div className="admin-container">


                    {/* HEADER */}

                    <div className="admin-header">

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Create and manage Eventora events.
                        </p>

                    </div>


                    {/* =========================
                        CREATE / EDIT FORM
                    ========================= */}

                    <div className="admin-card">

                        <h2>

                            {editingEvent
                                ? "Edit Event"
                                : "Create New Event"}

                        </h2>


                        <p className="admin-card-description">

                            {editingEvent

                                ? "Update the event details below."

                                : "Enter the details below to create a new event."

                            }

                        </p>


                        {/* SUCCESS */}

                        {message && (

                            <div className="success-message">

                                {message}

                            </div>

                        )}


                        {/* ERROR */}

                        {error && (

                            <div className="error-message">

                                {error}

                            </div>

                        )}


                        <form
                            onSubmit={
                                editingEvent
                                    ? handleUpdate
                                    : handleSubmit
                            }
                        >


                            {/* TITLE */}

                            <div className="form-group">

                                <label>
                                    Event Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter event title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Enter event description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                />

                            </div>


                            {/* DATE */}

                            <div className="form-group">

                                <label>
                                    Event Date
                                </label>

                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* LOCATION */}

                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Enter event location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="Technology">
                                        Technology
                                    </option>

                                    <option value="Music">
                                        Music
                                    </option>

                                    <option value="Art">
                                        Art
                                    </option>

                                    <option value="Workshop">
                                        Workshop
                                    </option>

                                    <option value="Sports">
                                        Sports
                                    </option>

                                    <option value="Business">
                                        Business
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* SEATS */}

                            <div className="admin-form-row">

                                <div className="form-group">

                                    <label>
                                        Total Seats
                                    </label>

                                    <input
                                        type="number"
                                        name="totalSeats"
                                        placeholder="100"
                                        min="1"
                                        value={formData.totalSeats}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Available Seats
                                    </label>

                                    <input
                                        type="number"
                                        name="availableSeats"
                                        placeholder="100"
                                        min="0"
                                        value={formData.availableSeats}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* PRICE */}

                            <div className="form-group">

                                <label>
                                    Ticket Price
                                </label>

                                <input
                                    type="number"
                                    name="ticketPrice"
                                    placeholder="500"
                                    min="0"
                                    value={formData.ticketPrice}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* IMAGE */}

                            <div className="form-group">

                                <label>
                                    Event Image URL
                                </label>

                                <input
                                    type="url"
                                    name="imageUrl"
                                    placeholder="https://example.com/event-image.jpg"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* BUTTONS */}

                            <button
                                type="submit"
                                className="auth-button admin-submit-button"
                                disabled={loading}
                            >

                                {loading

                                    ? editingEvent
                                        ? "Updating Event..."
                                        : "Creating Event..."

                                    : editingEvent
                                        ? "Update Event"
                                        : "Create Event"

                                }

                            </button>


                            {/* CANCEL EDIT */}

                            {editingEvent && (

                                <button
                                    type="button"
                                    className="admin-cancel-button"
                                    onClick={cancelEdit}
                                >
                                    Cancel Edit
                                </button>

                            )}

                        </form>

                    </div>


                    {/* =========================
                        EVENT MANAGEMENT
                    ========================= */}

                    <div className="admin-events-section">

                        <div className="admin-events-header">

                            <div>

                                <h2>
                                    Manage Events
                                </h2>

                                <p>
                                    View, edit or delete your events.
                                </p>

                            </div>

                            <span className="event-count">

                                {events.length}{" "}
                                {events.length === 1
                                    ? "Event"
                                    : "Events"}

                            </span>

                        </div>


                        {/* LOADING */}

                        {eventsLoading && (

                            <div className="admin-events-message">

                                <h3>
                                    Loading events...
                                </h3>

                            </div>

                        )}


                        {/* NO EVENTS */}

                        {!eventsLoading &&
                            events.length === 0 && (

                                <div className="admin-events-message">

                                    <h3>
                                        No events found
                                    </h3>

                                    <p>
                                        Create your first event
                                        using the form above.
                                    </p>

                                </div>

                            )}


                        {/* EVENT LIST */}

                        {!eventsLoading &&
                            events.length > 0 && (

                                <div className="admin-events-grid">

                                    {events.map((event) => (

                                        <div
                                            className="admin-event-card"
                                            key={event._id}
                                        >

                                            {/* IMAGE */}

                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="admin-event-image"
                                            />


                                            {/* CONTENT */}

                                            <div className="admin-event-content">

                                                <span className="event-category">

                                                    {event.category}

                                                </span>


                                                <h3>
                                                    {event.title}
                                                </h3>


                                                <p className="admin-event-description">

                                                    {event.description}

                                                </p>


                                                <div className="admin-event-info">

                                                    <p>
                                                        📅{" "}
                                                        {new Date(
                                                            event.date
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                    </p>

                                                    <p>
                                                        📍{" "}
                                                        {event.location}
                                                    </p>

                                                    <p>
                                                        💺{" "}
                                                        {event.availableSeats}
                                                        {" / "}
                                                        {event.totalSeats}
                                                        {" "}seats available
                                                    </p>

                                                    <p>
                                                        🎟️ ₹
                                                        {event.ticketPrice}
                                                    </p>

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="admin-event-actions">

                                                    <Link
                                                        to={`/events/${event._id}`}
                                                        className="admin-view-button"
                                                    >
                                                        View
                                                    </Link>


                                                    <button
                                                        type="button"
                                                        className="admin-edit-button"
                                                        onClick={() =>
                                                            handleEdit(event)
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="admin-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                event._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                    </div>

                </div>

            </section>


            {/* FOOTER */}

            <footer className="footer">

                <h3>
                    Eventora
                </h3>

                <p>
                    Your gateway to amazing events.
                </p>

                <p>
                    © 2026 Eventora. All rights reserved.
                </p>

            </footer>

        </div>
    );
}


export default AdminDashboard;