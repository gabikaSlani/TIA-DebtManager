import React, {Fragment} from "react";
import Header from "./header/Header";
import Button from "@material-ui/core/Button";

const NotLogged = (props) => {

  const logout = () => {
    window.sessionStorage.removeItem('logged');
    props.history.push('/');
  };

  return (
    <Fragment>
      <Header logged={false}/>
      <div className="paddinger">
        <h4 className="red-message">No user is logged in.</h4>
        <Button variant={"contained"} type="submit" className="form-button" onClick={logout}>Log in</Button>
      </div>
    </Fragment>
  );
};

export default NotLogged;
