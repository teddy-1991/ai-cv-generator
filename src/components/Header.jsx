import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo-transparent.png";
import { useNavigate } from "react-router-dom"; 

const Header = () => {
  const navigate = useNavigate();

  return (
    <div
      className="position-absolute top-0 start-0 w-100 d-flex justify-content-between align-items-center px-4"
      style={{ zIndex: 10, height: "80px" }}
    >
      <img src={logo} alt="logo" style={{ width: 120, height: 120, marginLeft: "70px", cursor: "pointer" }} 
      onClick={() => navigate("/")} />

      <div className="d-flex justify-content-center gap-2" style={{ marginRight: "80px" }}>
        <Link
          to="/feedback"
          className="btn"
          style={{ fontWeight: "bold", color: "#8E7BEF", fontSize: "1.5rem" }}
        >
          Feedback
        </Link>
        <Link
          to="/about"
          className="btn"
          style={{ fontWeight: "bold", color: "#8E7BEF", fontSize: "1.5rem" }}
        >
          About
        </Link>
      </div>
    </div>
  );
};

export default Header;