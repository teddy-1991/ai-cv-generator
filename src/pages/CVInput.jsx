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

// ✅ 버튼 클릭 시 새로운 페이지로 이동하도록 수정
const handleGenerateCoverLetter = async () => {
  if (!resumePreview.trim() || !jobDescription) {
    alert("이력서 또는 잡 디스크립션을 입력하세요!");
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post("http://localhost:5000/generate_cover_letter", {
      resume_text: resumePreview,
      job_description: jobDescription,
    });

    setCoverLetter(response.data.cover_letter);

    // ✅ 새 페이지로 이동하면서 커버 레터 데이터 전달
    navigate("/cover-letter", { state: { coverLetter: response.data.cover_letter } });
  } catch (error) {
    console.error("❌ Cover Letter Generation Failed", error);
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

          <div className="col-md-6">
            <div className="border rounded p-3">
              <h5 className="fw-bold">Job description</h5>
              <textarea className="form-control" rows="8" placeholder="Paste job description text..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
            </div>
          </div>
        </div>

        <div className="text-end mt-3">
          <button className="btn btn-primary px-4 py-2 fw-bold" onClick={handleGenerateCoverLetter} disabled={loading}>{loading ? "Generating..." : "Generate Cover Letter"}</button>
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
