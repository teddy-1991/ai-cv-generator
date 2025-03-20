import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import rocker from "../assets/rocket.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-secondary">
      <div className="text-center">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <h1 className="text-white fw-bold me-2">AI CV Creator</h1>
          <img className="h-15 w-15" src={rocker} alt="rocket launch" />
        </div>
        <p className="text-light lead">Boost your job application with an AI-generated cover letter.</p>
        <button className="btn btn-primary btn-lg mt-3" onClick={() => navigate('/cv-input')}>
          Create a Cover Letter
        </button>
      </div>
    </div>
  );
};

export default Home;