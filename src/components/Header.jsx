import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo-transparent.png";

const Header = () => {
  return (
    <div
      className="position-absolute top-0 start-0 w-100 d-flex justify-content-between align-items-center px-4 py-2"
      style={{ zIndex: 10 }}
    >
      <img src={logo} alt="logo" style={{ width: 120, height: 120 }} />

      <nav>
        <Link
          to="/feedback"
          className="btn btn-outline-light"
          style={{ fontWeight: "bold", borderColor: "#8E7BEF", color: "#f0f0f0" }}
        >
          Feedback
        </Link>
      </nav>
    </div>
  );
};

export default Header;
