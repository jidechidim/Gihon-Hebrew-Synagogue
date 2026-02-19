"use client";

import { useState } from "react";
import CTAButton from "../../components/CTAButton";

export default function GetInvolvedPage() {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    interests: [],
    otherDetails: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // success/error message

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormState((prev) => {
        const interests = prev.interests.includes(value)
          ? prev.interests.filter((i) => i !== value)
          : [...prev.interests, value];
        // Clear "otherDetails" if "Other" is unchecked
        return {
          ...prev,
          interests,
          otherDetails: value === "Other" && !checked ? "" : prev.otherDetails,
        };
      });
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("Full Name", formState.fullName);
    formData.append("Email", formState.email);
    if (formState.phone) formData.append("Phone", formState.phone);
    if (formState.location) formData.append("Location", formState.location);
    formState.interests.forEach((i) => formData.append("Interest", i));
    if (formState.otherDetails) formData.append("Other Details", formState.otherDetails);
    if (formState.message) formData.append("Message", formState.message);

    try {
      const res = await fetch("https://formspree.io/f/mdkwqard", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Thank you for submitting! We’ll be in touch soon." });
        setFormState({
          fullName: "",
          email: "",
          phone: "",
          location: "",
          interests: [],
          otherDetails: "",
          message: "",
        });
      } else {
        setStatus({ type: "error", message: "Oops! Something went wrong. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Error submitting form. Please check your connection." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="container narrow center form-section">
        <h1 className="page-title">Get Involved With Gihon Hebrew Synagogue</h1>
        <p className="subtitle page-subtitle">Let's get to know you more</p>
        <p className="note"><em>* Indicates required question</em></p>

        {status && (
          <div className={`form-status ${status.type}`}>
            {status.message}
          </div>
        )}

        <form className="gihon-form" onSubmit={handleSubmit}>
          <label>
            Full Name <span className="required">*</span>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              required
              value={formState.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            Email Address <span className="required">*</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              value={formState.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number (Optional)
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formState.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Location (Optional)
            <input
              type="text"
              name="location"
              placeholder="Enter your city or region"
              value={formState.location}
              onChange={handleChange}
            />
          </label>

          <fieldset>
            <legend>Area of Interest</legend>
            {[
              "Volunteering",
              "Donations & Fundraising",
              "Study/Classes",
              "Choir/Music Group",
              "Community Service Projects",
              "Other",
            ].map((item) => (
              <div key={item} className="checkbox-wrapper">
                <label>
                  <input
                    type="checkbox"
                    name="interest"
                    value={item}
                    checked={formState.interests.includes(item)}
                    onChange={handleChange}
                  />
                  {item}
                </label>
                {item === "Other" && formState.interests.includes("Other") && (
                  <input
                    type="text"
                    name="otherDetails"
                    placeholder="Please specify"
                    value={formState.otherDetails}
                    onChange={handleChange}
                    className="other-input"
                  />
                )}
              </div>
            ))}
          </fieldset>

          <label>
            Additional Notes / Message
            <textarea
              name="message"
              placeholder="Tell us more..."
              rows={5}
              value={formState.message}
              onChange={handleChange}
            />
          </label>

          <CTAButton type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </CTAButton>
        </form>
      </section>

      <style jsx>{`
        .form-section { padding: 3rem 1rem; }
        .gihon-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; background: var(--bg-light, #fafafa); padding: 2rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .gihon-form label { font-weight: 600; }
        .gihon-form input[type="text"], .gihon-form input[type="email"], .gihon-form input[type="tel"], .gihon-form textarea { width: 100%; padding: 0.7rem; border: 1px solid #ccc; border-radius: 5px; font: inherit; }
        .gihon-form fieldset { border: none; margin: 1rem 0; }
        .gihon-form legend { font-weight: 600; margin-bottom: 0.5rem; }
        .gihon-form .btn { align-self: flex-start; }
        .required { color: #c00; }
        .note { margin-bottom: 1rem; color: #666; font-size: 0.9rem; }
        input[type="checkbox"] { margin-right: 0.4rem; }
        .checkbox-wrapper { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .other-input { flex: 1; }
        .form-status { margin-bottom: 1rem; padding: 0.8rem 1rem; border-radius: 5px; }
        .form-status.success { background: #d4edda; color: #155724; }
        .form-status.error { background: #f8d7da; color: #721c24; }
      `}</style>
    </main>
  );
}
