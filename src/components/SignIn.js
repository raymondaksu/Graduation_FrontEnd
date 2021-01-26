import { useFormik } from "formik";
import { Context } from "../../context/Context";
import { postData } from "../utils/Utils"
// const fetchData = (props) => {
//   const loginURL =
//     "http://fs-blog-app-backend-django.herokuapp.com/auth/login/";
//   fetch(loginURL, {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify({
//       username: props.username,
//       password: props.password,
//     }),
//   }).then((results) => console.log(results.json()));
// };
const fetchData = async (props) => {
  try {
    const loginURL =
      "http://fs-blog-app-backend-django.herokuapp.com/auth/login/";
    const result = await postData(loginURL, props);
    setToken(result?.data?.key);
    localStorage.setItem("token", result?.data?.key);
    // history.push("/");
  } catch ({ response }) {
    if (response) {
      console.log(response.data.non_field_errors[0]);
    } else {
      console.log("Something went wrong!");
    }
  }
};
export default function SignIn() {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      fetchData(values);
    },
  });
  console.log(formik);
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">User name</label>
        <input
          name="username"
          placeholder="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <button type="submit">Sign In</button>
        <button>Cancel</button>
      </form>
    </div>
  );
}