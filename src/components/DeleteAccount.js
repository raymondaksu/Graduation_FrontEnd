import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import { statsModalContainer } from "../styles/modals";
import { iconContainerStyle } from "../styles/signInUp";
import { iconStyle } from "../styles/signInUp";
import { inputStyle } from "../styles/signInUp";
import { buttonStyle } from "../styles/signInUp";
import LockIcon from "@material-ui/icons/Lock";

import { Context } from "../context/Context";

//-------------MAIN FUNC------------
export default function DeleteAccount({ open, setOpen }) {
  const [returnData, setReturnData] = useState([]);
  const { setToken, setUserId } = useContext(Context);
  const history = useHistory();
  const inputRef = useRef();

  const handleAccountDelete = async () => {
    try {
      console.log(inputRef?.current?.value);
      console.log(localStorage.getItem("token"));
      const result = await axios.post(
        `https://fs-blog-backend.herokuapp.com/user/edit/`,
        { password: inputRef?.current?.value },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      setReturnData(result);
      console.log(result);
    } catch ({ response }) {
      if (response) {
        alert(
          response?.status == 404 || response?.status == 400
            ? "Please enter valid password!"
            : response?.data?.message
        );
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div
      style={{
        ...statsModalContainer,
        minHeight: "14rem",
        height: "14rem",
      }}
    >
      <p
        style={{
          fontSize: "0.9rem",
          textAlign: "center",
          color: "tomato",
          fontWeight: "bold",
        }}
      >
        😮 Sure to delete account?
        <br /> All your posts will be deleted as well!
      </p>

      <div style={iconContainerStyle}>
        <div style={iconStyle}>
          <LockIcon fontSize="small" />
        </div>

        <input
          style={inputStyle}
          ref={inputRef}
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>

      <div
        style={{
          height: "5rem",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          style={{ ...buttonStyle, width: "8rem" }}
          onClick={handleAccountDelete}
        >
          Yes
        </button>
        <button
          style={{
            ...buttonStyle,
            width: "8rem",
            marginLeft: "12px",
            backgroundColor: "hsl(34, 80%, 73%)",
          }}
          onClick={() => setOpen(false)}
        >
          No
        </button>
      </div>
    </div>
  );

  //-------Confirmed-------------
  const confirmed = (
    <div
      style={{
        ...statsModalContainer,
        minHeight: "9rem",
        height: "9rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "0.9rem",
          textAlign: "center",
          color: "tomato",
          fontWeight: "bold",
        }}
      >
        Your account is permanently deleted 😔
      </p>

      <button
        style={{ ...buttonStyle, width: "8rem", alignSelf: "center" }}
        onClick={() => {
          handleClose();
          setToken(null);
          setUserId(null);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          history.push("/");
        }}
      >
        Ok
      </button>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {returnData.status == 204 ? confirmed : body}
      </Modal>
    </div>
  );
}
