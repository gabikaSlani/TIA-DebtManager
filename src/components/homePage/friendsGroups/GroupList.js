import React from "react";
import {Link, List} from "@material-ui/core";

import "./friendsGroups.css";
import {Link as RouterLink} from "react-router-dom";
import FriendListItem from "./FriendListItem";

const GroupList = (props) => {
  const {user} = props;
  return (
    <List dense={false} className="list-friends-groups">
      {user.groups.map((group, index) =>
        <Link
          key={index}
          component={RouterLink}
          to={{pathname: ("/group/" + user.info.id + "/" + group.id)}}
          className="list-item-link-friends-groups"
        >
          <FriendListItem index={index} group={group}/>
        </Link>
      )}
    </List>
  );

}

export default GroupList;