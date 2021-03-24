import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/navbar/Navbar";
import PostCard from "../../components/card/Card";
import Stats from "./userStats";
import Chat from "./Chat";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import { squareButtonStyle } from "../../styles/smallElements";
import { wideButtonStyle } from "../../styles/smallElements";

import ForumRoundedIcon from "@material-ui/icons/ForumRounded";

import { LoopCircleLoading } from "react-loadingg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& > *": {
      margin: theme.spacing(5),
    },
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  media: {
    height: "35vh",
    boxShadow: "3px 3px 4px #555",
    borderRadius: "15px",
  },
  bioContainer: {
    margin: "1rem auto",
    backgroundColor: "#dfe4ea",
    padding: "0.8rem",
    lineHeight: "1.5rem",
    borderRadius: "10px",
    minWidth: "300px",
    height: "200px",
    overflow: "scroll",
    boxShadow: "3px 3px 4px #555",
  },
}));

function UserDetail() {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsOpen, setStatsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const history = useHistory();
  let { username } = useParams();
  const classes = useStyles();

  const sender = localStorage.getItem("username");

  // --------fetch user data------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(
        `https://fs-blogapp-django.herokuapp.com/user/profile-list/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
      const profile = result.data.filter((item) => item.user === username);
      setUser(profile);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  // --------fetch data------------
  const fetchPostData = async (
    postListURL = "https://fs-blogapp-django.herokuapp.com/api/post-list/"
  ) => {
    try {
      const result = await axios.get(postListURL);
      const data = result?.data;
      const filtered = data.filter(
        (item) => item.status === "published" && item.author_name === username
      );
      setPosts(filtered);
      console.log(filtered);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchPostData();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  //---------------RETURN------------
  return !user?.length ? (
    <div>
      <Navbar />
      <LoopCircleLoading />
    </div>
  ) : (
    <div
      style={{
        backgroundColor: "#f6f5f5",
        width: "auto",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Grid container className={classes.root} spacing={5} justify="center">
        <Grid item xs={12}>
          <Grid container justify="center" spacing={5}>
            <Grid container justify="center" style={{ marginBottom: "0.8rem" }}>
              <h2 style={{ margin: "2rem auto" }}>
                <span style={{ textTransform: "capitalize" }}>
                  {user[0].user}
                </span>
              </h2>
            </Grid>
            <Grid container justify="center" style={{ marginBottom: "0.8rem" }}>
              <img
                src={user[0].image}
                alt="ProfilePicture"
                className={classes.media}
              />
              <div
                style={{
                  width: "4rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <button
                  style={{
                    ...squareButtonStyle,
                    width: "100%",
                    height: "45%",
                    marginLeft: "1rem",
                  }}
                  onClick={() => setStatsOpen(true)}
                >
                  <EqualizerIcon fontSize="small" />
                  <br /> STATS
                </button>
                <button
                  style={{
                    ...squareButtonStyle,
                    width: "100%",
                    height: "45%",
                    marginLeft: "1rem",
                    backgroundColor: "#10ac84",
                  }}
                  onClick={() => setChatOpen(true)}
                >
                  <ForumRoundedIcon fontSize="small" />
                  <br /> CHAT
                </button>
              </div>

              <Stats
                username={username}
                open={statsOpen}
                setOpen={setStatsOpen}
              />
            </Grid>
            <Grid
              container
              xs={6}
              justify="center"
              className={classes.bioContainer}
            >
              <p
                style={{
                  textIndent: "30px",
                  alignSelf: "stretch",
                  textAlign: "justify",
                }}
              >
                {user[0].bio}
              </p>
            </Grid>
          </Grid>
          {sender === user[0].user ? null : (
            <>
              <Chat
                open={chatOpen}
                setOpen={setChatOpen}
                sender={sender}
                receiver={user[0].user}
              />
            </>
          )}
          <Grid
            container
            justify="center"
            spacing={5}
            style={{ marginTop: "2rem" }}
          >
            <Grid container justify="center" spacing={5}>
              <Grid container justify="center" style={{ margin: "2rem auto" }}>
                <h2 style={{ textTransform: "capitalize" }}>
                  {username}'s posts
                </h2>
              </Grid>

              {posts.length ? (
                posts.map((item, idx) => {
                  return <PostCard item={item} itemStatus={false} id={idx} />;
                })
              ) : loading ? (
                <div style={{ position: "relative" }}>
                  <LoopCircleLoading />
                </div>
              ) : (
                <div>
                  <p style={{ textAlign: "center", fontWeight: "bold" }}>
                    "{username}" has no article yet.
                  </p>
                </div>
              )}
            </Grid>
            <Box p={9}>
              <button onClick={() => history.goBack()} style={wideButtonStyle}>
                Back
              </button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default UserDetail;
