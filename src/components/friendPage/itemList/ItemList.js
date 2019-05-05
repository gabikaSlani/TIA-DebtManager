import React from 'react';
import {List, Paper} from "@material-ui/core";
import ItemListHeader from "./ItemListHeader";
import ItemListItem from "./ItemListItem";
import ItemListGroupHeader from "./ItemListGroupHeader";

import './itemList.css';

const ItemList = (props) => {

  const {items, friend} = props;

  return (
    <Paper className="items-paper">
      <List
        subheader={
          friend
            ? <ItemListHeader {...props}/>
            : <ItemListGroupHeader {...props} />
        }
        className="items-list">
        {items.map((item, index) =>
          <ItemListItem key={index} item={item}/>
        )}
      </List>
    </Paper>
  );
};

export default ItemList;