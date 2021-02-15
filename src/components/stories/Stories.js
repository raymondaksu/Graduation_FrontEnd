import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";

import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

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
const buttonStyle = {
  padding: "10px",
  outline: "none",
};

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
        `http://fs-blog-backend.herokuapp.com/api/post-list`,
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
    console.log(userId);
    const filteredData = postList.filter((item) => {
      return item.author == userId;
    });
    console.log(filteredData);
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
      <h1>Stories</h1>
      <Box p={9}>
        <button
          type=""
          onClick={() => setStoriesOpen(false)}
          style={buttonStyle}
        >
          Back to Profile Page
        </button>
      </Box>
      {!postList?.length ? (
        <div>
          <LoopCircleLoading />
        </div>
      ) : !filteredList?.length ? (
        <div>
          <p>You have no article to shown yet.</p>
        </div>
      ) : (
        <>
          <h3>Published</h3>
          <Grid container className={classes.root} spacing={5} justify="center">
            <Grid item xs={12}>
              <Grid container justify="center" spacing={5}>
                {published.length ? (
                  published.map((item, id) => {
                    return <PostCard item={item} itemStatus={true} id={id} />;
                  })
                ) : (
                  <div>
                    <p>You have no published articles.</p>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
          <h3>Draft</h3>
          <Grid container className={classes.root} spacing={5} justify="center">
            <Grid item xs={12}>
              <Grid container justify="center" spacing={5}>
                {draft.length ? (
                  draft.map((item, id) => {
                    return <PostCard item={item} itemStatus={true} id={id} />;
                  })
                ) : (
                  <div>
                    <p>You have no draft articles.</p>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default Stories;
