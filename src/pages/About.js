import React from "react";
import Navbar from "../components/navbar/Navbar";

//-----INLINE STYLES-----

const bodyStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(0,0,0,0.5)",
};
const team = {
  width: "30%",
  fontSize: "2rem",
  color: "#c7ecee",
  letterSpacing: "2px",
  textAlign: "center",
  margin: "2rem auto",
  fontWeight: "bold",
};

export default function About() {
  return (
    <div>
      <Navbar />
      <div style={team}>
        <p>The team</p>
      </div>

      <div style={bodyStyle}></div>
    </div>
  );
}