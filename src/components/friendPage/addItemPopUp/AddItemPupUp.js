import React from 'react';
import {Dialog, DialogTitle} from "@material-ui/core";

import "./addItemPopUp.css";
import "../itemList/itemList.css";
import NewItemForm from "../../createForms/NewItemForm";

const AddItemPupUp = (props) => {

  const {open, handleClose} = props;
  return (
    <Dialog open={open} onClose={handleClose} className="add-new-item-dialog">
      <div className="add-new-item-paper">
        <DialogTitle className="add-new-item-title">{"Add new item"}</DialogTitle>
        <NewItemForm {...props}/>
      </div>
    </Dialog>
  );
};

export default AddItemPupUp;