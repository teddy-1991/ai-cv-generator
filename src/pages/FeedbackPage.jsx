import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const FeedbackPage = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      message: message,
      rating: rating,
      user_email: "your@email.com",
    }, "YOUR_PUBLIC_KEY")
      .then(() => {
        setIsSent(true);
        setMessage("");
        setRating(0);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Something went wrong. Please try again later.");
      });
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "600px" }}>
      <h2 className="mb-3">💬 We'd love your feedback!</h2>
      {isSent ? (
        <div className="alert alert-success">Thank you! Your feedback has been sent.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Your Feedback</label>
            <textarea
              className="form-control"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rating</label><br />
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                style={{ fontSize: "1.5rem", cursor: "pointer", color: rating >= n ? "gold" : "lightgray" }}
                onClick={() => setRating(n)}
              >
                ⭐
              </span>
            ))}
          </div>

          <button type="submit" className="btn btn-primary">Submit Feedback</button>
        </form>
      )}
    </div>
  );
};

export default FeedbackPage;
