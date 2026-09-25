import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    useNavigate,
    useParams
} from "react-router-dom";

function CreateEvent() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = !!id;

    const token =
        localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


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


    const [loading, setLoading] =
        useState(false);

    const [fetching, setFetching] =
        useState(isEditMode);

    const [error, setError] =
        useState("");


    // =================================================
    // ADMIN PROTECTION
    // =================================================

    useEffect(() => {

        if (!token || user?.role !== "admin") {

            navigate("/events", {
                replace: true
            });

        }

    }, []);


    // =================================================
    // LOAD EVENT FOR EDIT
    // =================================================

    useEffect(() => {

        if (!isEditMode) {
            return;
        }

        const loadEvent = async () => {

            try {

                const response =
                    await axios.get(
                        `http://localhost:5000/api/events/${id}`
                    );

                const event =
                    response.data;

                setFormData({

                    title:
                        event.title || "",

                    description:
                        event.description || "",

                    date: event.date
                        ? new Date(event.date)
                            .toISOString()
                            .slice(0, 16)
                        : "",

                    location:
                        event.location || "",

                    category:
                        event.category || "",

                    totalSeats:
                        event.totalSeats || "",

                    availableSeats:
                        event.availableSeats || "",

                    ticketPrice:
                        event.ticketPrice || "",

                    imageUrl:
                        event.imageUrl || ""

                });

            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    "Unable to load event"
                );

            } finally {

                setFetching(false);

            }
        };

        loadEvent();

    }, [id]);


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (
            !formData.title ||
            !formData.description ||
            !formData.date ||
            !formData.location ||
            !formData.category ||
            !formData.totalSeats ||
            !formData.availableSeats ||
            !formData.ticketPrice ||
            !formData.imageUrl
        ) {

            setError(
                "Please fill all fields."
            );

            return;
        }


        if (
            Number(formData.availableSeats) >
            Number(formData.totalSeats)
        ) {

            setError(
                "Available seats cannot be greater than total seats."
            );

            return;
        }


        try {

            setLoading(true);


            const data = {

                title:
                    formData.title,

                description:
                    formData.description,

                date:
                    formData.date,

                location:
                    formData.location,

                category:
                    formData.category,

                totalSeats:
                    Number(formData.totalSeats),

                availableSeats:
                    Number(formData.availableSeats),

                ticketPrice:
                    Number(formData.ticketPrice),

                imageUrl:
                    formData.imageUrl

            };


            if (isEditMode) {

                await axios.put(
                    `http://localhost:5000/api/events/${id}`,
                    data,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Event updated successfully!"
                );

            } else {

                await axios.post(
                    "http://localhost:5000/api/events",
                    data,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Event created successfully!"
                );

            }


            navigate("/events");

        } catch (error) {

            console.error(
                "Create/Edit event error:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Unable to save event."
            );

        } finally {

            setLoading(false);

        }
    };


    if (fetching) {

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


    return (
        <div className="page-container">

            <div className="form-page-header">

                <p className="small-heading">
                    ADMIN PANEL
                </p>

                <h1>
                    {isEditMode
                        ? "Edit Event"
                        : "Create New Event"}
                </h1>

                <p>
                    {isEditMode
                        ? "Update your event information."
                        : "Add a new event to Eventora."}
                </p>

            </div>


            <div className="event-form-card">

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="event-form"
                >

                    <div className="form-grid">

                        <div className="form-group full-width">

                            <label>
                                Event Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                placeholder="Enter event title"
                                value={formData.title}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                rows="5"
                                placeholder="Describe your event"
                                value={formData.description}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Date & Time
                            </label>

                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                placeholder="Event location"
                                value={formData.location}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
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

                                <option value="Sports">
                                    Sports
                                </option>

                                <option value="Education">
                                    Education
                                </option>

                                <option value="Art">
                                    Art
                                </option>

                                <option value="Business">
                                    Business
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Total Seats
                            </label>

                            <input
                                type="number"
                                name="totalSeats"
                                min="1"
                                placeholder="100"
                                value={formData.totalSeats}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Available Seats
                            </label>

                            <input
                                type="number"
                                name="availableSeats"
                                min="0"
                                placeholder="100"
                                value={formData.availableSeats}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Ticket Price
                            </label>

                            <input
                                type="number"
                                name="ticketPrice"
                                min="0"
                                placeholder="500"
                                value={formData.ticketPrice}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Image URL
                            </label>

                            <input
                                type="url"
                                name="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {formData.imageUrl && (

                        <div className="image-preview">

                            <p>
                                Image Preview
                            </p>

                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                            />

                        </div>

                    )}


                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/events")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Event"
                                    : "Create Event"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateEvent;