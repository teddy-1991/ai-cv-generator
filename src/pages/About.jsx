import React from "react";
import Header from "../components/Header";
import BackgroundWrapper from "../components/BackgroundWrapper";

const About = () => {
  return (
    <BackgroundWrapper>
      <Header />
      <div className="container p-4 rounded shadow text-white mt-5" style={{ maxWidth: "60%", backgroundColor: "rgba(0, 0, 0, 0.7)", fontSize: "2rem" }}>
        <h1 className="mb-4">📘 About</h1>
        <p>
          <strong>GetInterviews</strong> is an AI-powered cover letter generator designed especially for non-native English speakers, international students, and newcomers.  
          Whether you lack confidence in writing, want to save time, or just need a strong starting point — this tool helps you create personalized, keyword-optimized cover letters using your resume and job description.  
          <br />
          <span className="text-warning">⚠ Please Note</span><br />The generated letters are intended as drafts. We recommend reviewing and editing them before submitting.
        </p>
        <p>
          This tool was created as a capstone project by Jooyoung Kim, with the goal of making application processes more efficient and data-driven.
        </p>
        <p>
          Technologies used include: <code>React</code>, <code>OpenAI API</code>, <code>EmailJS</code>, and <code>Bootstrap</code>.
        </p>
        <p>
          Feedback and feature suggestions are always welcome! 💬
        </p>
      </div>
    </BackgroundWrapper>
  );
};

export default About;
