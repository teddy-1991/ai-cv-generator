import React from "react";

function highlightKeywords(text, keywords) {
    console.log("📌 원본 텍스트:", text);
    console.log("📌 키워드 목록:", keywords);
    
    const pattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
    return text.split(pattern).map((part, index) =>
      keywords.includes(part) ? (
        <span key={index} className="bg-warning fw-bold px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  }
  
  function CoverLetterDisplay({ coverLetter, keywords }) {
    return (
      <div className="p-4 border border-secondary rounded">
        {highlightKeywords(coverLetter, keywords)}
      </div>
    );
  }
  
  export default CoverLetterDisplay;
  