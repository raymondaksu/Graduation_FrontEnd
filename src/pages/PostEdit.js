import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";

import { TextField } from "@material-ui/core";
import { errorMessageStyle } from "../styles/signInUp";
import { buttonStyle } from "../styles/signInUp";
import { pageTitle } from "../styles/titles";
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
function PostEdit() {
  const history = useHistory();
  const [post, setPost] = useState([]);
  let { slug } = useParams();

  // --------fetch data------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(
        `https://fs-blog-backend.herokuapp.com/api/${slug}/post-detail/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
      setPost(result.data);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  const updateData = async ({
    new_title,
    new_content,
    new_image_URL,
    new_category,
    new_status,
  }) => {
    const token = localStorage.getItem("token");

    try {
      const result = await axios.put(
        `https://fs-blog-backend.herokuapp.com/api/${slug}/edit/`,
        {
          title: new_title === undefined ? post.title : new_title,
          image_URL:
            new_image_URL === undefined ? post.image_URL : new_image_URL,
          content: new_content === undefined ? post.content : new_content,
          category: new_category === undefined ? post.category : new_category,
          status: new_status ? "published" : "draft",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
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
      new_title: undefined,
      new_content: undefined,
      new_image_URL: undefined,
      new_category: undefined,
      new_status: false,
    },
    validationSchema: Yup.object({
      new_title: Yup.string().max(100, "Must be 100 characters or less"),
      new_content: Yup.string(),
      new_image_URL: Yup.string(),
      new_category: Yup.string().required("Category option is required"),
      status: Yup.boolean(),
    }),
    onSubmit: (values) => {
      updateData(values);
      //console.log({ values });
    },
  });

  useEffect(() => {
    fetchData();
  }, []);
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
          <TextField
            name="new_title"
            className="inp"
            style={textFieldStyle}
            placeholder={post.title}
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          {formik.touched.new_title && formik.errors.new_title ? (
            <div style={errorMessageStyle}>{formik.errors.new_title}</div>
          ) : null}
        </div>
        <div style={sectionStyle}>
          <TextField
            name="new_image_URL"
            className="inp"
            style={textFieldStyle}
            placeholder={post.image_URL}
            value={formik.values.image_URL}
            onChange={formik.handleChange}
          />
          {formik.touched.new_image_URL && formik.errors.new_image_URL ? (
            <div style={errorMessageStyle}>{formik.errors.new_image_URL}</div>
          ) : null}
        </div>
        <div style={sectionStyle}>
          <textarea
            name="new_content"
            className="inp"
            style={textAreaStyle}
            type="textarea"
            placeholder={post.content}
            value={formik.values.content}
            onChange={formik.handleChange}
          />
          {formik.touched.new_content && formik.errors.new_content ? (
            <div style={errorMessageStyle}>{formik.errors.new_content}</div>
          ) : null}
        </div>
        {/* -------------category radio buttons-------- */}
        <div style={radioSectionStyle}>
          <div>
            <label htmlFor="category"> Edit category</label>
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
                name="new_category"
                checked={formik.values.new_category === "1"}
                value="1"
                onChange={formik.handleChange}
              />
              &nbsp;Cloud
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="new_category"
                checked={formik.values.new_category === "2"}
                value="2"
                onChange={formik.handleChange}
              />
              &nbsp;Frontend
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="new_category"
                checked={formik.values.new_category === "3"}
                value="3"
                onChange={formik.handleChange}
              />
              &nbsp;Backend
            </label>
          </div>
          {formik.touched.new_category && formik.errors.new_category ? (
            <div style={errorMessageStyle}>{formik.errors.new_category}</div>
          ) : null}
        </div>
        {/* -------------status checkbox------------ */}
        <div style={{ ...radioSectionStyle, paddingTop: "0" }}>
          <label style={{ ...radioStyle, fontWeight: "bold", color: "green" }}>
            <input
              type="checkbox"
              name="new_status"
              checked={formik.values.new_status}
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

export default PostEdit;
