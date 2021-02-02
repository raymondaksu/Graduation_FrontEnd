import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const Context = createContext();

const { Provider } = Context;

export const ContextProvider = ({ children }) => {
  const session_token = localStorage.getItem('token');
  const [token, setToken] = useState(session_token);
  return <Provider value={{ token, setToken }}>{children}</Provider>;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};