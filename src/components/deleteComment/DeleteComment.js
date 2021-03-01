import React from "react";
import Modal from "@material-ui/core/Modal";
import "./DeleteCommentStyle.css";
import axios from "axios";

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
        `http://127.0.0.1:8000/api/${slug}/${commentContent.id}/comment-edit/`,
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
      className="itemContainer"
    >
      <div
        style={{
          backgroundColor: "#ecf0f1",
          marginBottom: "12px",
          padding: "1rem",
          borderRadius: "6px",
          display: "flex",
          flexFlow: 'column',
          boxShadow: "2px 2px 5px #636e72",
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div>
        <p style={{ fontSize: "0.9rem", textAlign: "center" }}>
            Are you sure to delete the comment?
          </p>
        </div>
        <div className="buttonContainer">
          <button className="btn-submit" onClick={handleCommentDelete}>
            <p style={{ fontSize: "10px" }}>Yes</p>
          </button>
          <button className="btn-cancel" onClick={() => setOpen(false)}>
            <p style={{ fontSize: "10px" }}>No</p>
          </button>
        </div>
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
