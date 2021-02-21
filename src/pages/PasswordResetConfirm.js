import React, { useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";

const inputStyle = {
  width: "200px",
  backgroundColor: "#ffda79",
  borderRadius: "10px",
  textAlign: "center",
  padding: "5px",
  border: "2px solid grey",
};

//-------------MAIN FUNC------------
export default function PasswordResetConfirm() {
  let { uidb64, token } = useParams();
  const [returnData, setReturnData] = useState([]);
  const [pass, setPass] = useState({
    password_first: "",
    password_second: "",
  });
  const inputRef2 = useRef();
  const history = useHistory();

  const handleChange1 = (e) => {
    setPass((prevState) => ({
      ...prevState,
      password_first: e,
    }));
  };
  const handleChange2 = (e) => {
    setPass((prevState) => ({
      ...prevState,
      password_second: e,
    }));
  };

  function passwordMatch(txt) {
    if (pass.password_first?.indexOf(txt) == txt?.indexOf(txt)) {
      return true;
    } else {
      return false;
    }
  }

  const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

  function passwordCheck(txt) {
    if (
      pass.password_first === pass.password_second &&
      regPassword.test(inputRef2?.current?.value)
    ) {
      return true;
    } else {
      return false;
    }
  }

  const postData = async (values) => {
    if (passwordCheck(values)) {
      try {
        console.log(values);
        const result = await axios.patch(
          "https://fs-blog-backend.herokuapp.com/user/reset-password-complete/",
          { password: values, uidb64: uidb64, token: token }
        );
        console.log(result.data);
        setReturnData(result.data);
      } catch ({ response }) {
        if (response) {
          alert(response?.data.password);
        } else {
          alert("Something went wrong!");
        }
      }
    } else {
      setReturnData("Password do not match.");
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
        <h2>Create New Password</h2>

        {!returnData.success ? (
          <>
            <label>Enter your new password</label>
            <input
              type="email"
              onChange={(e) => handleChange1(e.target.value)}
              style={inputStyle}
            />
            <label>Re-enter your new password</label>
            <input
              type="email"
              ref={inputRef2}
              onChange={(e) => handleChange2(e.target.value)}
              style={
                !passwordMatch(inputRef2?.current?.value) &&
                inputRef2?.current?.value !== undefined
                  ? { ...inputStyle, borderColor: "red" }
                  : inputStyle
              }
            />
            <button
              onClick={() => {
                postData(pass.password_second);
              }}
              disabled={!passwordCheck(inputRef2?.current?.value)}
            >
              Send
            </button>
            <p>
              Password must contain min one uppercase, one lowercase, one number
              and must be at least 6 characters
            </p>
          </>
        ) : (
          <>
            <p>Now, you can login.</p>
            <button onClick={() => history.push("/")}>Go to Login Page</button>
          </>
        )}
      </div>
    </div>
  );
}
