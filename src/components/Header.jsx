import React from 'react';
import logo from "../assets/logo-transparent.png";

const Header = () => {
  return (
    <div className="position-absolute top-0 start-0 d-flex align-items-center" style={{ padding: '6px 24px', zIndex: 10 }}>
        <img src={logo} alt="logo" style={{ width: 120, height: 120 }} />
    </div>
  );
};

export default Header;
