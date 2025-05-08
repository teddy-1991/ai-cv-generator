import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header'; 
import BackgroundWrapper from "../components/BackgroundWrapper";

const Home = () => {
  const navigate = useNavigate();

  return (
    <BackgroundWrapper>
      <Header />
      <small className="text-dark position-absolute bottom-0 end-0 m-2"
      style={{ zIndex: 2, fontSize: '0.8rem' }}>
      Photo by <a href="https://unsplash.com/@magnetme" className="text-blue text-decoration-underline" target="_blank" rel="noopener noreferrer">Magnet.me</a> on Unsplash
      </small>

      {/* Content */}
      <div
        className="position-relative d-flex justify-content-between align-items-start"
        style={{ zIndex: 2, padding: '0 1.5rem', gap: '1rem', maxWidth: "90%", margin: "0 auto", width: "100%" }}
      >
        {/* Left Section */}
        <div
          className="text-dark p-4 rounded me-4"
          style={{
            width: '45%',
          }}
        >
          <h4 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Your AI-Powered Cover Letter Buddy</h4>
          <p style={{ fontSize: '1.5rem' }}>Writing a cover letter is tough. <br />
           We're here to make it simple, clear, and uniquely yours.</p>
          <button className="btn btn-lg" style={{ backgroundColor: "#8E7BEF", color: "white", fontWeight: "bold", transition: "all 0.3s ease", }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#5f27cd"; 
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#8E7BEF"; 
          }}
          onClick={() => navigate('/cv-input')}>
            Let's Start!
          </button>
        </div>

        {/* Right Section */}
        <div
          className="p-4 rounded shadow"
          style={{ width: '45%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
           }}
        >
          <h4 className="fw-bold mb-3 text-info">📝 How to Use</h4>
          <ol className="ps-3 text-white" style={{ fontSize: '1.5rem', color: '#333' }}>
          <li>Upload your resume (<strong style={{ color: '#ff4d4f' }}>PDF ONLY</strong>). </li>
            <li>Click on the uploaded file to review and confirm it’s correct.</li>
            <li>Copy and paste the job description from the job posting.</li>
            <li>Click Extract Keywords, then review them and select your cover letter style.</li>
            <li>Click Generate Cover Letter and download the PDF.</li>
          </ol>

          <h4 className="fw-bold text-warning mt-3">⚠ Please Note</h4>
          <ul className="ps-3 text-white" style={{ fontSize: '1.5rem' }}>
            <li>We recommend using the generated cover letter as a <strong style={{ color: '#ff4d4f' }}> DRAFT</strong>, not submitting it as-is.</li>
            <li>Always <strong style={{ color: '#ff4d4f' }}>DOUBLE-CHECK</strong> for irrelevant or incorrect details before applying.</li>
          </ul>
        </div>
      </div>
    
    </BackgroundWrapper>
  );
};

export default Home;
