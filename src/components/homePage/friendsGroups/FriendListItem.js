import {ListItem, ListItemIcon} from "@material-ui/core";
import {AccountCircle, Group} from "@material-ui/icons";
import React from "react";

import "./friendsGroups.css";

const FriendListItem = (props) => {

  const {index, friend, group} = props;
  const debtFloat = friend ? parseFloat(friend.debt) : parseFloat(group.debt);
  const name = friend ? friend.login : group.name;
  return (
    <ListItem key={index} button className="list-item-friends-groups">
      <ListItemIcon>
        {friend
          ? <AccountCircle className="list-item-icon-friends-groups"/>
          : <Group className="list-item-icon-friends-groups"/>
        }
      </ListItemIcon>
      <div>
        <div className="list-name-friends-groups">{name}</div>
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
