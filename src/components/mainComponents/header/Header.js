import React from 'react';
import {AppBar, IconButton, Toolbar} from "@material-ui/core";
import "./header.css";
import "../../paddinger.css";
import {ExitToApp} from "@material-ui/icons";

const Header = (props) => {
  const {logged, logout} = props;

  return (
    <AppBar position="static" className="appBar paddinger">
      <Toolbar className="toolbar">
        <h1 className="title">DEBT MANAGER</h1>
        {logged ?
          <React.Fragment>
            <div className="spacer"/>
            <IconButton color="inherit" type="submit" onClick={logout}>
              <ExitToApp fontSize="large"/>
            </IconButton>
          </React.Fragment>
          :
          <React.Fragment/>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Header;