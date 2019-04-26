import React, {Fragment} from 'react';
import {Divider, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Image} from "@material-ui/icons";

import './itemList.css';
import '../../paddinger.css';

const ItemListItem = (props) => {

  const {item} = props;
  const payer = item.creatorid === sessionStorage.getItem('logged') ? 'You' : item.creator;
  return (
    <Fragment>
      <ListItem className="items-list-item">
        <ListItemIcon>
          <Image className="image-icon"/>
        </ListItemIcon>
        <ListItemText primary={item.name}
                      secondary={payer + ' paid ' + item.amount + '€'}
                      className="items-list-item-text"/>
        <div className="spacer"/>
        {item.settled
          ? <span className="items-list-item-right-text settled">settled up</span>
          : (item.creatorid === sessionStorage.getItem('logged')
              ? <span className="items-list-item-right-text plus-amount">
                  {'+' + parseFloat(item.debt).toFixed(2) + '€'}</span>
              : <span className="items-list-item-right-text minus-amount">
                  {'-' + parseFloat(item.debt).toFixed(2) + '€'}</span>
          )
        }

      </ListItem>
      <Divider/>
    </Fragment>
  );
}

export default ItemListItem;