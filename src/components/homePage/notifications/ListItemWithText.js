import React, {Fragment} from 'react';
import {Divider, ListItem, ListItemText} from "@material-ui/core";

import "./notifications.css";

const ListItemWithText = (props) => {

  const {text,colored} = props;
  return (
    <Fragment>
        <ListItem className={colored ? "notification-list-item colored" : "notification-list-item"}>
          <ListItemText primary={text} className="notification-list-item-text"/>
        </ListItem>
      <Divider/>
    </Fragment>
  )
};

export default ListItemWithText;