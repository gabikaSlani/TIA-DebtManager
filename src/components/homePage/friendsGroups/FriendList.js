import React from 'react';
import {Link, List} from "@material-ui/core";
import {Link as RouterLink} from 'react-router-dom';
import FriendListItem from "./FriendListItem";

import "./friendsGroups.css";

const FriendList = (props) => {

  const {user} = props;
  return (
    <List dense={false} className="list-friends-groups">
      {user.friends.map((friend, index) =>
        <Link
          key={index}
          component={RouterLink}
          to={{pathname: ("/friend/" + user.info.id + "/" + friend.id), state: {user}}}
          className="list-item-link-friends-groups"
        >
          <FriendListItem index={index} friend={friend}/>
        </Link>
      )}
    </List>
  );
};

export default FriendList;