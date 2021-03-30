import { useState, useRef, useContext, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Context } from "../../context/Context";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { squareButtonStyle } from "../../styles/smallElements";
import { squareButtonsContainerStyle } from "../../styles/smallElements";
import { wideButtonStyle } from "../../styles/smallElements";
import { wallpaper } from "../../styles/background";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Edit from "@material-ui/icons/Edit";
import PublishIcon from "@material-ui/icons/Publish";
import SendIcon from "@material-ui/icons/Send";
import Avatar from "@material-ui/core/Avatar";
import ExpandLess from "@material-ui/icons/ExpandLess";
import Grid from "@material-ui/core/Grid";

import EditComment from "../../components/editComment/EditComment";
import DeleteComment from "../../components/DeleteComment";
import DeletePost from "../../components/DeletePost";

const useStyles = makeStyles({
  root: {
    minWidth: "300px",
    maxWidth: "60vw",
    margin: "20px auto",
    pointerEvents: "none",
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
    pointerEvents: "all",
  },
  avatar: {
    marginBottom: "0.35em",
  },
  small: {
    pointerEvents: "all",
    cursor: "pointer",
  },
});

//--------------MAIN FUNCTION-----------
const Detail = () => {
  const { userId, setUserId } = useContext(Context);
  const commentRef = useRef("");
  let { slug } = useParams();
  const [item, setItem] = useState([]);
  const [comment, setComment] = useState("");
  const [deleteComment, setDeleteComment] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState([]);
  const [changedContent, setChangedContent] = useState("");
  const classes = useStyles();
  const history = useHistory();
  // --------fetch data------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(
        `https://fs-blogapp-django.herokuapp.com/api/${slug}/post-detail/`,
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
      await axios.post(
        `https://fs-blogapp-django.herokuapp.com/api/${slug}/like/`,
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

  //---------------Publish Post----------------------
  const handlePostMakePublish = async () => {
    try {
      await axios.put(
        `https://fs-blogapp-django.herokuapp.com/api/${slug}/edit/`,
        {
          status: "published",
          author_avatar: author,
          content,
          image_URL,
          title,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      alert("Your post is published!");
      fetchData();
    } catch ({ response }) {
      if (response) {
        console.log(response?.data);
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  //--------------Comment Change---------------------
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSend = async (key) => {
    if (key?.charCode === 13) {
      try {
        await axios.post(
          `https://fs-blogapp-django.herokuapp.com/api/${slug}/comment-create/`,
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
      await axios.post(
        `https://fs-blogapp-django.herokuapp.com/api/${slug}/comment-create/`,
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

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToUserDetailPage = (idOfUser) => {
    history.push(`/user-detail/${idOfUser}`);
  };

  // -------------RETURN---------------
  return (
    <div style={wallpaper}>
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
            <div
              style={{
                border: "1px solid #719fb0",
                display: "flex",
                borderRadius: "10px",
                justifyContent: "space-between",
                marginBottom: "2rem",
                padding: "8px",
              }}
            >
              <CardActions
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt="User Avatar"
                  src={author_avatar}
                  className={classes.small}
                  onClick={() => goToUserDetailPage(author_name)}
                />
                <Typography
                  onClick={() => goToUserDetailPage(author_name)}
                  style={{
                    fontSize: "18px",
                    color: "#079992",
                    fontWeight: "bold",
                    marginLeft: "1rem",
                    pointerEvents: "stroke",
                  }}
                >
                  {capitalize(author_name)}
                </Typography>
              </CardActions>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    color: "#3c6382",
                  }}
                >
                  {moment(item?.publish_date).format("mm:ss") ===
                  moment(item?.update_date).format("mm:ss")
                    ? moment(item?.publish_date).format("MMM Do YYYY, hh:mm")
                    : moment(item?.update_date).format("MMM Do YYYY, hh:mm") +
                      " (edited)"}
                </Typography>
              </div>
            </div>
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
        <Grid container justify="center">
          <EditComment
            open={editComment}
            setOpen={setEditComment}
            commentContent={editCommentContent}
            changedContent={changedContent}
            setChangedContent={setChangedContent}
            refreshData={refreshData}
            slug={slug}
          />
        </Grid>
        <Grid container justify="center">
          <DeleteComment
            open={deleteComment}
            setOpen={setDeleteComment}
            commentContent={editCommentContent}
            refreshData={refreshData}
            slug={slug}
          />
        </Grid>
        <CardContent style={{ pointerEvents: "all" }}>
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
          {/* comment-box---------------------- */}
          {comments?.length
            ? comments
                .sort(
                  ({ id: previousID }, { id: currentID }) =>
                    previousID - currentID
                )
                .map((item) => {
                  return (
                    <div
                      key={item.time_stamp}
                      style={{
                        backgroundColor: "#ecf0f1",
                        marginBottom: "12px",
                        padding: "5px",
                        paddingLeft: "8px",
                        borderRadius: "6px",
                        display: "flex",
                        boxShadow: "2px 2px 5px #636e72",
                      }}
                    >
                      <div
                        style={{
                          padding: "6px",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "top",
                        }}
                      >
                        <Avatar
                          alt="Commenter Avatar"
                          src={item?.commenter_avatar}
                          className={classes.small}
                          onClick={() =>
                            goToUserDetailPage(item?.commenter_name)
                          }
                        />
                      </div>
                      <div
                        style={{
                          paddingLeft: "12px",
                          paddingRight: "8px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <Typography
                              onClick={() =>
                                goToUserDetailPage(item?.commenter_name)
                              }
                              style={{
                                fontSize: "14px",
                                color: "#079992",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              {capitalize(item?.commenter_name)}
                            </Typography>
                          </div>
                          {console.log("id: ", item.id)}
                          {item.commenter == userId ? (
                            <div>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditComment(true);
                                  setEditCommentContent(item);
                                  setChangedContent(item.content);
                                }}
                              >
                                <Edit
                                  style={{
                                    width: "1.2rem",
                                    height: "1.2rem",
                                    color: "green",
                                  }}
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                style={{ marginLeft: "1rem" }}
                                onClick={() => {
                                  setDeleteComment(true);
                                  setEditCommentContent(item);
                                }}
                              >
                                <DeleteForever
                                  style={{
                                    width: "1.2rem",
                                    height: "1.2rem",
                                    color: "tomato",
                                  }}
                                />
                              </IconButton>
                            </div>
                          ) : null}
                        </div>

                        <Typography
                          style={{
                            fontSize: "14px",
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
                          {moment(item?.time_stamp).format("mm:ss") ===
                          moment(item?.edit_time).format("mm:ss")
                            ? moment(item?.time_stamp).format(
                                "MMMM Do YYYY, h:mm"
                              )
                            : moment(item?.edit_time).format(
                                "MMM Do YYYY, h:mm"
                              ) + " (edited)"}
                        </Typography>
                      </div>
                    </div>
                  );
                })
            : "No comments"}
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
              minHeight: "80px",
              fontFamily: "Arial",
              margin: "1rem auto",
              borderRadius: "10px",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
            }}
          />
          <Button
            onClick={() => {
              handleCommentSendWithClick();
            }}
            variant="contained"
            style={{ backgroundColor: "green" }}
          >
            <SendIcon style={{ color: "#fff" }} />
          </Button>
        </CardContent>
      </Card>
      {/* buttons--------------------- */}
      <Box display="flex" justifyContent="center" m={1} p={1}>
        {author == userId && (
          <>
            {author == userId && status == "draft" && (
              <>
                <Box p={1}>
                  <button
                    style={squareButtonStyle}
                    onClick={() => handlePostMakePublish()}
                  >
                    <PublishIcon />
                    <br />
                    PUBLISH POST
                  </button>
                </Box>
              </>
            )}
            <Box p={1}>
              <button
                style={{ ...squareButtonStyle, backgroundColor: "#3c6382" }}
                onClick={() =>
                  history.push({
                    pathname: `/edit/${slug}`,
                    state: { postedItem: item },
                  })
                }
              >
                <Edit />
                <br />
                EDIT POST
              </button>
            </Box>
            <Box p={1}>
              <button
                onClick={() => setDeletePost(true)}
                style={{ ...squareButtonStyle, backgroundColor: "tomato" }}
              >
                <DeleteForever />
                <br />
                DELETE POST
              </button>
            </Box>
            <DeletePost open={deletePost} setOpen={setDeletePost} slug={slug} />
          </>
        )}
      </Box>
      <div style={{ ...squareButtonsContainerStyle, justifyContent: "center" }}>
        <button onClick={() => history.push("/home")} style={wideButtonStyle}>
          Back
        </button>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "2.5rem",
          right: "1.5rem",
          borderRadius: "50%",
          backgroundColor: "#99bbad",
        }}
      >
        <IconButton
          onClick={scrollTop}
          style={{ boxShadow: "4px 3px 5px grey" }}
        >
          <ExpandLess
            style={{
              width: "1.6rem",
              height: "1.6rem",
              color: "white",
            }}
          />
        </IconButton>
      </div>
    </div>
  );
};
export default Detail;
