import React, { Fragment, useContext } from "react";

import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/auth-context";

function App() {
  const ctxAuth = useContext(AuthContext);
  return (
    <Fragment>
      <MainHeader />
      <main>
        {!ctxAuth.isLoggedIn && <Login />}
        {ctxAuth.isLoggedIn && <Home />}
      </main>
    </Fragment>
  );
}

export default App;
