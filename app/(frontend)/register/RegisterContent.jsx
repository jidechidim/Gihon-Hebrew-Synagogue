"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./register.css";

export default function RegisterContent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventSelection: "",
    specialRequirements: "",
    numberOfGuests: 1,
    consent: false,
  });

  const searchParams = useSearchParams();
  const preselectId = searchParams.get("eventId");

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id,title")
          .order("date", { ascending: true });

        if (error) throw error;
        setEvents(data || []);

        if (preselectId && data?.length) {
          const match = data.find((ev) => ev.id === preselectId);
          if (match) {
            setFormState((prev) => ({
              ...prev,
              eventSelection: match.title,
            }));
          }
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [preselectId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("fullName", formState.fullName);
    formData.append("email", formState.email);
    if (formState.phone) formData.append("phone", formState.phone);
    formData.append("eventSelection", formState.eventSelection);
    if (formState.specialRequirements)
      formData.append("specialRequirements", formState.specialRequirements);
    formData.append("numberOfGuests", formState.numberOfGuests);
    formData.append("consent", formState.consent ? "Yes" : "No");

    try {
      const res = await fetch("https://formspree.io/f/xqayrqlk", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        alert("Thank you for registering! Redirecting to homepage.");
        window.location.href = "/";
      } else {
        alert("Oops! There was a problem submitting your form.");
      }
    } catch (err) {
      console.error(err);
      alert("Oops! There was a problem submitting your form.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="container narrow center mt-10">Loading events...</p>;

  if (error)
    return (
      <p className="container narrow center mt-10 text-red-600">{error}</p>
    );

  return (
    <section className="container narrow center form-section">
      <h1>Event Registration</h1>
      <p className="subtitle">
        Please fill out this form to register for an event.
      </p>

      <form className="gihon-form" onSubmit={handleSubmit}>
        <label>
          Full Name <span className="required">*</span>
          <input
            type="text"
            name="fullName"
            required
            value={formState.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </label>

        <label>
          Email Address <span className="required">*</span>
          <input
            type="email"
            name="email"
            required
            value={formState.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </label>

        <label>
          Event Selection <span className="required">*</span>
          <select
            name="eventSelection"
            required
            value={formState.eventSelection}
            onChange={handleChange}
          >
            <option value="">-- Select Event --</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.title}>
                {ev.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Special Requirements
          <textarea
            name="specialRequirements"
            rows={3}
            placeholder="Dietary restrictions, accessibility needs, etc."
            value={formState.specialRequirements}
            onChange={handleChange}
          />
        </label>

        <label>
          Number of Guests
          <input
            type="number"
            name="numberOfGuests"
            min="1"
            value={formState.numberOfGuests}
            onChange={handleChange}
          />
        </label>

        {/* ✅ Full-width, block-style checkbox */}
        <div className="checkbox-group">
          <label className="checkbox-label">
            I consent to being contacted with updates about this event
            <span className="required">*</span>
          </label>
          <input
            type="checkbox"
            name="consent"
            required
            checked={formState.consent}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Register"}
        </button>
      </form>

      <style jsx>{`
        .form-section {
          padding: 3rem 1rem;
        }
        .gihon-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
          background: var(--paper-2, #fafafa);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 500px;
          margin: 0 auto;
        }
        .gihon-form label {
          font-weight: 600;
        }
        .gihon-form input,
        .gihon-form select,
        .gihon-form textarea {
          width: 100%;
          padding: 0.7rem;
          border: 1px solid var(--outline);
          border-radius: var(--radius);
          font: inherit;
        }

        /* ✅ Block-style checkbox */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .checkbox-label {
          font-weight: 600;
        }
        .checkbox-group input[type="checkbox"] {
          width: auto;
          margin: 0;
        }

        .required {
          color: #c00;
        }
      `}</style>
    </section>
  );
}
