import React, {Component, Fragment} from 'react';
import {Divider, IconButton, ListItem, ListItemText} from "@material-ui/core";
import {Cancel, CheckCircle} from "@material-ui/icons";


import ListItemWithText from "./ListItemWithText";

class ListItemWithButtons extends Component {

  constructor(props) {
    super(props);

    const {messageInfo} = props;
    console.log(messageInfo);
    this.state = {
      text: messageInfo.message,
      clicked: false
    }
  };

  accept = () => {
    const {messageInfo, user} = this.props;
    console.log('user v accept' + user);
    let updateMessage = '';
    let newMessage = '';
    if (messageInfo.name === 'pair_off') {
      updateMessage = 'You have accepted pair off request from ' + messageInfo.requester_name;
      newMessage = user.info.login + ' has accepted your pair off request.';
    } else if (messageInfo.name === 'settle_up') {
      updateMessage = 'You have accepted settle up request from ' + messageInfo.requester_name;
      newMessage = user.info.login + ' has accepted your settle up request.';
    }
    this.setState({text: updateMessage});
    this.setState({clicked: true});
    this.fetchUpdateAndAddNotification(true, messageInfo.id, messageInfo.type_id, newMessage, updateMessage,
      messageInfo.requester_id, messageInfo.name)
  };

  reject = () => {
    const {messageInfo, user} = this.props;
    console.log('user v reject' + user);
    let updateMessage = '';
    let newMessage = '';
    if (messageInfo.name === 'pair_off') {
      updateMessage = 'You have rejected pair off request from ' + messageInfo.requester_name;
      newMessage = user.info.login + ' has rejected your pair off request.';
    } else if (messageInfo.name === 'settle_up') {
      updateMessage = 'You have rejected settle up request from ' + messageInfo.requester_name;
      newMessage = user.info.login + ' has rejected your settle up request.';
    }
    this.setState({text: updateMessage});
    this.setState({clicked: true});
    this.fetchUpdateAndAddNotification(false, messageInfo.id, messageInfo.type_id, newMessage, updateMessage,
      messageInfo.requester_id, messageInfo.name)
  };

  fetchUpdateAndAddNotification = (accept, notificationId, typeId, newMessage, updateMessage, receiverId, typeName) => {
    fetch('/api/home/update-and-add-notification', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accept: accept,
        notificationId: notificationId,
        typeId: typeId,
        newMessage: newMessage,
        updateMessage: updateMessage,
        receiverId: receiverId
      })
    })
      .then(res => res.json())
      .then(() => {
        if (accept) {
          console.log('je accept');
          if (typeName === 'pair_off') {
            console.log('typeName:' + typeName + '. Ma byt pair off');
            this.fetchAddFriend();
          } else {
            console.log('typeName:' + typeName + '. Ma byt settle up');
            this.fetchSettleUp();
          }
        } else {
          if (this.props.reload) this.props.reload();
          if (this.props.friendReload) this.props.friendReload();
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchAddFriend = () => {
    const friendId = this.props.messageInfo.requester_id;
    let url = '/api/home/add-friend/' + sessionStorage.getItem('logged') + '/' + friendId;
    fetch(url)
      .then(res => res.json())
      .then(() => {
        if(this.props.reload) this.props.reload();
        if (this.props.friendReload) this.props.friendReload();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchSettleUp = () => {
    const friendId = this.props.messageInfo.requester_id;
    const url = '/api/friend/settle/' + sessionStorage.getItem('logged') + '/' + friendId;
    fetch(url)
      .then(res => res.json())
      .then(() => {
        if (this.props.reload) this.props.reload();
        if (this.props.friendReload) this.props.friendReload();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  render() {
    const {text, clicked} = this.state;
    const {colored} = this.props;
    return (
      <Fragment>
        {clicked ?
          <ListItemWithText text={text}/>
          :
          <Fragment>
            <ListItem className={colored ? "notification-list-item colored" : "notification-list-item"}>
              <ListItemText
                primary={text}
                className="notification-list-item-text"
              />
              <div className="notification-list-item-buttons">
                <IconButton aria-label="Check" className="notification-list-item-button" onClick={this.accept}>
                  <CheckCircle/>
                </IconButton>
                <IconButton aria-label="Delete" className="notification-list-item-button" onClick={this.reject}>
                  <Cancel/>
                </IconButton>
              </div>
            </ListItem>
            <Divider/>
          </Fragment>
        }
      </Fragment>
    );
  };
}

export default ListItemWithButtons;