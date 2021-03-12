import "./SignInUp.css";

import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import EmailIcon from "@material-ui/icons/Email";

import { signInUpFormBoxStyle } from "../styles/signInUp";
import { iconContainerStyle } from "../styles/signInUp";
import { inputStyle } from "../styles/signInUp";
import { buttonStyle } from "../styles/signInUp";
import { iconStyle } from "../styles/signInUp";
import { errorMessageStyle } from "../styles/signInUp";

import { useFormik } from "formik";
import * as Yup from "yup";
import { postData } from "../utils/Utils";

// ------------MAIN FUNCTION------------------------
export default function SignUp({ setShowSI }) {
  const fetchData = async (values) => {
    try {
      await postData("user/register/", values);
      alert(`${values.username}'s account created successfully!`);
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

  // ------------FORMIK-------------
  const formik = useFormik({
    initialValues: {
      username: undefined,
      email: undefined,
      password: undefined,
      password2: undefined,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("No password provided")
        .min(6, "Should be min 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
          "Must contain min one uppercase, one lowercase and one number"
        ),
      password2: Yup.string()
        .required("You should confirm the password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      fetchData(values);
      setShowSI(true);
    },
  });

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
            className="inp"
            style={inputStyle}
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.touched.username && formik.errors.username ? (
            <div style={errorMessageStyle}>{formik.errors.username}</div>
          ) : null}
        </div>
        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <EmailIcon fontSize="small" />
          </div>
          <input
            name="email"
            className="inp"
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={errorMessageStyle}>{formik.errors.email}</div>
          ) : null}
        </div>
        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <LockIcon fontSize="small" />
          </div>
          <input
            name="password"
            className="inp"
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={errorMessageStyle}>{formik.errors.password}</div>
          ) : null}
        </div>
        <div style={iconContainerStyle}>
          <div style={iconStyle}>
            <LockIcon fontSize="small" />
          </div>
          <input
            name="password2"
            className="inp"
            style={inputStyle}
            type="password"
            placeholder="Confirm Password"
            value={formik.values.password2}
            onChange={formik.handleChange}
          />
          {formik.touched.password2 && formik.errors.password2 ? (
            <div style={errorMessageStyle}>{formik.errors.password2}</div>
          ) : null}
        </div>
        <button
          style={{
            ...buttonStyle,
            marginTop: "6px",
            border: "1px solid #fff",
            boxShadow: "0",
          }}
          className="btn"
          type="submit"
        >
          Submit
        </button>
        <button
          style={{
            ...buttonStyle,
            marginTop: "6px",
            border: "1px solid #fff",
            boxShadow: "0",
          }}
          className="btn"
          onClick={() => setShowSI(true)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
