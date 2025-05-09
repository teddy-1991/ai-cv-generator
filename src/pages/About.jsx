import React from "react";
import Header from "../components/Header";
import BackgroundWrapper from "../components/BackgroundWrapper";

const About = () => {
  return (
    <BackgroundWrapper>
      <Header />
      <div className="container p-4 rounded shadow text-white mt-5" style={{ maxWidth: "60%", backgroundColor: "rgba(0, 0, 0, 0.7)", fontSize: "2rem" }}>
        <h1 className="mb-4">📘 About GetInterviews</h1>
        <p>
          <strong>GetInterviews</strong> is an AI-powered cover letter generator built to help job seekers craft personalized, keyword-optimized cover letters based on their resume and job descriptions.
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
