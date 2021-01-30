import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

export default function ProfilePage() {
  let history = useHistory();
  const [profile, setProfile] = useState([])


  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token)
      const result = await axios.get(`http://fs-blog-app-backend-django.herokuapp.com/api/semih-who-is-a-cloud-engineercdf2230a41/post-detail/`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? "Token " + token : null,
        }
        });
      setProfile(result.data)
      console.log(result.data)
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
  }, [])

  return (
    <div>
        <p>{profile.title}</p>
    </div>
  );
}