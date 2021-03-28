import React from "react";
import Navbar from "../components/navbar/Navbar";
import semih from "../assets/semih.png";
import ramazan from "../assets/ramazan.jpeg";
import github from "../assets/github.png";
import linkedin from "../assets/linkedin.png";
import wallPaper from "../assets/webb.png";
import { pageTitle } from "../styles/titles";

//-----INLINE STYLES-----

const team = {
  display: "flex",
  flexDirection: "column",
  fontSize: "2rem",
  color: "#c7ecee",
  letterSpacing: "2px",
  textAlign: "center",
  margin: "2rem auto",
  fontWeight: "bold",
};

const imageMainContainer = {
  display: "flex",
  flexWrap: "wrap",
  marginTop: "2rem",
  justifyContent: "center",
};

const imageContainer = {
  display: "flex",
  flexDirection: "column",
  margin: "1rem",
  letterSpacing: "0.5px",
  fontSize: "1rem",
};
const images = {
  borderRadius: "50%",
  marginBottom: "1rem",
  filter: "grayscale(90%)",
  height: "270px",
};

const logoBox = {
  width: "90%",
  display: "flex",
  justifyContent: "center",
  margin: "-2.5rem auto 1rem auto",
  position: "relative",
  zIndex: "10",
};
const logo = {
  width: "30px",
  height: "30px",
  backgroundColor: "#FFF",
  margin: "0 2rem",
  borderRadius: "50%",
};

const nameBox = {
  width: "90%",
  height: "2rem",
  lineHeight: "2rem",
  color: "#FFF",
  backgroundColor: "#000",
  borderTopRightRadius: "0.5rem",
  borderTopLeftRadius: "0.5rem",
  margin: "0 auto",
};
const titleBox = {
  width: "90%",
  height: "2rem",
  lineHeight: "2rem",
  color: "#000",
  backgroundColor: "#f0f0f0",
  borderBottomRightRadius: "0.5rem",
  borderBottomLeftRadius: "0.5rem",
  border: "1px solid #000",
  margin: "0 auto 1rem auto",
};

export default function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${wallPaper})`,
      }}
    >
      <Navbar />
      <div style={team}>
        <p style={pageTitle}>The Team</p>
        <div style={imageMainContainer}>
          <div style={imageContainer}>
            <img src={semih} alt="Semih Durmus" style={images} />
            <div style={logoBox}>
              <a
                href="https://www.linkedin.com/in/semih-durmus/"
                target="blank"
                title="LinkedIn"
              >
                <img
                  className="logo"
                  src={linkedin}
                  alt="Semih Durmus Linkedin"
                  style={logo}
                />
              </a>
              <a
                href="https://github.com/SemihDurmus"
                target="blank"
                title="GitHub"
              >
                <img
                  className="logo"
                  src={github}
                  alt="Semih Durmus Linkedin"
                  style={logo}
                />
              </a>
            </div>
            <div style={nameBox}>Semih Durmus</div>
            <div style={titleBox}>Developer</div>
          </div>
          <div style={imageContainer}>
            <img src={ramazan} alt="Ramazan Aksu" style={images} />
            <div style={logoBox}>
              <a
                href="https://www.linkedin.com/in/ramazanaksu/"
                target="blank"
                title="LinkedIn"
              >
                <img
                  className="logo"
                  src={linkedin}
                  alt="Ramazan Aksu Linkedin"
                  style={logo}
                />
              </a>
              <a
                href="https://github.com/raymondaksu"
                target="blank"
                title="GitHub"
              >
                <img
                  className="logo"
                  src={github}
                  alt="Ramazan Aksu Linkedin"
                  style={logo}
                />
              </a>
            </div>
            <div style={nameBox}>Ramazan Aksu</div>
            <div style={titleBox}>Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
