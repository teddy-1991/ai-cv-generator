import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CVInput = () => {
  
  const navigate = useNavigate();

  const [resumePreview, setResumePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeImages, setResumeImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResumeImages(response.data.images || []);
      setResumePreview(response.data.resume_text || "");
    } catch (error) {
      console.error("❌ File upload failed", error);
    }
  };

  const handleExtractKeywords = async () => {
    if (!resumePreview.trim() || !jobDescription) {
      alert("Upload resume or Write about job description!");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/extract_keywords", {
        resume_text: resumePreview,
        job_description: jobDescription,
      });
  
      // ✅ Send the new structured data
      navigate("/keywords", {
        state: {
          resume_keywords: response.data.resume_keywords,
          job_keywords: response.data.job_keywords,
          matched_keywords: response.data.matched_keywords,
          resumeText: resumePreview,
          jobDescription: jobDescription,
        },
      });
    } catch (error) {
      console.error("❌ Failed to extract keywords", error);
    }
    setLoading(false);
  };
  

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: "80%", maxWidth: "900px" }}>
        <h2 className="fw-bold mb-4 text-center">📄 AI-CV Generator</h2>

        <div className="row">
          <div className="col-md-6">
            <div className="border rounded p-3">
              <h5 className="fw-bold">Resume</h5>
              {resumePreview ? (
                <div className="border rounded p-3 bg-light" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <p>{resumePreview}</p>
                </div>
              ) : (
                <div className="border rounded p-2 text-center" style={{ cursor: "pointer" }}>
                  <input type="file" className="d-none" accept=".pdf,.docx" id="resume-upload" onChange={handleFileChange} />
                  <label htmlFor="resume-upload" className="d-block">
                    <span className="fw-bold">📂 Drag and Drop</span> or <span className="text-primary">Upload</span>
                  </label>
                </div>
              )}
              {resumeImages.length > 0 && (
                <div className="mt-3">
                  <h5>Preview</h5>
                  <div className="d-flex flex-wrap">
                    {resumeImages.map((img, index) => (
                      <img key={index} src={img} alt={`preview-${index}`} className="img-thumbnail m-2" style={{ maxWidth: "200px", cursor: "pointer" }} onClick={() => setSelectedImage(img)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {selectedImage && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
              style={{ zIndex: 9999, padding: "2rem" }} onClick={() => setSelectedImage(null)} >
              <img src={selectedImage} alt="Selected" className="shadow-lg"
                style={{
                  maxHeight: "95vh",
                  maxWidth: "95vw",
                  objectFit: "contain",
                  border: "4px solid white",
                  borderRadius: "8px"
                }}
              />
            </div>
          )}
          <div className="col-md-6">
            <div className="border rounded p-3">
              <h5 className="fw-bold">Job description</h5>
              <textarea className="form-control" rows="8" placeholder="Paste job description text..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
            </div>
          </div>
        </div>

        <div className="text-end mt-3">
          <button className="btn btn-primary px-4 py-2 fw-bold"
          onClick={handleExtractKeywords}  disabled={loading}>
            {loading ? "Extracting..." : "Generate Cover Letter"}
          </button>
        </div>

        {coverLetter && (
          <div className="mt-4 p-3 border rounded bg-light">
            <h5 className="fw-bold">Generated Cover Letter</h5>
            <pre className="p-3 border rounded bg-white">{coverLetter}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVInput;
