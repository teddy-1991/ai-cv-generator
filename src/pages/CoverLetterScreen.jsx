import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const CoverLetterScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const coverLetter = location.state?.coverLetter || "No cover letter generated.";

  // ✅ PDF 다운로드 기능
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(coverLetter, 10, 10, { maxWidth: 180 }); // PDF에 텍스트 추가
    doc.save("cover_letter.pdf"); // PDF 파일 저장
  };

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "80%", maxWidth: "900px" }}>
        <h2 className="fw-bold mb-4 text-center">📄 Generated Cover Letter</h2>

        <div className="p-3 border rounded bg-white" style={{ maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-line" }}>
          {coverLetter}
        </div>

        <div className="text-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>❌ Close</button>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>📥 Download as PDF</button>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterScreen;
