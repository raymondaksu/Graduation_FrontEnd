import React from "react";
import Modal from "@material-ui/core/Modal";
import "./EditCommentStyle.css";
import axios from "axios";

import { buttonStyle } from "../../styles/signInUp";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

//-------------MAIN FUNC------------
export default function EditComment({
  open,
  setOpen,
  commentContent,
  changedContent,
  setChangedContent,
  refreshData,
  slug,
}) {
  const handleCommentChange = (e) => {
    setChangedContent(e.target.value);
  };

  const handleCommentSend = async () => {
    try {
      const result = await axios.put(
        `https://fs-blog-backend.herokuapp.com/api/${slug}/${commentContent.id}/comment-edit/`,
        { content: changedContent },
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
      console.log(result);
    } catch ({ response }) {
      if (response) {
        console.log(response?.data);
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div
      style={{
        position: "absolute",
        width: "60%",
        minWidth: "330px",
        alignContent: "center",
        outline: "none",
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#ecf0f1",
        boxShadow: "2px 2px 5px #636e72",
        padding: "8px 8px 16px 8px",
        borderRadius: "6px",
        display: "flex",
      }}
    >
      <div
        style={{
          padding: "6px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Avatar alt="Commenter Avatar" src={commentContent?.commenter_avatar} />
      </div>
      <div
        style={{
          padding: "6px 8px 0 12px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            style={{
              fontSize: "14px",
              color: "#079992",
              fontWeight: "bold",
            }}
          >
            {capitalize(commentContent?.commenter_name)}
          </Typography>
        </div>
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          <textarea
            id="comment"
            name="comment"
            placeholder="Share your thoughts..."
            onChange={handleCommentChange}
            value={changedContent}
            style={{
              backgroundColor: "#eae3c8",
              padding: "8px",
              paddingLeft: "15px",
              width: "100%",
              minWidth: "230px",
              minHeight: "5rem",
              fontFamily: "Arial",
              margin: "1rem auto",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
            }}
          />
        </Typography>
        <div
          style={{
            height: "5rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className="btn-submit"
            onClick={handleCommentSend}
            style={{ ...buttonStyle, width: "5rem" }}
          >
            <p style={{ fontSize: "11px" }}>Submit</p>
          </button>
          <button
            className="btn-cancel"
            style={{
              ...buttonStyle,
              width: "5rem",
              backgroundColor: "hsl(34, 80%, 73%)",
            }}
            onClick={() => setOpen(false)}
          >
            <p style={{ fontSize: "11px" }}>Cancel</p>
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
