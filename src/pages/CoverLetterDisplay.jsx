import React from "react";

function highlightKeywords(text, keywords) {
  console.log("📌 원본 텍스트:", text);
  console.log("📌 키워드 목록:", keywords);

  // 🛡️ 모든 비문자열 제거 + 양끝 공백 제거
  const cleanKeywords = (keywords || []).filter(
    (k) => typeof k === "string" && k.trim().length > 0
  );

  if (cleanKeywords.length === 0) return text; // 💡 하이라이트할 게 없으면 원본 리턴

  // 정규식 생성 (escape 처리도 포함하는 게 안전하지만 지금은 간단하게)
  const pattern = new RegExp(`\\b(${cleanKeywords.join("|")})\\b`, "gi");

  // 소문자 비교용 배열
  const lowerKeywords = cleanKeywords.map((k) => k.toLowerCase());

  // 매핑 처리
  return text.split(pattern).map((part, index) => {
    try {
      if (lowerKeywords.includes(part.toLowerCase())) {
        return (
          <span key={index} className="bg-warning fw-bold px-1 rounded">
            {part}
          </span>
        );
      }
    } catch (e) {
      console.warn("❌ 하이라이팅 중 오류 발생한 단어:", part, e);
    }

    return part;
  });
}


  
  function CoverLetterDisplay({ coverLetter, keywords }) {
    return (
      <div className="p-4 border border-secondary rounded">
        {highlightKeywords(coverLetter, keywords)}
      </div>
    );
  }
  
  export default CoverLetterDisplay;
  