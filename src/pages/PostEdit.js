import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";

import { errorMessageStyle } from "../styles/signInUp";
import { buttonStyle } from "../styles/signInUp";
import { pageTitle } from "../styles/titles";

import { putData } from "../utils/Utils";
//-----------INLINE STYLE------------

const textAreaStyle = {
  width: "100%",
  padding: "1rem",
  outline: "none",
  minHeight: "40vh",
  borderRadius: "1rem",
  margin: "1rem auto",
  resize: "vertical",
};

const labelStyle = {
  color: "#719fb0",
  fontWeight: "bold",
  textAlign: "left",
  paddingLeft: "1.2rem",
};
const inputStyle = {
  width: "100%",
  backgroundColor: "#f0f0f0",
  padding: "1rem",
  borderRadius: "1.6rem",
  fontFamily: '"Arial", sans-serif',
  fontSize: "13px",
  outline: "none",
  marginTop: "0.6rem",
};

const sectionStyle = {
  width: "100%",
  position: "relative",
  marginBottom: "1rem",
};

const radioSectionStyle = {
  width: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  paddingTop: "0.5rem",
  paddingBottom: "1.5rem",
};

const radioStyle = {
  color: "#6e7c7c",
  width: "6rem",
  fontSize: "14px",
  margin: "0.3rem",
};
//-------------MAIN FUNCTION-----------
function PostEdit() {
  const history = useHistory();
  const location = useLocation();
  let { slug } = useParams();
  const postItem = location?.state?.postedItem;

  //----------update data------------
  const updateData = async (values) => {
    if (values.status === true) {
      values.status = "published";
    } else {
      values.status = "draft";
    }

    try {
      const result = await putData(`api/${slug}/edit/`, values);
      alert(result.data.message);
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
      title: postItem.title,
      content: postItem.content,
      image_URL: postItem.image_URL,
      category: postItem.category,
      status: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().max(100, "Must be 100 characters or less"),
      content: Yup.string(),
      image_URL: Yup.string(),
      category: Yup.string().required("Category option is required"),
      status: Yup.boolean(),
    }),
    onSubmit: (values) => {
      updateData(values);
    },
  });

  // useEffect(() => {
  //   console.log(location.state);
  // }, [location]);

  //   -------------RETURN-----------------
  return (
    <div
      style={{
        backgroundColor: "#f6f5f5",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <h2 style={pageTitle}>Post Edit</h2>
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
          <label style={labelStyle} htmlFor="title">
            Title:
          </label>
          <input
            name="title"
            type="text"
            style={inputStyle}
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          {formik.touched.title && formik.errors.title ? (
            <div style={errorMessageStyle}>{formik.errors.title}</div>
          ) : null}
        </div>
        <div style={sectionStyle}>
          <label style={labelStyle} htmlFor="image_URL">
            image_URL:
          </label>
          <input
            name="image_URL"
            style={inputStyle}
            value={formik.values.image_URL}
            onChange={formik.handleChange}
          />
          {formik.touched.image_URL && formik.errors.image_URL ? (
            <div style={errorMessageStyle}>{formik.errors.image_URL}</div>
          ) : null}
        </div>
        <div style={sectionStyle}>
          <label style={labelStyle} htmlFor="content">
            Content:
          </label>
          <textarea
            name="content"
            style={textAreaStyle}
            type="textarea"
            value={formik.values.content}
            onChange={formik.handleChange}
          />
          {formik.touched.content && formik.errors.content ? (
            <div style={errorMessageStyle}>{formik.errors.content}</div>
          ) : null}
        </div>
        {/* -------------category radio buttons-------- */}
        <div style={radioSectionStyle}>
          <div>
            <label style={labelStyle} htmlFor="category">
              {" "}
              Edit category:
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
                checked={
                  formik.values.category === "cloud" ||
                  formik.values.category === "1"
                }
                value="1"
                onChange={formik.handleChange}
              />
              &nbsp;Cloud
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="category"
                checked={
                  formik.values.category === "frontend" ||
                  formik.values.category === "2"
                }
                value="2"
                onChange={formik.handleChange}
              />
              &nbsp;Frontend
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="category"
                checked={
                  formik.values.category === "backend" ||
                  formik.values.category === "3"
                }
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
            &nbsp;&nbsp;Publish
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

export default PostEdit;
