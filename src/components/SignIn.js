import { useContext, useState } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";

import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";

import { signInUpFormBoxStyle } from "../styles/signInUp";
import { iconContainerStyle } from "../styles/signInUp";
import { inputStyle } from "../styles/signInUp";
import { buttonStyle } from "../styles/signInUp";
import { iconStyle } from "../styles/signInUp";
import { errorMessageStyle } from "../styles/signInUp";
import { yellowLinksBoxStyle } from "../styles/signInUp";
import { yellowLinksStyle } from "../styles/signInUp";
import { loadingContainerStyle } from "../styles/signInUp";
import { loadingTextStyle } from "../styles/signInUp";

import { Context } from "../context/Context";
import { postData } from "../utils/Utils";

import Modal from "@material-ui/core/Modal";
import { LoopCircleLoading } from "react-loadingg";

// ------------MAIN FUNCTION------------------------
export default function SignIn() {
  const { setToken, setUserId } = useContext(Context);
  const [signInError, setSignInError] = useState(null);
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const fetchData = async (values) => {
    setOpen(true);
    try {
      const result = await postData("auth/login/", values);
      setOpen(false);
      localStorage.setItem("token", result?.data?.key);
      localStorage.setItem("userId", result?.data?.user.id);
      localStorage.setItem("username", result?.data?.user.username);
      setToken(result?.data?.key);
      setUserId(result?.data?.user.id);
      history.push("/home");
    } catch ({ response }) {
      if (response) {
        setOpen(false);
        console.log(response.data)
        setSignInError(response.data.non_field_errors[0]);
      } else {
        setOpen(false);
        alert("Something went wrong!");
      }
    }
  };
  const refresh = () => {
    window.location.reload(false);
  };

  // ------------FORMIK-------------
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      if (values.username === "") {
        setSignInError("Enter username");
      } else if (values.password === "") {
        setSignInError("Enter password");
      } else fetchData(values);
    },
  });

  const loading = (
    <>
      <div style={loadingContainerStyle}>
        <LoopCircleLoading color="#fbc531" size="large" />
      </div>
      <div style={loadingTextStyle}>
        <p>Signing in...</p>
      </div>
    </>
  );

  // ------------RETURN-------------
  return (
    <div style={signInUpFormBoxStyle}>
      <form onSubmit={formik.handleSubmit}>
        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <PersonIcon fontSize="small" />
          </div>
          <input
            name="username"
            classname="inp"
            style={inputStyle}
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
        </div>

        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <LockIcon fontSize="small" />
          </div>
          <input
            name="password"
            classname="inp"
            type="password"
            style={inputStyle}
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {signInError ? (
            <div style={errorMessageStyle}>{signInError}</div>
          ) : null}
        </div>
        <button
          style={{
            ...buttonStyle,
            border: "1px solid #fff",
            boxShadow: "0",
            marginTop: "2rem",
          }}
          type="submit"
        >
          Sign In
        </button>
        <button
          style={{
            ...buttonStyle,
            border: "1px solid #fff",
            boxShadow: "0",
          }}
          onClick={refresh}
        >
          Cancel
        </button>
        <div style={yellowLinksBoxStyle}>
          <p
            style={yellowLinksStyle}
            onClick={() => {
              history.push("/password-reset");
            }}
          >
            Forgot password?
          </p>
        </div>
      </form>
      <Modal
        open={open}
        onClose={null}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {loading}
      </Modal>
    </div>
  );
}
