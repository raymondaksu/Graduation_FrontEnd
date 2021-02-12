import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import { putData } from "../../utils/Utils";

import { useFormik } from "formik";
import * as Yup from "yup";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// ------------INLINE STYLES--------
const iconContainerStyle = {
  width: "300px",
  height: "40px",
  position: "relative",
  margin: "30px auto",
};

export default function EditModal({ open, setOpen, profile, refresh }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  // ------------FORMIK-------------
  const formik = useFormik({
    initialValues: {
      user: profile.user,
      image: profile.image,
      bio: profile.bio,
    },
    validationSchema: Yup.object({
      image: Yup.string(),
      bio: Yup.string().max(1000, "Must be less than 1000 chars"),
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

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {/* <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p> */}
      <form onSubmit={formik.handleSubmit}>
        <div style={iconContainerStyle}>
          <p>{profile.user}</p>
        </div>
        <div style={iconContainerStyle}>
          <input
            name="image"
            type="url"
            // placeholder="Image"
            value={formik.values.image}
            onChange={formik.handleChange}
          />
          {formik.touched.image && formik.errors.image ? (
            <div className="error-message">{formik.errors.image}</div>
          ) : null}
        </div>
        <div style={iconContainerStyle}>
          <input
            name="bio"
            type="text"
            // placeholder="Password"
            value={formik.values.bio}
            onChange={formik.handleChange}
          />
          {formik.touched.bio && formik.errors.bio ? (
            <div className="error-message">{formik.errors.bio}</div>
          ) : null}
        </div>
        <button className="btn" type="submit" onClick={refresh}>
          Submit
        </button>
        <button className="btn" onClick={() => setOpen(false)}>
          Cancel
        </button>
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
