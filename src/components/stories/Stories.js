import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { wideButtonStyle } from "../../styles/smallElements";

import PostCard from "../card/Card";

import { LoopCircleLoading } from "react-loadingg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& > *": {
      margin: theme.spacing(5),
    },
    minHeight: "70vh",
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

//-------------Inline Style-------------------
const h3Style = {
  width: "80%",
  backgroundColor: "#a0c1b8",
  padding: "10px",
  borderRadius: "2rem",
  textAlign: "center",
  margin: "0.5rem auto",
};

const noArticlesStyle = {
  textAlign: "center",
  color: "#c0392b",
  fontWeight: "bold",
  margin: "4rem auto",
};

//-------------MAIN FUNCTION-------------------
const Stories = () => {
  const { setStoriesOpen } = useContext(Context);

  const [postList, setPostList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [published, setPublished] = useState([]);
  const [draft, setDraft] = useState([]);

  const classes = useStyles();

  //----------Fetch Post List Data------------
  const fetchPostData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(
        `https://fs-blog-backend.herokuapp.com/api/post-list/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
      setPostList(result.data);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  //-------------Filter User Posts----------------
  const filteredPosts = () => {
    const userId = localStorage.getItem("userId");
    const filteredData = postList.filter((item) => {
      return item.author == userId;
    });
    setFilteredList(filteredData);
  };

  //--------------Filtered List Logical Operations----------
  const separateOperation = () => {
    let publishedItems = [];
    let draftItems = [];
    const seperatePosts = () => {
      filteredList.filter((item) => {
        if (item.status == "published") {
          publishedItems.push(item);
        } else {
          draftItems.push(item);
        }
      });
    };

    seperatePosts();
    setPublished(publishedItems);
    setDraft(draftItems);
  };

  //-----------useEffects----------
  useEffect(() => {
    fetchPostData();
  }, []);

  useEffect(() => {
    filteredPosts();
  }, [postList]);

  useEffect(() => {
    separateOperation();
  }, [filteredList]);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "4rem auto" }}>Stories</h1>
      {!postList?.length ? (
        <div>
          <LoopCircleLoading />
        </div>
      ) : !filteredList?.length ? (
        <div>
          <p style={noArticlesStyle}>You have no articles yet.</p>
        </div>
      ) : (
        <>
          <h3 style={h3Style}>Published</h3>
          {published.length ? (
            <Grid
              container
              className={classes.root}
              spacing={5}
              justify="center"
            >
              <Grid item xs={12}>
                <Grid container justify="center" spacing={5}>
                  {published.map((item, id) => {
                    return <PostCard item={item} itemStatus={true} />;
                  })}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <div style={noArticlesStyle}>
              <p>You have no published articles yet 😕 </p>
            </div>
          )}
          <h3 style={h3Style}>Draft</h3>
          {draft.length ? (
            <Grid
              container
              className={classes.root}
              spacing={5}
              justify="center"
            >
              <Grid item xs={12}>
                <Grid container justify="center" spacing={5}>
                  {draft.map((item, id) => {
                    return <PostCard item={item} itemStatus={true} id={id} />;
                  })}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <div style={noArticlesStyle}>
              <p>You have no draft articles.</p>
            </div>
          )}
        </>
      )}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => setStoriesOpen(false)}
          style={{ ...wideButtonStyle, width: "16rem" }}
        >
          Back to Profile Page
        </button>
      </div>
    </div>
  );
};

export default Stories;
