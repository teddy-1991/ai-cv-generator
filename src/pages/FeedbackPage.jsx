import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Header from '../components/Header';
import BackgroundWrapper from "../components/BackgroundWrapper";
import { useNavigate } from "react-router-dom"; 


const FeedbackPage = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [isSent, setIsSent] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        message: message,
        rating: rating,
        name: "Anonymous",
        email: "no-reply@getinterviews.com",
        time: new Date().toLocaleString(),
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setIsSent(true);
      setMessage("");
      setRating(0);

      setTimeout(() => {
        navigate("/"); 
      }, 1500);
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      alert("Something went wrong. Please try again later.");
    });
  };

  return (
    <BackgroundWrapper>
      <Header />
      <small className="text-dark position-absolute bottom-0 end-0 m-2" style={{ zIndex: 2, fontSize: '0.8rem' }}>
        Photo by <a href="https://unsplash.com/@magnetme" className="text-blue text-decoration-underline" target="_blank" rel="noopener noreferrer">Magnet.me</a> on Unsplash
      </small>

      <div className="container p-4 rounded shadow text-white mt-4" style={{ maxWidth: "60%", backgroundColor: 'rgba(0, 0, 0, 0.7)', marginTop: "100px" }}>
        <h2 className="mb-4">💬 We'd love your feedback!</h2>
        {isSent ? (
          <div className="alert alert-success">Thank you! Your feedback has been sent.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Feedback</label>
              <textarea
                className="form-control"
                rows="7"
                style={{ borderWidth: "2px" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="d-flex align-items-center gap-2 mb-4">
                <label className="form-label m-0" style={{ fontSize: "1.2rem" }}>Give Us Stars:</label>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    style={{
                        fontSize: "1.8rem",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer"
                    }}
                    >
                {rating >= n ? (
                    <span style={{ color: "gold", fontSize: "2rem" }}>⭐</span>
                    ) : (
                    <span style={{ color: "white", fontSize: "2rem" }}>☆</span>
                    )}    
                    </button>
                    ))}
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn"
                style={{
                  backgroundColor: "#7C6CE0", color: "#f0f0f0", border: "none",
                  padding: "0.6rem 1.2rem", fontSize: "1rem", fontWeight: "bold"
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = "#5f27cd"; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = "#8E7BEF"; }}
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </BackgroundWrapper>
  );
};

export default FeedbackPage;
