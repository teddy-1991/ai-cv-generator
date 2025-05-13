// CoverLetterScreen.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import CoverLetterDisplay from "./CoverLetterDisplay";
import axios from "axios";
import Header from '../components/Header';
import BackgroundWrapper from "../components/BackgroundWrapper";

const CoverLetterScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const coverLetter = location.state?.coverLetter || "No cover letter generated.";
  const keywords = location.state?.keywords || [];
  const resumeText = location.state?.resumeText || localStorage.getItem("resumeText") || "";
  const jobDescription = location.state?.jobDescription || localStorage.getItem("jobDescription") || "";

  const [showOptions, setShowOptions] = useState(false);
  const [newStyle, setNewStyle] = useState("Professional");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedLetter, setRegeneratedLetter] = useState("");
  const [isRegeneratedLocal, setIsRegeneratedLocal] = useState(false); // 추가

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(coverLetter, 10, 10, { maxWidth: 180 });
    doc.save("cover_letter.pdf");
  };

  const handleRegenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert("Resume or job description is missing for regeneration.");
      return;
    }

    setIsRegenerating(true);

    try {
      const response = await axios.post("http://localhost:5000/generate_cover_letter", {
        resume_text: resumeText,
        job_description: jobDescription,
        keywords: keywords,
        style: newStyle,
      });

      setRegeneratedLetter(response.data.cover_letter || "❌ Generation failed");
      setIsRegeneratedLocal(true);
    } catch (err) {
      console.error("Regeneration failed:", err);
      alert("Failed to generate a new version.");
    }

    setIsRegenerating(false);
  };

  return (
    <BackgroundWrapper>
      <Header />
      <small className="text-dark position-absolute bottom-0 end-0 m-2" style={{ zIndex: 2, fontSize: '0.8rem' }}>
        Photo by <a href="https://unsplash.com/@magnetme" className="text-blue text-decoration-underline" target="_blank" rel="noopener noreferrer">Magnet.me</a> on Unsplash
      </small>

      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <div className="card p-4 shadow-lg" style={{ width: "90%", backgroundColor: 'rgba(0, 0, 0, 0.7)', marginTop: "100px" }}>

          {/* 버튼 영역 */}
          <div className="d-flex justify-content-between  align-items-center mb-4">
            <button className="btn btn-outline-secondary"
              onClick={() => setShowOptions(true)}
              style={{
                backgroundColor: "#7C6CE0", color: "#f0f0f0", border: "none",
                padding: "0.6rem 1.2rem", fontSize: "1rem", fontWeight: "bold"
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = "#5f27cd"; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = "#8E7BEF"; }}
            >
              Create New Version
            </button>

            <h2 className="fw-bold text-center text-white">📄 Generated Cover Letter</h2>

            <button className="btn btn-secondary" onClick={() => navigate("/")}
              style={{ backgroundColor: "#7C6CE0", color: "#f0f0f0", border: "none", padding: "0.6rem 1.2rem", fontSize: "1rem" }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = "#5f27cd"; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = "#8E7BEF"; }}>
              CLOSE ❌
            </button>
          </div>
          
          {/* 옵션 선택 */}
          {showOptions && (
            <>
              <h5 className="fw-bold text-white">Regenerate Cover Letter with a New Style</h5>
              <div className="d-flex gap-2 mb-4">
                <select
                  className="form-select"
                  style={{ maxWidth: "250px" }}
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value)}
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Friendly">Friendly</option>
                </select>
                <button className="btn btn-primary" onClick={handleRegenerate} disabled={isRegenerating}
                style={{ backgroundColor: "#7C6CE0", color: "#f0f0f0", border: "none", fontSize: "1rem" }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = "#5f27cd"; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = "#8E7BEF"; }}>
                  {isRegenerating ? "Generating..." : "Generate Again"}
                </button>
              </div>
            </>
          )}

          {isRegeneratedLocal ? (
            <div className="text-center fst-italic mb-3" style={{ fontSize: "2rem", color: "#8E7BEF" }}>
              Updated with your selected style. You can make further changes below!
            </div>
          ) : (
            <div className="text-center fst-italic mb-3" style={{ fontSize: "2rem", color: "#8E7BEF" }}>
            Here's a starting point! Tweak it to match your style.
            </div>
          )}

          {/* 좌우 비교 레이아웃 */}
          <div className="d-flex gap-4">
            {/* 기존 커버레터 */}
            <div className="flex-fill p-3 border rounded bg-white" style={{ width: "50%", maxHeight: "700px", overflowY: "auto", whiteSpace: "pre-line", fontSize: "1.1rem" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Original Cover Letter</h6>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleDownloadPDF}
                >
                  <i className="bi bi-download"></i> Download as PDF
                </button>
              </div>
              <CoverLetterDisplay coverLetter={coverLetter} keywords={keywords} />
            </div>

            {/* 새로 생성된 커버레터 */}
            {regeneratedLetter && (
              <div className="flex-fill p-3 border rounded bg-white" style={{ width: "50%", maxHeight: "700px", overflowY: "auto", whiteSpace: "pre-line", fontSize: "1.1rem" }}>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Regenerated Version</h6>
                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      const doc = new jsPDF();
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(12);
                      doc.text(regeneratedLetter, 10, 10, { maxWidth: 180 });
                      doc.save("regenerated_cover_letter.pdf");
                    }}
                  >
                  <i className="bi bi-download"></i> Download as PDF
                </button>
                  </div>
                <CoverLetterDisplay coverLetter={regeneratedLetter} keywords={keywords} />
              </div>
            )}
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default CoverLetterScreen;
