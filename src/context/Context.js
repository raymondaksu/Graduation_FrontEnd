import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const Context = createContext();

const { Provider } = Context;

export const ContextProvider = ({ children }) => {
  const session_token = localStorage.getItem("token");
  const [token, setToken] = useState(session_token);
  const [keyword, setKeyword] = useState("");
  const [categoryDisplay, setCategoryDisplay] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    categoryDisplay.map((e) => e.value)
  );

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
      }}
    >
      {children}
    </Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
