import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import "./ChangeCredentialsStyle.css";
import axios from "axios";

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
      password: Yup.string().required("You must enter the password")
    }),
    onSubmit: (values) => {
      console.log(values)
      updateData(values);
      // setOpen(false);
    },
  });

  const updateData = async ({ new_username, new_email, password }) => {
    const token = localStorage.getItem("token");
    try {
      const result = await axios.put(
        "https://fs-blog-backend.herokuapp.com/user/edit/",
        { username: new_username == undefined ? user.username : new_username , email: new_email, password: password },
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
          alert("Username or email already exist. Please enter a new username/email") 
        } else if (response?.data?.password == "Wrong password.") {
          alert("Please check your password") 
        } else {
          alert("Something went wrong!")
        }
      } else {
        alert("Something went wrong!");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className="modalContainer">
      <form onSubmit={formik.handleSubmit}>
        <div>
          <h2 style={{ textAlign: "center" }}>{user.username}'s Credentials</h2>
        </div>
        <div>
          <div className="label">
            <label htmlFor="image">New Username</label>
          </div>
          <input
            // className="input"
            name="new_username"
            placeholder={user.username}
            type="text"
            value={formik.values.new_username}
            onChange={formik.handleChange}
          />
          {formik.touched.new_username && formik.errors.new_username ? (
            <div className="error-message">{formik.errors.new_username}</div>
          ) : null}
        </div>
        <div>
          <div className="label">
            <label htmlFor="image">New Email</label>
          </div>
          <input
            // className="input"
            name="new_email"
            type="email"
            placeholder={user.email}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <div className="label">
            <label htmlFor="image">Password</label>
          </div>
        <input
            id="password"
            name="password"
            type="password"
            placeholder="Verify your password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
          </div>
        <div className="buttonContainer">
          <button className="btn-submit" type="submit">
            Submit
          </button>
          <button className="btn-cancel" onClick={() => {
            handleClose();
            formik.values.new_username = undefined;
            formik.values.new_email = undefined;
            formik.values.password = undefined;
            formik.errors.new_username = "";
            formik.errors.new_email = "";
            formik.errors.password = "";

            }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const confirmed = (
    <div className="modalContainer">
      <p>{returnData.message}</p>
      <button
        className="btn"
        onClick={() => {
          handleClose();
          refresh();
          setReturnData([]);
          formik.values.new_username = undefined;
          formik.values.new_email = undefined;
          formik.values.password = undefined;
        }}
      >
        Ok
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
