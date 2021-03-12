import React from "react";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import { statsModalContainer } from "../styles/modals";
import { buttonStyle } from "../styles/signInUp";

//-------------MAIN FUNC------------
export default function DeleteComment({
  open,
  setOpen,
  commentContent,
  refreshData,
  slug,
}) {
  const handleCommentDelete = async () => {
    try {
      const result = await axios.delete(
        `https://fs-blog-backend.herokuapp.com/api/${slug}/${commentContent.id}/comment-edit/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      setOpen(false);
      refreshData();
      console.log(result.data);
    } catch ({ response }) {
      if (response) {
        console.log(response);
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
        Are you sure to delete the comment?
      </p>
      <div className="buttonContainer">
        <button
          style={{ ...buttonStyle, width: "6rem", alignSelf: "center" }}
          onClick={handleCommentDelete}
        >
          Yes
        </button>
        <button
          style={{
            ...buttonStyle,
            width: "6rem",
            alignSelf: "center",
            marginLeft: "1rem",
            backgroundColor: "hsl(34, 80%, 73%)",
          }}
          onClick={() => setOpen(false)}
        >
          <p style={{ fontSize: "10px" }}>No</p>
        </button>
      </div>
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
        {body}
      </Modal>
    </div>
  );
}
