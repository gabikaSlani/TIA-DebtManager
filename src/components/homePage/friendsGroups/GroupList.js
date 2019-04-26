import React, {Component} from "react";
import {List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Group} from "@material-ui/icons";

import "./friendsGroups.css";

class GroupList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };
  }

  render() {
    const {list} = this.state;
    return (
      <List dense={false} className="list-friends-groups">
        {list.map((item, index) =>
          <ListItem key={index}>
            <ListItemIcon>
              <Group fontSize="large"/>
            </ListItemIcon>
            <ListItemText primary={item.name} secondary={item.debt} />
          </ListItem>
        )}
      </List>
    );
  }
}

export default GroupList;