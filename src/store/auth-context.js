import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoginData = localStorage.getItem("logged");

    if (userLoginData === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  // this is done to keep a user logged in after a refresh, by checking if logged is 1 which only happens once someone has logged in once
  //this would create an infinite loop if it wasn't in a useEffect hook
  //by putting the second parameters as [] it only runs once at the start of the program, because [] never changes

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem("logged", "1");
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("logged");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
