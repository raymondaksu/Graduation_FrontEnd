import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import "./ChangePasswordStyle.css";
import axios from "axios";

import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import { useFormik } from "formik";
import * as Yup from "yup";

// ------------INLINE STYLES--------
const iconContainerStyle = {
  width: "300px",
  height: "40px",
  position: "relative",
  margin: "30px auto",
};
const iconStyle = {
  position: "absolute",
  top: "10px",
  left: "15px",
};

//-------------MAIN FUNC------------
export default function ChangePassword({ openPassword, setOpenPassword }) {
  const [returnData, setReturnData] = useState([]);
  // ------------FORMIK-------------
  const formik = useFormik({
    initialValues: {
      oldPassword: undefined,
      newPassword1: undefined,
      newPassword2: undefined,
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("No password provided"),
      newPassword1: Yup.string()
        .required("No password provided")
        .min(6, "Should be min 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
          "Must contain min one uppercase, one lowercase and one number"
        ),
      newPassword2: Yup.string()
        .required("You should confirm the password")
        .oneOf([Yup.ref("newPassword1"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      updateData(values);
      //   setOpenPassword(false);
    },
  });

  const updateData = async ({ oldPassword, newPassword2 }) => {
    const token = localStorage.getItem("token");
    try {
      console.log(oldPassword, newPassword2);
      const result = await axios.patch(
        "https://fs-blog-backend.herokuapp.com/user/change-password/",
        { old_password: oldPassword, new_password: newPassword2 },
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
        alert(
          response?.data?.detail ||
            (response?.data?.old_password == "Wrong password."
              ? "Check your old password"
              : response?.data?.old_password)
        );
      } else {
        alert("Something went wrong!");
      }
    }
  };

  const handleClose = () => {
    setOpenPassword(false);
  };

  const body = (
    <div className="modalContainer">
      <h2 style={{ margin: "2rem auto" }}>Password Change</h2>
      <form onSubmit={formik.handleSubmit}>
        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <VpnKeyIcon fontSize="small" />
          </div>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            placeholder="Old Password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
          />
          {formik.touched.oldPassword && formik.errors.oldPassword ? (
            <div className="error-message">{formik.errors.oldPassword}</div>
          ) : null}
        </div>
        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <LockIcon fontSize="small" />
          </div>
          <input
            id="newPassword1"
            name="newPassword1"
            type="password"
            placeholder="New Password"
            value={formik.values.newPassword1}
            onChange={formik.handleChange}
          />
          {formik.touched.newPassword1 && formik.errors.newPassword1 ? (
            <div className="error-message">{formik.errors.newPassword1}</div>
          ) : null}
        </div>
        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <LockIcon fontSize="small" />
          </div>
          <input
            id="newPassword2"
            name="newPassword2"
            type="password"
            placeholder="Confirm Password"
            value={formik.values.newPassword2}
            onChange={formik.handleChange}
          />
          {formik.touched.newPassword2 && formik.errors.newPassword2 ? (
            <div className="error-message">{formik.errors.newPassword2}</div>
          ) : null}
        </div>
        <div className="buttonContainer">
          <button className="btn-submit" type="submit">
            Submit
          </button>
          <button
            className="btn-cancel"
            onClick={() => {
              handleClose();
              formik.values.oldPassword = undefined;
              formik.values.newPassword1 = undefined;
              formik.values.newPassword2 = undefined;
              formik.errors.oldPassword = "";
              formik.errors.newPassword1 = "";
              formik.errors.newPassword2 = "";
            }}
          >
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
          setReturnData([]);
          formik.values.oldPassword = undefined;
          formik.values.newPassword1 = undefined;
          formik.values.newPassword2 = undefined;
        }}
      >
        Ok
      </button>
    </div>
  );

  return (
    <div>
      <Modal
        open={openPassword}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        hideBackdrop={true}
      >
        {returnData.code == 200 ? confirmed : body}
      </Modal>
    </div>
  );
}
