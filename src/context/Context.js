import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const Context = createContext();

const { Provider } = Context;

export const ContextProvider = ({ children }) => {
  const user_id = localStorage.getItem('userId');
  const session_token = localStorage.getItem('token');
  const [token, setToken] = useState(session_token);
  const [userId, setUserId] = useState(user_id);
  const [keyword, setKeyword] = useState("");
  const [categoryDisplay, setCategoryDisplay] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    categoryDisplay.map((e) => e.value)
  );
  const [storiesOpen, setStoriesOpen] = useState(false);

  return (
    <Provider
      value={{
        token,
        setToken,
        keyword,
        setKeyword,
        categoryDisplay,
        setCategoryDisplay,
        selectedOption,
        setSelectedOption,
        storiesOpen,
        setStoriesOpen,
        userId,
        setUserId
      }}
    >
      {children}
    </Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
