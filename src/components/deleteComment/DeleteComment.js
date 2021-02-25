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
      className="itemContainer"
      style={{
        position: "absolute",
        width: "30%",
        alignContent: "center",
        outline: "none",
        justifyContent: 'center',
        top: '38%',
        left: '35%'
      }}
    >
      <div
        style={{
          backgroundColor: "#ecf0f1",
          marginBottom: "12px",
          padding: "5px",
          paddingLeft: "8px",
          borderRadius: "6px",
          display: "flex",
          flexFlow: 'column',
          boxShadow: "2px 2px 5px #636e72",
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div>
          <p>Are you sure delete the comment?</p>
        </div>
        <div className="buttonContainer" style={{ height: "1rem", marginTop: '1rem' }}>
          <button
            className="btn-submit"
            onClick={handleCommentDelete}
            style={{ width: "3rem", height: "1rem", marginLeft: 0 }}
          >
            <p style={{ fontSize: "10px" }}>Yes</p>
          </button>
          <button
            className="btn-cancel"
            onClick={() => setOpen(false)}
            style={{ width: "3rem", height: "1rem" }}
          >
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
