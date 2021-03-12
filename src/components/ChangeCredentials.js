import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import { statsModalContainer } from "../styles/modals";
import { modalTitleContainer } from "../styles/titles";
import { modalTitle } from "../styles/titles";
import { iconContainerStyle } from "../styles/signInUp";
import { iconStyle } from "../styles/signInUp";
import { inputStyle } from "../styles/signInUp";
import { labelStyle } from "../styles/signInUp";
import { errorMessageStyle } from "../styles/signInUp";
import { buttonStyle } from "../styles/signInUp";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import EmailIcon from "@material-ui/icons/Email";
import { useFormik } from "formik";
import * as Yup from "yup";

//-------------MAIN FUNC------------
export default function ChangeCredentials({ open, setOpen, user, refresh }) {
  const [returnData, setReturnData] = useState([]);
  // ------------FORMIK-------------
  const formik = useFormik({
    initialValues: {
      new_username: undefined,
      new_email: undefined,
      password: undefined,
    },
    validationSchema: Yup.object({
      new_username: Yup.string().max(15, "Must be 15 characters or less"),
      new_email: Yup.string().email("Invalid email address"),
      password: Yup.string().required("You must enter the password"),
    }),
    onSubmit: (values) => {
      console.log(values);
      updateData(values);
    },
  });

  const updateData = async ({ new_username, new_email, password }) => {
    const token = localStorage.getItem("token");
    try {
      const result = await axios.put(
        "https://fs-blog-backend.herokuapp.com/user/edit/",
        {
          username: new_username == undefined ? user.username : new_username,
          email: new_email,
          password: password,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
      console.log(result.data);
      setReturnData(result.data);
    } catch ({ response }) {
      if (response) {
        console.log(response);
        if (response?.status === 500) {
          alert(
            "Username or email already exist. Please enter a new username/email"
          );
        } else if (response?.data?.password == "Wrong password.") {
          alert("Please check your password");
        } else {
          alert("Something went wrong!");
        }
      } else {
        alert("Something went wrong!");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  //--------------BODY------------
  const body = (
    <div style={statsModalContainer}>
      <form onSubmit={formik.handleSubmit}>
        <div style={{ ...modalTitleContainer, width: "90%" }}>
          <h2 style={modalTitle}>
            {user.username}
            <span>'s</span> Credentials
          </h2>
        </div>
        <div style={{ ...iconContainerStyle, marginBottom: "2.5rem" }}>
          <div style={{ ...iconStyle, top: "28px" }}>
            <PersonIcon fontSize="small" />
          </div>
          <div style={labelStyle}>
            <label htmlFor="image">New Username</label>
          </div>
          <input
            name="new_username"
            style={inputStyle}
            placeholder={user.username}
            type="text"
            value={formik.values.new_username}
            onChange={formik.handleChange}
          />
          {formik.touched.new_username && formik.errors.new_username ? (
            <div style={errorMessageStyle}>{formik.errors.new_username}</div>
          ) : null}
        </div>
        <div style={{ ...iconContainerStyle, marginBottom: "2.5rem" }}>
          <div style={{ ...iconStyle, top: "28px" }}>
            <EmailIcon fontSize="small" />
          </div>
          <div style={labelStyle}>
            <label htmlFor="image">New Email</label>
          </div>
          <input
            name="new_email"
            style={inputStyle}
            type="email"
            placeholder={user.email}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={errorMessageStyle}>{formik.errors.email}</div>
          ) : null}
        </div>
        <div style={{ ...iconContainerStyle, marginBottom: "2.5rem" }}>
          <div style={{ ...iconStyle, top: "28px" }}>
            <LockIcon fontSize="small" />
          </div>
          <div style={labelStyle}>
            <label htmlFor="image">Password</label>
          </div>
          <input
            id="password"
            name="password"
            style={inputStyle}
            type="password"
            placeholder="Verify your password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={errorMessageStyle}>{formik.errors.password}</div>
          ) : null}
        </div>
        {/* -----------buttons-------------- */}
        <div
          style={{
            height: "5rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button style={{ ...buttonStyle, width: "8rem" }} type="submit">
            Submit
          </button>
          <button
            style={{
              ...buttonStyle,
              width: "8rem",
              marginLeft: "12px",
              backgroundColor: "hsl(34, 80%, 73%)",
            }}
            onClick={() => {
              handleClose();
              formik.values.new_username = undefined;
              formik.values.new_email = undefined;
              formik.values.password = undefined;
              formik.errors.new_username = "";
              formik.errors.new_email = "";
              formik.errors.password = "";
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const confirmed = (
    <div
      style={{
        ...statsModalContainer,
        minHeight: "10rem",
        height: "10rem",
        textAlign: "center",
      }}
    >
      <p style={{ color: "green" }}>✅ {returnData.message}</p>
      <button
        style={{ ...buttonStyle, width: "8rem", alignSelf: "center" }}
        onClick={() => {
          handleClose();
          refresh();
          setReturnData([]);
          formik.values.new_username = undefined;
          formik.values.new_email = undefined;
          formik.values.password = undefined;
        }}
      >
        OK
      </button>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        hideBackdrop={true}
      >
        {returnData.message ? confirmed : body}
      </Modal>
    </div>
  );
}
