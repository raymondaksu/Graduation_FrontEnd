import React from "react";
import Modal from "@material-ui/core/Modal";
import { putData } from "../../utils/Utils";
import { profileModalContainerStyle } from "../../styles/modals";
import { wideButtonStyle } from "../../styles/smallElements";
import { modalTitleContainer } from "../../styles/titles";
import { modalTitle } from "../../styles/titles";
import { useFormik } from "formik";
import * as Yup from "yup";

//--------INLINE-STYLES----------
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

  //-----------BODY-----------

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className="modalContainer" style={profileModalContainerStyle}>
      <form onSubmit={formik.handleSubmit}>
        <div style={modalTitleContainer}>
          <h2 style={modalTitle}>{profile.user}'s Profile Edit</h2>
        </div>
        <div style={modalTitleContainer}>
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
        <div style={modalTitleContainer}>
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
          <button
            style={{ ...wideButtonStyle, width: "6rem" }}
            type="submit"
            onClick={refresh}
          >
            Submit
          </button>
          <button
            style={{
              ...wideButtonStyle,
              backgroundColor: "hsl(34, 80%, 73%)",
              width: "6rem",
            }}
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
