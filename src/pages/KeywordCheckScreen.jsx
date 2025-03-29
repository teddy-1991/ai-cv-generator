import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const KeywordCheckScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    resume_keywords = { technical_skills: [], transferable_skills: [] },
    job_keywords = { technical_skills: [], transferable_skills: [] },
    matched_keywords = { technical_skills: [], transferable_skills: [] },
    resumeText = "",
    jobDescription = ""
  } = location.state || {};

  const [keywords, setKeywords] = useState({
    resume: { ...resume_keywords },
    job: { ...job_keywords },
    matched: { ...matched_keywords }
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [targetSection, setTargetSection] = useState("matched"); // default
  const [targetType, setTargetType] = useState("technical_skills");
  const [loading, setLoading] = useState(false);

  // Add a new keyword to selected section/type
  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;

    const updated = { ...keywords };
    const section = updated[targetSection][targetType];

    if (!section.includes(trimmed)) {
      section.push(trimmed);
      setKeywords(updated);
      setNewKeyword("");
    }
  };

  // Delete a keyword from selected section/type
  const handleDeleteKeyword = (sectionKey, type, index) => {
    const updated = { ...keywords };
    updated[sectionKey][type].splice(index, 1);
    setKeywords(updated);
  };

  // Combine all keywords into a single list for cover letter generation
  const getAllKeywords = () => {
    const all = [
      ...keywords.resume.technical_skills,
      ...keywords.resume.transferable_skills,
      ...keywords.job.technical_skills,
      ...keywords.job.transferable_skills,
      ...keywords.matched.technical_skills,
      ...keywords.matched.transferable_skills
    ];
    // Remove duplicates
    return [...new Set(all)];
  };

  const handleConfirm = async () => {
    const allKeywords = getAllKeywords();

    if (!resumeText || !jobDescription || allKeywords.length === 0) {
      alert("Missing resume, job description or keywords.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate_cover_letter", {
        resume_text: resumeText,
        job_description: jobDescription,
        keywords: allKeywords
      });

      const coverLetter = response.data.cover_letter;

      navigate("/cover-letter", {
        state: {
          coverLetter,
          keywords: allKeywords
        }
      });
    } catch (error) {
      console.error("❌ Error generating cover letter", error);
      alert("Failed to generate cover letter.");
    }
    setLoading(false);
  };

  // Render tag UI
  const renderTags = (sectionKey, type) => (
    <div className="d-flex flex-wrap gap-2 mb-2">
      {keywords[sectionKey][type].map((keyword, idx) => (
        <div key={idx} className="badge bg-primary text-white d-flex align-items-center px-2 py-1">
          <span>{keyword}</span>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            style={{ fontSize: "0.6rem" }}
            onClick={() => handleDeleteKeyword(sectionKey, type, idx)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "90%", maxWidth: "1000px" }}>
        <h2 className="fw-bold mb-4 text-center">📝 Review & Edit Keywords</h2>

        {["resume", "job", "matched"].map((sectionKey) => (
          <div key={sectionKey} className="mb-4">
            <h5 className="fw-bold text-capitalize">
              {sectionKey === "resume" ? "📄 Resume" : sectionKey === "job" ? "📑 Job Description" : "✅ Matched"} Keywords
            </h5>
            <div>
              <label className="fw-semibold">Technical Skills:</label>
              {renderTags(sectionKey, "technical_skills")}
            </div>
            <div>
              <label className="fw-semibold">Transferable Skills:</label>
              {renderTags(sectionKey, "transferable_skills")}
            </div>
          </div>
        ))}

        <div className="border-top pt-3 mt-4">
          <h6 className="fw-bold">Add New Keyword</h6>
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <select className="form-select" value={targetSection} onChange={(e) => setTargetSection(e.target.value)}>
                <option value="resume">Resume</option>
                <option value="job">Job Description</option>
                <option value="matched">Matched</option>
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={targetType} onChange={(e) => setTargetType(e.target.value)}>
                <option value="technical_skills">Technical</option>
                <option value="transferable_skills">Transferable</option>
              </select>
            </div>
            <div className="col-md-4 d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Enter keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
              />
              <button className="btn btn-outline-secondary ms-2" onClick={handleAddKeyword}>
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="text-end mt-4">
          <button className="btn btn-success px-4 py-2 fw-bold" onClick={handleConfirm} disabled={loading}>
            {loading ? "Generating..." : "✅ Confirm and Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeywordCheckScreen;
