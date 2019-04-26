import React from 'react';
import {Button, Dialog, DialogActions, DialogTitle} from "@material-ui/core";

import "./homePage/addNewFriend/addNewFriend.css";

const MessageDialog = (props) => {
  const {open, message, handleClose} = props;
  const messageText = message ? message : '' ;

  const handleOk = () => {
    handleClose();
  };

  return (

    <Dialog open={open}>
      <DialogTitle>{messageText}</DialogTitle>
      <DialogActions>
        <Button onClick={handleOk} className="button-yes" autoFocus>
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;