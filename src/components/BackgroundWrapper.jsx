import React from "react";
import background from "../assets/background.jpg";

const BackgroundWrapper = ({ children }) => {
  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          zIndex: 1,
        }}
      ></div>

      {/* Contents*/}
      <div style={{ zIndex: 2, width: "100%" }}>{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
