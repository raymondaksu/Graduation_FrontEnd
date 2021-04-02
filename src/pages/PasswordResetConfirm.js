import React, { useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import Modal from "@material-ui/core/Modal";
import { wallpaper } from "../styles/background";

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

const buttonStyle = {
  padding: "10px",
  outline: "none",
  border: "0",
  borderRadius: "20px",
  cursor: "pointer",
  width: "10rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#83acf1",
  color: "#fff",
  marginTop: "1.5rem",
};
//------------Minimodal-----------
function MiniModal({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };
  const minimodalStyle = {
    width: "33rem",
    position: "absolute",
    top: "8rem",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#eaffd0",
    fontSize: "12px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid gray",
    outline: "none",
    fontFamily: "courier",
    textAlign: "center",
    display: "flex",
    justifyContent: "space-around",
  };
  const okButton = {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    border: "2px solid tomato",
    outline: "none",
    cursor: "pointer",
  };

  const body = (
    <div style={minimodalStyle}>
      <div>
        Password must be at least 8 characters, contain minimum one uppercase,
        one lowercase and one number!
      </div>
      <div>
        <button onClick={handleClose} style={okButton}>
          ✔️
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

//-------------MAIN FUNC------------
export default function PasswordResetConfirm() {
  let { uidb64, token } = useParams();
  const [returnData, setReturnData] = useState([]);
  const [pass, setPass] = useState({
    password_first: "",
    password_second: "",
  });
  const [open, setOpen] = useState(true);

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

  const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

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
          "https://fs-blogapp-django.herokuapp.com/user/reset-password-complete/",
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

  //-----------------RETURN-------------
  return (
    <div style={wallpaper}>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: "2rem auto 4.5rem", color: "#350b40" }}>
          Create New Password
        </h2>
        <MiniModal open={open} setOpen={setOpen} />

        {!returnData.success ? (
          <>
            <label>Enter your new password</label>
            <input
              type="password"
              onChange={(e) => handleChange1(e.target.value)}
              style={inputStyle}
            />
            <label>Re-enter your new password</label>
            <input
              type="password"
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
              style={buttonStyle}
              disabled={!passwordCheck(inputRef2?.current?.value)}
            >
              Send
            </button>
          </>
        ) : (
          <>
            <p style={{ fontWeight: "bold", color: "#009432" }}>
              ✅ Password is successfully changed. Now, you can login.
            </p>
            <button onClick={() => history.push("/")} style={buttonStyle}>
              Go to Login Page
            </button>
          </>
        )}
      </div>
    </div>
  );
}
