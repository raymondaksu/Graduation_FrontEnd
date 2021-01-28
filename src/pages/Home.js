//import { useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import PostCard from "../components/card/Card"

function Home() {
  const [postList, setPostList] = useState([]);
  const [nextURL, setNextURL] = useState("");

  const fetchData = async (
    postListURL = "http://fs-blog-app-backend-django.herokuapp.com/api/post-list/"
  ) => {
    try {
      const result = await axios.get(postListURL);
      setPostList([...postList, ...result?.data?.results]);
      setNextURL(result?.data?.next);
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
  }, []);

  return (
    <div style={{backgroundColor: '#d9dab0'}}>
      <Navbar />
      <div>
        {postList
          ? postList.map((item, id) => {
              return (
                  <PostCard item={item} id={id}/>
              );
            })
          : "No data available"}
      </div>
      {/* <button onClick={}>View more</button> */}
    </div>
  );
}

export default Home;