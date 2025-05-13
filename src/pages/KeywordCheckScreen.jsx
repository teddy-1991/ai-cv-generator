import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';
import BackgroundWrapper from "../components/BackgroundWrapper";

const KeywordCheckScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const normalize = (str) =>
    str.trim().toLowerCase().replace(/-/g, "").replace(/\s+/g, "");

  const calculateMatchedKeywords = (resume, job) => {
    const matchedTechnical = resume.technical_skills.filter(resumeSkill =>
      job.technical_skills.some(jdSkill =>
        normalize(jdSkill).includes(normalize(resumeSkill))
      )
    );

    const matchedTransferable = resume.transferable_skills.filter(resumeSkill =>
      job.transferable_skills.some(jdSkill =>
        normalize(jdSkill).includes(normalize(resumeSkill))
      )
    );

    return {
      technical_skills: matchedTechnical,
      transferable_skills: matchedTransferable
    };
  };

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

  useEffect(() => {
    const updatedMatched = calculateMatchedKeywords(keywords.resume, keywords.job);
    setKeywords(prev => ({
      ...prev,
      matched: updatedMatched
    }));
  }, []);

  const [selectedStyle, setSelectedStyle] = useState("Professional");
  const [newKeyword, setNewKeyword] = useState("");
  const [targetSection, setTargetSection] = useState("matched");
  const [targetType, setTargetType] = useState("technical_skills");
  const [loading, setLoading] = useState(false);

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;

    const updated = { ...keywords };
    const section = updated[targetSection][targetType];

    if (!section.includes(trimmed)) {
      section.push(trimmed);
      updated.matched = calculateMatchedKeywords(updated.resume, updated.job);
      setKeywords(updated);
      setNewKeyword("");
    }
  };

  const handleDeleteKeyword = (sectionKey, type, index) => {
    const updated = { ...keywords };
    updated[sectionKey][type].splice(index, 1);
    updated.matched = calculateMatchedKeywords(updated.resume, updated.job);
    setKeywords(updated);
  };

  const getMatchedKeywordsOnly = () => {
    return [
      ...keywords.matched.technical_skills,
      ...keywords.matched.transferable_skills
    ];
  };

  const handleConfirm = async () => {
    const matchedKeywords = getMatchedKeywordsOnly();

    if (!resumeText || !jobDescription || matchedKeywords.length === 0) {
      alert("Missing resume, job description or matched keywords.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate_cover_letter", {
        resume_text: resumeText,
        job_description: jobDescription,
        keywords: matchedKeywords,
        style: selectedStyle
      });

      const coverLetter = response.data.cover_letter;

      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobDescription", jobDescription);
      navigate("/cover-letter", {
        state: {
          coverLetter,
          keywords: matchedKeywords,
          style: selectedStyle,
          resumeText,
          jobDescription,
          isRegenerated: false
        }
      });
    } catch (error) {
      console.error("❌ Error generating cover letter", error);
      alert("Failed to generate cover letter.");
    }
    setLoading(false);
  };

  const renderTags = (sectionKey, type, align = "start") => {
    const items = keywords[sectionKey][type];
    return (
      <div className={`d-flex flex-wrap gap-2 mb-2 justify-content-${align} text-center`}>
        {items.length > 0 ? (
          items.map((keyword, idx) => (
            <div
              key={idx}
              className="badge text-white d-flex align-items-center"
              style={{
                backgroundColor: "#5f27cd",
                padding: "0.5rem 0.9rem",
                fontSize: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <span>{keyword}</span>
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                style={{ fontSize: "0.6rem" }}
                onClick={() => handleDeleteKeyword(sectionKey, type, idx)}
              />
            </div>
          ))
        ) : (
          <div className="fst-italic" style={{ color: "red", fontSize: "1.1rem" }}>
            No matched keywords found.
          </div>
        )}
      </div>
    );
  };
  

  return (
    <BackgroundWrapper>
      <Header />
      <small className="text-dark position-absolute bottom-0 end-0 m-2"
        style={{ zIndex: 2, fontSize: '0.8rem' }}>
        Photo by <a href="https://unsplash.com/@magnetme" className="text-blue text-decoration-underline" target="_blank" rel="noopener noreferrer">Magnet.me</a> on Unsplash
      </small>

      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <div className="card p-4 shadow-lg" style={{ width: "80%", backgroundColor: 'rgba(0, 0, 0, 0.7)', marginTop: "100px" }}>
          <h2 className="fw-bold mb-4 text-center text-white">📝 Review & Edit Keywords</h2>

          <div className="row align-items-center mb-4">
            {/* Style Dropdown */}
            <div className="col-md-6">
              <label className="fw-bold text-white" style={{ fontSize: "1.25rem" }}>
                Select Writing Style:
              </label>
              <select
                className="form-select mt-2"
                style={{ maxWidth: "250px" }}
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
              >
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Friendly">Friendly</option>
              </select>
            </div>

            {/* Confirm 버튼 */}
            <div className="col-md-6 text-end mt-4">
              <button
                className="btn fw-bold"
                style={{
                  backgroundColor: "#7C6CE0",
                  color: "#f0f0f0",
                  border: "none",
                  padding: "0.6rem 1.2rem",
                  fontSize: "1rem",
                  marginTop: "10px"
                }}
                onClick={handleConfirm}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#5f27cd"; 
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#8E7BEF"; 
                }}
              >
                {loading ? "Generating..." : "Confirm and Generate"}
              </button>
            </div>
          </div>

          {/* Resume & Job Keywords side-by-side */}
          <div className="row border-top">
            <div className="col-md-6 mb-4 text-white mt-4">
              <h5 className="fw-bold text-center">📄 Resume Keywords</h5>
              <label className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>Technical Skills</label>
              {renderTags("resume", "technical_skills", "start")}
              <label className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>Transferable Skills</label>
              {renderTags("resume", "transferable_skills", "start")}
            </div>
            <div className="col-md-6 my-4 text-white">
              <h5 className="fw-bold text-center">📑 Job Description Keywords</h5>
              <label className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>Technical Skills</label>
              {renderTags("job", "technical_skills", "start")}
              <label className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>Transferable Skills</label>
              {renderTags("job", "transferable_skills", "start")}
            </div>
          </div>

          {/* Matched Keywords */}
          <div className="mb-4 text-white text-center border-top">          
            <h5 className="fw-bold mt-4">✅ Matched Keywords</h5>
            <p className="fst-italic mb-1" style={{ fontSize: "1rem", color: "#8E7BEF" }}>
              Matched keywords are automatically generated based on resume and job description.
            </p>
            <label className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>Technical Skills</label>
            {renderTags("matched", "technical_skills", "center")}
            <label className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>Transferable Skills</label>
            {renderTags("matched", "transferable_skills", "center")}
          </div>

          {/* Add new keyword */}
          <div className="border-top pt-3 mt-4">
            <h5 className="fw-bold text-white">Add New Keyword</h5>
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <select className="form-select" value={targetSection} onChange={(e) => setTargetSection(e.target.value)}>
                  <option value="resume">Resume</option>
                  <option value="job">Job Description</option>
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
                <button className="btn text-white ms-2" style={{ backgroundColor: "#8E7BEF" }} onClick={handleAddKeyword}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#5f27cd"; 
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#8E7BEF"; 
                }}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default KeywordCheckScreen;
