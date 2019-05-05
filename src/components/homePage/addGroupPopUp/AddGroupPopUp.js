import {Dialog, DialogTitle} from "@material-ui/core";
import React from "react";
import NewGroupForm from "../../createForms/NewGroupForm";

import "./addGroupPopUp.css";

const AddGroupPopUp = (props) => {

  const {open, handleClose} = props;
  return (
    <Dialog open={open} onClose={handleClose} className="add-new-group-dialog">
      <div className="add-new-group-paper">
        <DialogTitle className="add-new-group-title">{"Add new group"}</DialogTitle>
        <NewGroupForm {...props}/>
      </div>
    </Dialog>
  );
};

export default AddGroupPopUp;