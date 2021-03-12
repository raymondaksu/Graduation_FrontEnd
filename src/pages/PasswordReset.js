import React, { useRef, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import { extraWideButtonStyle } from "../styles/smallElements";

//----------INLINE STYLES-------------

const inputStyle = {
  margin: "2rem auto",
  width: "240px",
  height: "2.5rem",
  backgroundColor: "#ffda79",
  borderRadius: "20px",
  textAlign: "center",
  padding: "0px",
  outline: "none",
};

//-------------MAIN FUNC------------
export default function Passwordreset() {
  const inputRef = useRef();
  const [returnData, setReturnData] = useState([]);
  const [error, setError] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(inputRef?.current?.value);
      inputRef.current.value = "";
    }
  };

  const fetchData = async (email) => {
    try {
      console.log(email);
      const result = await axios.post(
        "https://fs-blog-backend.herokuapp.com/user/reset-password/",
        { email: email }
      );
      setReturnData(result.data);
      console.log(result.data.success);
    } catch ({ response }) {
      if (response) {
        setError(response.data.error);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f0f0", height: "100vh" }}>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: "2rem auto" }}>Password Reset</h2>

        {!returnData.success ? (
          <>
            <label>Enter your email</label>
            <input
              type="email"
              ref={inputRef}
              onKeyDown={handleKeyDown}
              style={inputStyle}
            />
            <button
              style={extraWideButtonStyle}
              onClick={() => {
                fetchData(inputRef?.current?.value);
              }}
            >
              Send
            </button>
            {error?.length ? (
              <p style={{ color: "red", marginTop: "1rem" }}>
                This email is not registered to any user
              </p>
            ) : null}
          </>
        ) : (
          <p style={{ fontWeight: "bold", color: "#009432" }}>
            ✅ A password reset email has been sent to your email account.
          </p>
        )}
      </div>
    </div>
  );
}
