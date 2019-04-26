import {ListItem, ListItemIcon} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";
import React from "react";

import "./friendsGroups.css";

const FriendListItem = (props) => {

  const {index, friend} = props;
  const debtFloat = parseFloat(friend.debt);
  return (
    <ListItem key={index} button className="list-item-friends-groups">
      <ListItemIcon>
        <AccountCircle className="list-item-icon-friends-groups"/>
      </ListItemIcon>
      <div>
        <div className="list-name-friends-groups">{friend.login}</div>
        {debtFloat === 0 ?
          <div className="list-total-friends-groups settled">settled up</div>
          : (debtFloat < 0
              ? <div className="list-total-friends-groups minus-amount">you owe {debtFloat * (-1).toFixed(2)}€</div>
              : <div className="list-total-friends-groups plus-amount">owes you {debtFloat.toFixed(2)}€</div>
          )
        }
      </div>
    </ListItem>
  );
};

export default FriendListItem;
