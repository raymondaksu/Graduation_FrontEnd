import React from "react";
import Modal from "@material-ui/core/Modal";
import { putData } from "../../utils/Utils";

import { useFormik } from "formik";
import * as Yup from "yup";

//--------INLINE-STYLES----------
const modalContainer = {
  minWidth: "300px",
  width: "650px",
  minHeight: "550px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#f0f0f0",
  borderRadius: "20px",
  border: "2px solid 03506f",
  display: "flex",
  flexDirection: "column",
  boxShadow: "3px 3px 7px #555, -3px -3px 7px #555",
};

const titleContainer = {
  width: "80%",
  height: "auto",
  margin: "30px auto",
  textAlign: "center",
};

const labelStyle = {
  color: "#719fb0",
  fontWeight: "bold",
  marginBottom: "7px",
  textAlign: "left",
};
const inputStyle = {
  width: "100%",
  backgroundColor: "#b3ccd4",
  padding: "1rem",
  borderRadius: "0.5rem",
  fontFamily: '"Arial", sans-serif',
  fontSize: "13px",
  outline: "none",
};

const buttonContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const buttonStyle = {
  width: "8rem",
  height: "3rem",
  border: "0",
  outline: "none",
  boxSizing: "border-box",
  fontSize: "15px",
  borderRadius: "20px",
  cursor: "pointer",
  backgroundColor: "#83acf1",
  color: "#fff",
  fontWeight: "bold",
  margin: "20px",
};

//-------------MAIN FUNC------------
export default function EditModal({ open, setOpen, profile, refresh }) {
  // ------------FORMIK-------------
  const formik = useFormik({
    initialValues: {
      user: profile.user,
      image: profile.image,
      bio: profile.bio,
    },
    validationSchema: Yup.object({
      image: Yup.string(),
      bio: Yup.string().max(10000, "Must be less than 10000 chars"),
    }),
    onSubmit: (values) => {
      fetchData(values);
      setOpen(false);
    },
  });

  const fetchData = (values) => {
    putData("user/profile/", values)
      .then((data, err) => {
        alert("Successfully updated!");
      })
      .catch((err) => {
        alert(err?.message || "An error occured");
      });
  };

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  //-----------BODY-----------

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className="modalContainer" style={modalContainer}>
      <form onSubmit={formik.handleSubmit}>
      <div style={titleContainer}>
          <h2>{capitalize(profile.user)}'s Profile Edit</h2>
        </div>
        <div style={titleContainer}>
          <div style={labelStyle}>
            <label htmlFor="image">Image URL</label>
          </div>
          <input
            style={inputStyle}
            name="image"
            type="text"
            value={formik.values.image}
            onChange={formik.handleChange}
          />
          {formik.touched.image && formik.errors.image ? (
            <div className="error-message">{formik.errors.image}</div>
          ) : null}
        </div>
        <div style={titleContainer}>
          <div style={labelStyle}>
            <label htmlFor="bio">Biography</label>
          </div>
          <textarea
            style={{
              ...inputStyle,
              minHeight: "200px",
              overflow: "scroll",
              lineHeight: "1.4rem",
            }}
            name="bio"
            type="text"
            value={formik.values.bio}
            onChange={formik.handleChange}
          />
          {formik.touched.bio && formik.errors.bio ? (
            <div className="error-message">{formik.errors.bio}</div>
          ) : null}
        </div>
        <div style={buttonContainer}>
          <button style={buttonStyle} type="submit" onClick={refresh}>
            Submit
          </button>

          <button
            style={{ ...buttonStyle, backgroundColor: "hsl(34, 80%, 73%)" }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
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
        {body}
      </Modal>
    </div>
  );
}