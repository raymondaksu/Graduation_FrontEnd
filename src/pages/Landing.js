import { useState } from "react";
import { useHistory } from "react-router-dom";

import "./Landing.css";

import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";

function Landing() {
  const [showSI, setShowSI] = useState(true);
  const history = useHistory();

  const toggleView = () => {
    setShowSI(!showSI);
  };

  return (
    <div className="hero">
      <div className="title-container">
        <h1 className="title">Nord Blog</h1>
      </div>
      <div className="form-box">
        <div className="button-box">
          <div
            className="float-btn"
            style={showSI ? { left: 0 } : { left: "110px" }}
          ></div>
          <button className="toggle-btn" onClick={toggleView}>
            Sign In
          </button>
          <button className="toggle-btn" onClick={toggleView}>
            Sign Up
          </button>
        </div>
        {showSI ? <SignIn /> : <SignUp setShowSI={setShowSI} />}
        <div
          style={{
            position: "absolute",
            bottom: "1.2rem",
            width: "100%",
          }}
        >
          <p
            style={{
              cursor: "pointer",
              color: "yellow",
              fontSize: "15px",
              fontWeight: "bold",
              textAlign: "center",
            }}
            onClick={() => {
              history.push("/home");
            }}
          >
            Continue without an account
          </p>
        </div>
      </div>
    </div>
  );
}
export default Landing;
