import axios from "axios";
import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// ------------INLINE STYLES--------
const iconContainerStyle = {
  width: "300px",
  height: "40px",
  position: "relative",
  margin: "30px auto",
};

export default function Stats({open, setOpen}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [postList, setPostList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [allValues, setAllValues] = useState({
    publishedCount: 0,
    totalCommentCount: 0,
    totalViewCount: 0,
    totalLikeCount: 0,
  });

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
  const logicalOperations = () => {
    let totalComment = 0;
    let totalView = 0;
    let totalLike = 0;

    const publishedPostCount = filteredList.filter((item) => {
      return item.status == "published";
    });

    const sumOfCommentCount = () => {
      for (const iterator of filteredList) {
        totalComment += iterator.comment_count;
      }
      return totalComment;
    };

    const sumOfViewCount = () => {
      for (const iterator of filteredList) {
        totalView += iterator.view_count;
      }
      return totalView;
    };

    const sumOfLikeCount = () => {
      for (const iterator of filteredList) {
        totalLike += iterator.like_count;
      }
      return totalLike;
    };

    sumOfCommentCount();
    sumOfViewCount();
    sumOfLikeCount();
    setAllValues({
      ...allValues,
      publishedCount: publishedPostCount.length,
      totalCommentCount: totalComment,
      totalViewCount: totalView,
      totalLikeCount: totalLike,
    });
  };

  //------------------------Modal---------------------------------
  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <p>Count of all stories: {filteredList.length}</p>
      <p>Count of published stories: {allValues.publishedCount}</p>
      <p>Count of draft stories: {filteredList.length - allValues.publishedCount}</p>
      <p>Total comment counts of stories: {allValues.totalCommentCount}</p>
      <p>Total view counts of stories: {allValues.totalViewCount}</p>
      <p>Total like counts of stories: {allValues.totalLikeCount}</p>
      <button className="btn" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </div>
  );

  useEffect(() => {
    fetchPostData();
  }, []);

  useEffect(() => {
    filteredPosts();
  }, [postList]);

  useEffect(() => {
    logicalOperations();
  }, [filteredList]);

  useEffect(() => {
    console.log(allValues)
  }, [allValues])

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
  )

}


// "title": "Is Angular For You?",
// "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
// "image_URL": "https://bs-uploads.toptal.io/blackfish-uploads/blog/post/seo/og_image_file/og_image/15991/top-18-most-common-angularjs-developer-mistakes-41f9ad303a51db70e4a5204e101e7414.png",
// "category": "frontend",
// "publish_date": "2021-02-01T17:17:52.656309Z",
// "update_date": "2021-02-01T17:17:52.656338Z",
// "author": 2,
// "author_name": "eric",
// "author_avatar": "https://cdn.united.no/uploads/united_ez/cantona_eric_profil_stor-269x313.jpg",
// "status": "published",
// "is_liked": null,
// "slug": "eric-is-angular-for-you017fb8f917",
// "comment_count": 0,
// "like_count": 0,
// "view_count": 0,
// "comments": []