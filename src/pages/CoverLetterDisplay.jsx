import React from "react";

// ✅ 동의어 테이블
const synonymMap = {
  "communication": [
    "communicate", "communicating", "communication skills", "effective communication",
    "clear communication", "verbal communication", "written communication"
  ],
  "teamwork": [
    "teamwork", "collaboration", "collaborate", "working with others", "cooperation",
    "team player", "contribute to a team"
  ],
  "problem-solving": [
    "problem-solving", "solve problems", "solving challenges", "troubleshooting",
    "find solutions", "resolve issues"
  ],
  "adaptability": [
    "adaptability", "adapt", "flexibility", "versatile", "adjust to change",
    "resilient", "respond to change"
  ],
  "attention to detail": [
    "attention to detail", "detail-oriented", "meticulous", "thorough", "accuracy",
    "precise", "careful", "error-free"
  ],
  "creativity": [
    "creativity", "creative thinking", "innovative", "think outside the box",
    "generate ideas", "original thinking"
  ],
  "organization": [
    "organization", "organizational skills", "keep things in order", "structured",
    "planning", "organize tasks", "stay organized"
  ],
  "time management": [
    "time management", "manage time", "prioritize tasks", "efficient use of time",
    "meet deadlines", "schedule tasks", "punctual"
  ],
  "leadership": [
    "leadership", "lead a team", "guidance", "mentorship", "delegation",
    "inspire others", "take initiative", "manage people"
  ],
  "initiative": [
    "initiative", "proactive", "self-starter", "drive", "take action",
    "go-getter", "independent", "motivation"
  ],
  "critical thinking": [
    "critical thinking", "analyze", "logical thinking", "evaluate situations",
    "reasoning", "judgment", "assess options"
  ],
  "interpersonal skills": [
    "interpersonal skills", "relationship-building", "social skills",
    "people skills", "rapport", "empathy", "connect with others"
  ],
  "work ethic": [
    "work ethic", "reliable", "dedicated", "hardworking", "responsible",
    "committed", "self-disciplined", "dependable"
  ],
  "decision-making": [
    "decision-making", "make decisions", "sound judgment", "choose solutions",
    "evaluate options", "weigh alternatives", "decisive"
  ],
  "collaboration": [
    "collaboration", "work together", "team effort", "joint effort",
    "cooperation", "contribute to a team", "partnering"
  ]
};


function getAllKeywordVariants(keywords) {
  const lowerKeywords = (keywords || []).map(k => k.toLowerCase());
  let variants = new Set();

  lowerKeywords.forEach(k => {
    variants.add(k);
    const synonyms = synonymMap[k];
    if (synonyms && synonyms.length) {
      synonyms.forEach(s => variants.add(s.toLowerCase()));
    }
  });

  return Array.from(variants);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightKeywords(text, keywords) {
  const variants = getAllKeywordVariants(keywords);
  if (variants.length === 0) return text;

  const escaped = variants.map(escapeRegExp);
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  return text.split(pattern).map((part, index) => {
    if (variants.includes(part.toLowerCase())) {
      return (
        <span key={index} className="bg-warning fw-bold px-1 rounded">
          {part}
        </span>
      );
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
