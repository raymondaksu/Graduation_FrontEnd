import { useFormik } from "formik";
import * as Yup from "yup";
import { postData } from "../utils/Utils";
import { useHistory } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";

import { TextField } from "@material-ui/core";
import { errorMessageStyle } from "../styles/signInUp";
import { buttonStyle } from "../styles/signInUp";
import { pageTitle } from "../styles/titles";
import { wallpaper } from "../styles/background";
//-----------INLINE STYLE------------

const textFieldStyle = {
  width: "100%",
  margin: "1rem auto",
};
const textAreaStyle = {
  width: "100%",
  padding: "1rem",
  outline: "none",
  minHeight: "40vh",
  borderRadius: "1rem",
  margin: "1rem auto",
  resize: "vertical",
};

const sectionStyle = {
  width: "100%",
  position: "relative",
};

const radioSectionStyle = {
  width: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  paddingTop: "1rem",
};

const radioStyle = {
  color: "#6e7c7c",
  width: "6rem",
  fontSize: "14px",
  margin: "0.3rem",
};
//-------------MAIN FUNCTION-----------
function CreatePost() {
  const history = useHistory();

  const sendPost = async (values) => {
    values.status === true
      ? (values.status = "published")
      : (values.status = "draft");
    try {
      await postData("api/post-create/", values);
      alert("Post created successfully!");
      history.goBack();
    } catch ({ response }) {
      if (response) {
        let res = response.data;
        let err_list = [];
        for (const property in res) {
          err_list.push(`\n ${property}: ${res[property]}`);
        }
        alert(err_list);
      } else {
        console.log("Something went wrong!");
      }
    }
  };
  //------------formik------------
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      image_URL: "",
      category: undefined,
      status: false,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Title is required"),
      content: Yup.string().required("Content is required"),
      image_URL: Yup.string().required("Image URL is required"),
      category: Yup.string().required("Category option is required"),
      status: Yup.boolean(),
    }),
    onSubmit: (values) => {
      sendPost(values);
      // console.log({ values });
    },
  });
  //   -------------RETURN-----------------
  return (
    <div style={wallpaper}>
      <Navbar />
      <h2 style={pageTitle}>Create a Post</h2>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          width: "40vw",
          minWidth: "300px",
          borderRadius: "1.2rem",
          height: "auto",
          backgroundColor: "#f0e4d7",
          margin: "2rem auto",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={sectionStyle}>
          <TextField
            name="title"
            className="inp"
            style={textFieldStyle}
            placeholder="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          {formik.touched.title && formik.errors.title ? (
            <div style={errorMessageStyle}>{formik.errors.title}</div>
          ) : null}
        </div>
        <div style={sectionStyle}>
          <TextField
            name="image_URL"
            className="inp"
            style={textFieldStyle}
            placeholder="Image URL"
            value={formik.values.image_URL}
            onChange={formik.handleChange}
          />
          {formik.touched.image_URL && formik.errors.image_URL ? (
            <div style={errorMessageStyle}>{formik.errors.image_URL}</div>
          ) : null}
        </div>
        <div style={sectionStyle}>
          <textarea
            name="content"
            className="inp"
            style={textAreaStyle}
            type="textarea"
            placeholder="Write the content here...."
            value={formik.values.content}
            onChange={formik.handleChange}
          />
          {formik.touched.content && formik.errors.content ? (
            <div style={errorMessageStyle}>{formik.errors.content}</div>
          ) : null}
        </div>
        {/* -------------category radio------------ */}
        <div style={radioSectionStyle}>
          <div>
            <label
              style={{ color: "#6e7c7c", fontSize: "14px" }}
              htmlFor="category"
            >
              {" "}
              Select a category :
            </label>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              margin: "0.5rem auto 0.5rem 1rem",
            }}
          >
            <label style={radioStyle}>
              <input
                type="radio"
                name="category"
                checked={formik.values.category === "1"}
                value="1"
                onChange={formik.handleChange}
              />
              &nbsp;Cloud
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="category"
                checked={formik.values.category === "2"}
                value="2"
                onChange={formik.handleChange}
              />
              &nbsp;Frontend
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="category"
                checked={formik.values.category === "3"}
                value="3"
                onChange={formik.handleChange}
              />
              &nbsp;Backend
            </label>
          </div>
          {formik.touched.category && formik.errors.category ? (
            <div style={errorMessageStyle}>{formik.errors.category}</div>
          ) : null}
        </div>
        {/* -------------status checkbox------------ */}
        <div style={{ ...radioSectionStyle, paddingTop: "0" }}>
          <label style={{ ...radioStyle, fontWeight: "bold", color: "green" }}>
            <input
              type="checkbox"
              name="status"
              checked={formik.values.status}
              onChange={formik.handleChange}
            />
            &nbsp;Publish
          </label>
        </div>
        {/* -------------buttons------------ */}
        <div
          style={{
            width: "100%",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button style={buttonStyle} type="submit">
            Submit
          </button>
          <button
            style={{
              ...buttonStyle,
              marginLeft: "1rem",
              backgroundColor: "hsl(34, 80%, 73%)",
            }}
            className="btn"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
