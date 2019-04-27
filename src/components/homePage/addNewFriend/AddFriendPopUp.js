import React from 'react';
import {Button, Dialog, DialogActions, DialogTitle} from "@material-ui/core";

import "./addNewFriend.css";

const AddFriendPopUp = (props) => {
  const {open, user, handleClose, friend} = props;
  const friendName = friend ? friend.login : '' ;

  const handleYes = () => {
    createRequestAndNotification();
  };

  const createRequestAndNotification = () => {
    fetch('/api/home/new-request-and-notification', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
        friend: friend,
        type: 'pair_off'
      })
    })
      .then(res => res.json())
      .then(() => handleClose())
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  const handleNo = () => {
    handleClose();
  };

  return (

    <Dialog open={open}>
      <DialogTitle>{"Do you want to add a new friend with username: " + friendName + "?"}</DialogTitle>
      <DialogActions>
        <Button onClick={handleYes} className="button-yes" autoFocus>
          Yes
        </Button>
        <Button onClick={handleNo} className="button-no">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendPopUp;