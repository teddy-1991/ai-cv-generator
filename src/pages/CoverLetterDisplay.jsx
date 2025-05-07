import React from "react";

// ⛑️ 정규식 예약문자 이스케이프 함수
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightKeywords(text, keywords) {
  console.log("📌 원본 텍스트:", text);
  console.log("📌 키워드 목록:", keywords);

  const cleanKeywords = (keywords || []).filter(
    (k) => typeof k === "string" && k.trim().length > 0
  );

  if (cleanKeywords.length === 0) return text;

  // ✅ 정규식 예약문자 이스케이프
  const escapedKeywords = cleanKeywords.map(escapeRegExp);

  // 정규식 생성
  const pattern = new RegExp(`\\b(${escapedKeywords.join("|")})\\b`, "gi");

  const lowerKeywords = cleanKeywords.map((k) => k.toLowerCase());

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
