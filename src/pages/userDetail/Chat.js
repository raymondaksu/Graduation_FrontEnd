import React, { useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import moment from "moment";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import WebSocketInstance from "../../services/WebSocket";

//-------------MAIN FUNC------------
export default function Chat({ open, setOpen, sender, receiver }) {

  const [text, setText] = useState("");
  const [newMessage, setNewMessage] = useState([]);

  //---------------WebSocket---------------------
  const [messages, setMessages] = useState([]);
  const [sanitizedMessageList, setSanitizedMessageList] = useState([]);

  const messageRef = useRef();

  //----------------Web Socket Logic-------------------------

  const callback = () => {
    WebSocketInstance.initChatUser(sender);
    WebSocketInstance.addCallbacks(setMess, addMessage);
    WebSocketInstance.fetchMessages(sender);
  }

  function waitForSocketConnection() {
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made")
          callback();
          return;
        } else {
          console.log("wait for connection...");
          waitForSocketConnection();
        }
    }, 100); // wait 100 milisecond for the connection...
  }

  function addMessage(message) {
    setMessages([...messages, message]);
    setNewMessage(message);
  }

  function setMess(messages) {
    setMessages(messages.reverse());
  }

  const sendMessageHandler = () => {
    const messageObject = {
      from: sender,
      text: text,
    };
    WebSocketInstance.newChatMessage(messageObject);
    setText("");
  };

  //----------------Filter Message List-------------------
  const filteredMessageList = () => {
    const newList = messages.filter((item) => item.author === sender || item.author === receiver)
    setSanitizedMessageList(newList);
  }

  //----------------Text Set Function---------------------
  const handleMessageChange = (e) => {
    setText(e.target.value);
  };

  //-----------------Capitalize------------------------------
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  //---------------Keep Scroll at the Bottom------------------
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log(sanitizedMessageList);
  }, [messages]);

  useEffect(() => {
    waitForSocketConnection();
    filteredMessageList();
  }, [newMessage]);

  useEffect(() => {
    const main = async () => {
      await WebSocketInstance.connect();
    }
    main();
    waitForSocketConnection();
    filteredMessageList();
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div
      style={{
        position: "absolute",
        width: "30%",
        minWidth: "300px",
        alignContent: "center",
        height: "80vh",
        border: "solid",
        top: "15%",
        right: "5%",
        backgroundColor: "aqua",
        padding: "1rem",
        borderRadius: "20px",
      }}
    >
      <div style={{ height: "70%", overflow: "auto" }}>
        {sanitizedMessageList?.length
          ? sanitizedMessageList
              .map((item) => {
                return (
                  <div>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Avatar alt="Commenter Avatar" src={null} />
                      <div>
                        <Typography
                          style={{
                            fontSize: "14px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {capitalize(item?.author)}
                        </Typography>
                      </div>
                    </div>
                    <div>
                      <Typography
                        style={{
                          fontSize: "12px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {item?.content}
                      </Typography>
                      <Typography
                        style={{
                          textAlign: "right",
                          fontSize: "11px",
                          color: "#3c6382",
                        }}
                      >
                        {moment(item?.created_at).format("MMMM Do YYYY, h:mm")}
                      </Typography>
                    </div>
                  </div>
                );
              })
          : null}
        <div ref={messagesEndRef} />
      </div>
      <Typography
        style={{
          fontSize: "14px",
          position: "absolute",
          bottom: "5%",
          left: "5%",
          width: "90%",
        }}
      >
        <textarea
          ref={messageRef}
          id="message"
          name="message"
          label="Send message"
          placeholder="Type something..."
          onChange={handleMessageChange}
          style={{
            backgroundColor: "#eae3c8",
            padding: "8px",
            paddingLeft: "15px",
            width: "90%",
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
      <div className="buttonContainer" style={{ height: "1rem" }}>
        <SendRoundedIcon
          onClick={() => {
            sendMessageHandler();
            messageRef.current.value = "";
          }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            cursor: "pointer",
          }}
        />
        <CancelRoundedIcon
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "5%",
            right: "2%",
            fill: "red",
            cursor: "pointer",
          }}
        />
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
        hideBackdrop={true}
      >
        {body}
      </Modal>
    </div>
  );
}
