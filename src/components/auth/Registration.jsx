import React from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        backgroundColor: "#000000",
      }}
    >
      <h1>Registration</h1>

      <p>Choose your account type</p>

      <button
        onClick={() => navigate("/register/employer")}
        style={{
          padding: "12px 30px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        I'm an Employer
      </button>

      <button
        onClick={() => navigate("/register/job-seeker")}
        style={{
          padding: "12px 30px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        I'm a Job Seeker
      </button>
    </div>
  );
}

export default Registration;