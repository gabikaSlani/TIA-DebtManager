import React from 'react';
import {List, Paper} from "@material-ui/core";
import ItemListHeader from "./ItemListHeader";
import ItemListItem from "./ItemListItem";

import './itemList.css';

const ItemList = (props) => {

  const {items} = props;

  return (
    <Paper className="items-paper">
      <List subheader={<ItemListHeader {...props}/>} className="items-list">
        {items.map((item, index) =>
          <ItemListItem key={index} item={item}/>
        )}
      </List>
    </Paper>
  );
};

export default ItemList;