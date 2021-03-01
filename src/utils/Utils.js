import axios from "axios";

export const postData = async (path, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://127.0.0.1:8000/${path}`,
    data,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? "Token " + token : null,
      },
    }
  );
  return response;
};

export const putData = async (path, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `http://127.0.0.1:8000/${path}`,
    data,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? "Token " + token : null,
      },
    }
  );
  return response;
};