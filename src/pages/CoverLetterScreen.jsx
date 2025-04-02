import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import CoverLetterDisplay from "./CoverLetterDisplay";
import axios from "axios";

const CoverLetterScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const coverLetter = location.state?.coverLetter || "No cover letter generated.";
  const keywords = location.state?.keywords || [];
  const resumeText = location.state?.resumeText || localStorage.getItem("resumeText") || "";
  const jobDescription = location.state?.jobDescription || localStorage.getItem("jobDescription") || "";

  // States for regeneration flow
  const [showOptions, setShowOptions] = useState(false);
  const [newStyle, setNewStyle] = useState("Professional");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedLetter, setRegeneratedLetter] = useState("");

  // Download current cover letter as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(coverLetter, 10, 10, { maxWidth: 180 });
    doc.save("cover_letter.pdf");
  };

  // Request a new version from the backend
  const handleRegenerate = async () => {
    // ✅ 유효성 검사 추가
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
    } catch (err) {
      console.error("Regeneration failed:", err);
      alert("Failed to generate a new version.");
    }
  
    setIsRegenerating(false);
  };
  
  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "80%", maxWidth: "900px" }}>
        <h2 className="fw-bold mb-4 text-center">📄 Generated Cover Letter</h2>

        <div className="p-3 border rounded bg-white" style={{ maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-line" }}>
          <CoverLetterDisplay coverLetter={coverLetter} keywords={keywords} />
        </div>

        <div className="text-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>❌ Close</button>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>📥 Download as PDF</button>
        </div>

        {/* Regenerate Button */}
        {!showOptions && (
          <div className="text-center mt-4">
            <button className="btn btn-outline-secondary" onClick={() => setShowOptions(true)}>
              🔁 Try Regenerating
            </button>
          </div>
        )}

        {/* Regenerate Options */}
        {showOptions && (
          <div className="mt-4">
            <h5 className="fw-bold">Regenerate Cover Letter with a New Style</h5>
            <div className="d-flex gap-2 mb-3">
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
              <button className="btn btn-primary" onClick={handleRegenerate} disabled={isRegenerating}>
                {isRegenerating ? "Generating..." : "Generate Again"}
              </button>
            </div>

            {/* Show regenerated version */}
            {regeneratedLetter && (
  <div className="mt-4">
    <h5 className="fw-bold">🆕 Regenerated Cover Letter</h5>
    <div className="p-3 border rounded bg-white" style={{ whiteSpace: "pre-line", maxHeight: "400px", overflowY: "auto" }}>
      <CoverLetterDisplay coverLetter={regeneratedLetter} keywords={keywords} />
    </div>

    {/* ✅ PDF Download Button for regenerated version */}
    <div className="text-end mt-2">
      <button
        className="btn btn-outline-primary"
        onClick={() => {
          const doc = new jsPDF();
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.text(regeneratedLetter, 10, 10, { maxWidth: 180 });
          doc.save("regenerated_cover_letter.pdf");
        }}
      >
        📥 Download Regenerated PDF
      </button>
    </div>
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterScreen;
