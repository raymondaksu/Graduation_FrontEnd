import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

//-------------MAIN FUNC------------
export default function Passwordreset() {
  const inputRef = useRef();
  const history = useHistory();

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
        "https://fsblog-backend.herokuapp.com/auth/password/reset/",
        { email: email }
        // {
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //     Authorization: null,
        //   },
        // }
      );
      //history.push("/password-reset-done");
      console.log(result.data);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  return (
    <div>
      <label>Enter your email</label>

      <input type="email" ref={inputRef} onKeyDown={handleKeyDown} />
      <button
        onClick={() => {
          fetchData(inputRef?.current?.value);
          inputRef.current.value = "";
        }}
      >
        Send
      </button>
    </div>
  );
}