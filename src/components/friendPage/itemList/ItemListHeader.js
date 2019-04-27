import React, {Component, Fragment} from "react";
import {Button, ListSubheader, Snackbar, SnackbarContent} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";
import AddItemPupUp from "../addItemPopUp/AddItemPupUp";

import './itemList.css';
import MessageDialog from "../../MessageDialog";

class ItemListHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openMessageDialog: false,
      openMessageDialog2: false,
      openSnackbar: false,
    };
  }

  handleAddItem = () => {
    this.setState({open: true});
  };

  handleCloseMessage = () => {
    this.setState({openMessageDialog: false});
  };

  handleCloseMessage2 = () => {
    this.setState({openMessageDialog2: false});
  };

  handleCloseSnackBar = () => {
    this.setState({openSnackbar: false});
  };

  handleSettleUp = () => {
    const {friend, user} = this.props;
    this.fetchIfUserAlreadySentRequest(user.info.id, friend.id);
  };

  createRequestAndNotification() {
    const {friend, user} = this.props;
    fetch('/api/home/new-request-and-notification', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
        friend: friend,
        type: 'settle_up'
      })
    })
      .then(res => res.json())
      .then(() => this.setState({openSnackbar: true}))
      .catch(err => console.log(err));
  };

  fetchIfFriendSentRequest = (userId, friendId) => {
    let url = '/api/home/find-request/' + friendId + '/' + userId + '/2';
    fetch(url)
      .then(res => res.json())
      .then(res => {
        res
          ? this.setState({openMessageDialog2: true})
          : this.createRequestAndNotification();
      })
      .catch(err => console.log(err));
  };

  fetchIfUserAlreadySentRequest = (userId, friendId) => {
    let url = '/api/home/find-request/' + userId + '/' + friendId + '/2';
    fetch(url)
      .then(res => res.json())
      .then(res => {
        res
          ? this.setState({openMessageDialog: true})
          : this.fetchIfFriendSentRequest(userId, friendId)
      })
      .catch(err => console.log(err));
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const {friend, debt} = this.props;
    const {open, openMessageDialog, openMessageDialog2, openSnackbar} = this.state;
    const debtFloat = parseFloat(debt);
    return (
      <Fragment>
        <ListSubheader className="items-list-header">
          <div className="items-friend-info">
            <AccountCircle className="friend-icon"/>
            <div>
              <div className="friend-name">{friend.login}</div>
              {debtFloat === 0
                ? <div className="friend-total settled">settled up</div>
                : (debtFloat < 0
                    ? <div className="friend-total minus-amount">you owe {debtFloat * (-1).toFixed(2)}€</div>
                    : <div className="friend-total plus-amount">owes you {debtFloat.toFixed(2)}€</div>
                )
              }
            </div>
          </div>
          <span className="spacer"/>
          <div className="items-list-header-buttons">
            <Button className="button-green" onClick={this.handleAddItem}>Add item</Button>
            <Button className="button-orange" onClick={this.handleSettleUp}>Settle up</Button>
          </div>
        </ListSubheader>
        <AddItemPupUp open={open} handleClose={this.handleClose} chips={false} {...this.props}/>
        <MessageDialog open={openMessageDialog} handleClose={this.handleCloseMessage}
                       message={'You have already sent request to ' + (friend ? friend.login : '')}/>
        <MessageDialog open={openMessageDialog2} handleClose={this.handleCloseMessage2}
                       message={(friend ? friend.login : '') + ' has already sent you request. You should answer it.'}/>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={this.handleCloseSnackBar}
        >
          <SnackbarContent message="Request was sent." className="snackbar"/>
        </Snackbar>
      </Fragment>
    );
  }
}

export default ItemListHeader;