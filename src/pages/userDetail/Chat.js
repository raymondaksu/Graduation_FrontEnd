import React, { useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import moment from "moment";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import WebSocketInstance from "../../services/WebSocket";

const senderStyle = {
  display: "flex",
  padding: "0.4rem",
  backgroundColor: "#27a31c",
  borderRadius: "0.6rem",
  marginBottom: "0.5rem",
};

//-------------MAIN FUNC------------
export default function Chat({
  open,
  setOpen,
  sender,
  receiver,
  senderObj,
  receiverObj,
}) {
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
    WebSocketInstance.fetchMessages(sender, receiver);
  };

  function waitForSocketConnection() {
    setTimeout(function () {
      // Check if websocket state is OPEN
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
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
      to: receiver,
      text: text,
    };
    WebSocketInstance.newChatMessage(messageObject);
    setText("");
  };

  //----------------Filter Message List-------------------
  const filteredMessageList = () => {
    const newList = messages.filter(
      (item) =>
        (item.author === sender && item.receiver === receiver) ||
        (item.author === receiver && item.receiver === sender)
    );
    setSanitizedMessageList(newList);
  };

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
    };
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
        height: "70vh",
        border: "1px solid #30336b",
        top: "15%",
        right: "5%",
        backgroundColor: "rgba(199, 236, 238,0.9)",
        padding: "1rem",
        borderRadius: "20px",
        outline: "none",
      }}
    >
      <div
        style={{
          height: "75%",
          overflow: "auto",
          position: "relative",
          top: "4%",
        }}
      >
        {sanitizedMessageList?.length
          ? sanitizedMessageList.map((item) => {
              return (
                <div>
                  <div
                    style={
                      item?.author === senderObj.user
                        ? senderStyle
                        : { ...senderStyle, backgroundColor: "#22a6b3" }
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingRight: "0.5rem",
                      }}
                    >
                      <Avatar
                        alt="Commenter Avatar"
                        src={
                          item?.author === senderObj.user
                            ? senderObj?.image
                            : receiverObj?.image
                        }
                      />
                      <Typography
                        style={{
                          fontSize: "12px",
                          color: "#FFF",
                          fontWeight: "bold",
                          marginLeft: "6px",
                        }}
                      >
                        {capitalize(item?.author)}
                      </Typography>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderLeft: "1px solid #FFF",
                        paddingLeft: "0.5rem",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "12px",
                          color: "#fff",
                        }}
                      >
                        {item?.content}
                      </Typography>
                      <Typography
                        style={{
                          textAlign: "right",
                          fontSize: "11px",
                          color: "#000",
                        }}
                      >
                        {moment(item?.created_at).format("MMMM Do YYYY, h:mm")}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
        <div ref={messagesEndRef} />
      </div>
      <Typography
        style={{
          fontSize: "12px",
          position: "absolute",
          bottom: "3%",
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
            width: "100%",
            minHeight: "5rem",
            fontFamily: "Arial",
            margin: "1rem auto 0 auto",
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
            bottom: "5%",
            right: "6%",
            cursor: "pointer",
            color: "green",
          }}
        />
        <CancelRoundedIcon
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "-0.4rem",
            right: "-0.4rem",
            fill: "red",
            cursor: "pointer",
            fontSize: "1.8rem",
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
