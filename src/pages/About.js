import React from "react";
import Navbar from "../components/navbar/Navbar";
import semih from "../assets/semih.jpg";
import ramazan from "../assets/ramazan.jpg";

//-----INLINE STYLES-----

const bodyStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(0,0,0,0.5)",
};
const team = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: "2rem",
  color: "#c7ecee",
  letterSpacing: "2px",
  textAlign: "center",
  margin: "2rem auto",
  fontWeight: "bold",
};

const imageMainContainer = {
  display: 'flex',
  flexDirection: 'row',
  margin: "2rem auto",
};

const imageContainer = {
  display: 'flex',
  flexDirection: 'column',
  margin: "1rem 2rem 0 2rem",
  letterSpacing: "0.5px",
  fontSize: "1rem",
  color: "black",
};

const images = {
  border: "2px solid black",
  borderRadius: '2rem',
  marginBottom: '1rem',
};

const textContainer = {
  textDecoration: "none"
};

export default function About() {
  return (
    <div>
      <Navbar />
      <div style={team}>
        <p>The team</p>
        <div style={imageMainContainer}>
          <div style={imageContainer}>
            <img src={semih} alt="Semih Durmus" width="270" height="300" style={images}/>
            <abbr title="https://www.linkedin.com/in/semih-durmus/">
            <a href="https://www.linkedin.com/in/semih-durmus/" style={textContainer} target="_blank">
              <p>Semih Durmus</p>
              <p><i>Developer</i></p>
            </a>
            </abbr>
          </div>
          <div style={imageContainer}>
            <img src={ramazan} alt="Ramazan Aksu" width="270" height="300" style={images}/>
            <abbr title="https://www.linkedin.com/in/ramazanaksu/">
            <a href="https://www.linkedin.com/in/ramazanaksu/" style={textContainer} target="_blank">
              <p>Ramazan Aksu</p>
              <p><i>Developer</i></p>
            </a>
            </abbr>
          </div>
        </div>
      </div>
      <div style={bodyStyle}></div>
    </div>
  );
}