import { Fragment, useState, useRef, useContext, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import { Context } from "../../context/Context";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";

import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles({
  root: {
    minWidth: "300px",
    maxWidth: "60vw",
    margin: "20px auto",
  },
  media: {
    height: 300,
  },

  title: {
    color: "tomato",
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: "1.6rem auto",
  },
  module: {
    fontSize: "1rem",
    lineHeight: "1.5rem",
    textAlign: "justify",
  },
  image: {
    padding: 3,
  },
  authorGroup: {
    right: "50px",
  },
  avatar: {
    marginBottom: "0.35em",
  },
});

//--------------MAIN FUNCTION-----------
const Detail = () => {
  const { userId, setUserId } = useContext(Context);

  const commentRef = useRef("");

  let { slug } = useParams();
  const [item, setItem] = useState([]);
  const [comment, setComment] = useState("");
  const classes = useStyles();
  const history = useHistory();

  // --------fetch data------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(
        `https://fs-blog-backend.herokuapp.com/api/${slug}/post-detail/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
      setItem(result.data);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  //----------------Destruction----------------
  const {
    title,
    content,
    image_URL,
    category,
    publish_date,
    update_date,
    author,
    author_name,
    author_avatar,
    status,
    is_liked,
    comment_count,
    like_count,
    view_count,
    comments,
  } = item;

  const handleLikeClick = async () => {
    try {
      const result = await axios.post(
        `https://fs-blog-backend.herokuapp.com/api/${slug}/like/`,
        null,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      fetchData();
    } catch ({ response }) {
      if (response) {
        console.log(response?.data?.like_count);
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  //   const handleDeleteClick = async () => {
  //     try {
  //       const result = await axios.delete(
  //         `https://clarusway-blogapp.herokuapp.com/api/delete/${slug}/`,
  //         {
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //             Authorization: "Token " + localStorage.getItem("token"),
  //           },
  //         }
  //       );
  //       history.push(`/`);
  //     } catch ({ response }) {
  //       if (response) {
  //         console.log(response?.data?.detail);
  //       } else {
  //         console.log("Something went wrong!");
  //       }
  //     }
  //   };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSend = async (key) => {
    if (key?.charCode === 13) {
      try {
        const result = await axios.post(
          `https://fs-blog-backend.herokuapp.com/api/${slug}/comment-create/`,
          { content: comment },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        setComment("");
        fetchData();
      } catch ({ response }) {
        if (response) {
          console.log(response?.data?.comment_count);
        } else {
          console.log("Something went wrong!");
        }
      }
    }
  };

  const handleCommentSendWithClick = async () => {
    try {
      const result = await axios.post(
        `https://fs-blog-backend.herokuapp.com/api/${slug}/comment-create/`,
        { content: comment },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      setComment("");
      fetchData();
    } catch ({ response }) {
      if (response) {
        console.log(response?.data?.comment_count);
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={image_URL}
            title={title}
          />
          <CardContent>
            <Typography className={classes.title}>{title}</Typography>
            <CardActions>
              <Avatar
                alt="User Avatar"
                src={author_avatar}
                className={classes.small}
              />
              <Typography gutterBottom variant="h6" component="h2">
                {author_name}
              </Typography>
            </CardActions>
            <Typography
              style={{ textAlign: "right", fontSize: "13px", color: "#3c6382" }}
            >
              {moment(item.publish_date).format("MMMM Do YYYY, h:mm")}
            </Typography>
            <p className={classes.module}>{content}</p>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton
            aria-label="add to favorites"
            className={classes.image}
            onClick={handleLikeClick}
          >
            <FavoriteIcon color={is_liked ? "secondary" : "primary"} />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            {like_count}
          </Typography>
          <IconButton aria-label="view count" className={classes.image}>
            <VisibilityIcon />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            {view_count}
          </Typography>
          <IconButton aria-label="comment count" className={classes.image}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            {comment_count}
          </Typography>
        </CardActions>
        <CardContent>
          <Typography
            style={{
              fontSize: "1.5rem",
              color: "#079992",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Comments
          </Typography>
          {comments?.length
            ? comments.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#ecf0f1",
                      marginBottom: "5px",
                      padding: "5px",
                      paddingLeft: "12px",
                      borderRadius: "6px",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "14px",
                        color: "#079992",
                        fontWeight: "bold",
                      }}
                    >
                      {item?.commenter_name}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {item?.content}
                    </Typography>
                  </div>
                );
              })
            : "No comments"}
          {/* <TextField
            ref={commentRef}
            fullWidth
            margin="normal"
            id="comment"
            name="comment"
            label="Add a comment"
            value={comment}
            onChange={handleCommentChange}
            onKeyPress={handleCommentSend}
            style={{
              backgroundColor: "#b8e994",
              padding: "8px",
              paddingLeft: "15px",
            }}
          /> */}
          <textarea
            ref={commentRef}
            id="comment"
            name="comment"
            label="Add a comment"
            placeholder="Share your thoughts..."
            value={comment}
            onChange={handleCommentChange}
            onKeyPress={handleCommentSend}
            style={{
              backgroundColor: "#eae3c8",
              padding: "8px",
              paddingLeft: "15px",
              width: "100%",
              height: "80px",
              fontFamily: "Arial",
              margin: "1rem auto",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <Button
            onClick={() => {
              handleCommentSendWithClick();
            }}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </CardContent>
      </Card>
      <Box
        display="flex"
        justifyContent="center"
        m={1}
        p={1}
        bgcolor="background.paper"
      >
        {author == userId && (
          <>
            {/* <Box p={1}>
            <Button
              onClick={handleDeleteClick}
              variant="contained"
              color="primary"
            >
              Delete post
            </Button>
          </Box> */}
            <Box p={1}>
              <Button
                //   onClick={() => history.push(`/edit/${slug}`)}
                onClick={() => null}
                variant="contained"
                color="primary"
              >
                Edit post
              </Button>
            </Box>
          </>
        )}
        <Box p={1}>
          <Button
            //   onClick={() => history.push("/create")}
            onClick={() => null}
            variant="contained"
            color="primary"
          >
            Create new post
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Detail;
