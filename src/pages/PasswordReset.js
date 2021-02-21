import React, { useRef, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";

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
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <h2>Password Reset</h2>

        {!returnData.success ? (
          <>
            <label>Enter your email</label>
            <input
              type="email"
              ref={inputRef}
              onKeyDown={handleKeyDown}
              style={{
                width: "200px",
                backgroundColor: "#ffda79",
                borderRadius: "10px",
                textAlign: "center",
                padding: "5px",
              }}
            />
            <button
              onClick={() => {
                fetchData(inputRef?.current?.value);
              }}
            >
              Send
            </button>
            {error.length ? (
            <p style={{ color: "red" }}>
              This email is not registered to any user
            </p>
          ) : null}
          </>
        ) : (
          <p>Reset email has been sent to your email account.</p>
        )}
      </div>
    </div>
  );
}
