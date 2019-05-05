import React from 'react';
import {AppBar, Toolbar} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";
import Notification from "../../homePage/notifications/Notification";

import "./userHeader.css";
import "../../paddinger.css";

const UserHeader = (props) => {
  const {user} = props;

  const generate = () => {
    let children = [];
    const entries = Object.entries(user.notifications);
    for (const [key, value] of entries){
     children.push(<Notification key={key} type={key} count={value.count} messages={value.messages} {...props}/>)
    }
    return children;
  };

  return (
    <AppBar position="static" className="appBar-user paddinger">
      <Toolbar className="toolbar">
        <div className="user-info">
          <AccountCircle className="user-icon"/>
          <div>
            <div className="user-name">{user.info.login}</div>
            {user.total === 0
              ? <div className="user-total settled">settled up</div>
              : (user.total < 0
                  ? <div className="user-total minus-amount">{user.total}€</div>
                  : <div className="user-total plus-amount">+{user.total}€</div>
              )
            }
          </div>
        </div>
        <span className="spacer"/>
        <div>
          {generate()}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;