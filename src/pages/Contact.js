import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/Email";
import Navbar from "../components/navbar/Navbar";
import emailjs from "emailjs-com";
import { init } from "emailjs-com";
import { wallpaper } from "../styles/background";
import { pageTitle } from "../styles/titles";
import { buttonStyle } from "../styles/signInUp";

init(process.env.REACT_APP_EMAILJS_CONTACT_USER_ID);

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const inputStyle = {
  width: "100%",
  height: "2rem",
  borderRadius: "0.6rem",
  outline: "none",
  paddingLeft: "1rem",
  marginTop: 0,
};

const labelStyle = {
  textAlign: "left",
  color: "#350b40",
  width: "100%",
  paddingLeft: "1rem",
};

function Contact() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  let errors = [];
  function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  const formValidation = () => {
    setErrorMessages([]);

    const isNameValid = name !== "";
    const isMessageValid = message !== "";
    const isSubjectValid = subject !== "";

    if (!isNameValid) {
      errors.push("Name is not valid, please try again.");
    }
    if (!ValidateEmail(email)) {
      errors.push("Email is not valid, please try again.");
    }
    if (email === "") {
      errors.push("Email field is empty, please try again.");
    }
    if (!isMessageValid) {
      errors.push("Message is not valid, please try again.");
    }
    if (!isSubjectValid) {
      errors.push("Subject is not valid, please try again.");
    }
    if (errors.length > 0) {
      setShowErrors({ showErrors: true });
      setErrorMessages(errors);
    } else {
      setShowErrors(false);
      alert("Email Sent");
    }
  };

  const sendEmail = (e) => {
    if (showErrors) {
      let err_list = [];
      for (const property in errorMessages) {
        err_list.push(`\n ${property}: ${errorMessages[property]}`);
      }
      alert(err_list);
    } else {
      emailjs
        .sendForm(
          process.env.REACT_APP_EMAILJS_CONTACT_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_CONTACT_TEMPLATE_ID,
          e.target,
          process.env.EMAILJS_CONTACT_USER_ID
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  };
  //------------RETURN------------
  return (
    <div
      style={{
        ...wallpaper,
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <div
        style={{
          height: "calc(100vh-64px)",
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={pageTitle}> Contact Us </h2>
        <EmailIcon
          fontSize="large"
          style={{
            margin: "0 auto 2rem auto",
            color: "#350b40",
            width: "100%",
            fontSize: "3rem",
          }}
        />
        <form
          className={classes.root}
          style={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            minWidth: "300px",
            maxWidth: "500px",
          }}
          onSubmit={sendEmail}
        >
          <label style={labelStyle} for="from_name">
            Name
          </label>
          <input
            type="text"
            name="from_name"
            id="from_name"
            style={inputStyle}
            onChange={(e) => setName(e.target.value)}
          />

          <label style={labelStyle} for="email">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            style={inputStyle}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={labelStyle} for="subject">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            style={inputStyle}
            onChange={(e) => setSubject(e.target.value)}
          />

          <label style={labelStyle} for="message">
            Message
          </label>
          <textarea
            type="text"
            name="message"
            id="message"
            style={{
              ...inputStyle,
              height: "6rem",
              paddingTop: "0.5rem",
              resize: "vertical",
            }}
            onChange={(e) => setMessage(e.target.value)}
          />

          <input
            type="submit"
            id="button"
            value="Send Your Message"
            style={buttonStyle}
            onClick={formValidation}
          />
        </form>
      </div>
    </div>
  );
}
export default Contact;
