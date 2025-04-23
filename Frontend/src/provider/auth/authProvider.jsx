import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));

  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Function to check if user is logged in
  const isLoggedIn = useMemo(() => !!token, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      isLoggedIn,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
