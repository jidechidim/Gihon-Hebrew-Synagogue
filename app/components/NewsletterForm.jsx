"use client";

import { useState } from "react";
import CTAButton from "./CTAButton";

export default function NewsletterForm({
  placeholder = "Enter your email address",
  submitText = "Subscribe",
}) {
  const [status, setStatus] = useState("");

  return (
    <>
      <form
        className="newsletter-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const email = e.target.email.value.trim();

          if (!email) {
            setStatus("Please enter a valid email.");
            return;
          }

          const formData = new FormData();
          formData.append("email", email);

          try {
            const res = await fetch("https://formspree.io/f/xvgbearn", {
              method: "POST",
              body: formData,
              headers: { Accept: "application/json" },
            });

            if (res.ok) {
              setStatus("Thank you for subscribing!");
              e.target.reset();
            } else {
              setStatus("Something went wrong. Please try again.");
            }
          } catch (err) {
            console.error(err);
            setStatus("Error submitting form. Check your connection.");
          }
        }}
      >
        <input
          type="email"
          name="email"
          placeholder={placeholder}
          required
        />
        <CTAButton type="submit" variant="primary">
          {submitText}
        </CTAButton>
      </form>
      {status ? <p className="form-msg active neutral">{status}</p> : null}
    </>
  );
}
