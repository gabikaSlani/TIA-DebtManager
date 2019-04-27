import React, {Component, Fragment} from 'react';
import {
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import {AccountCircle, Search} from "@material-ui/icons";
import AddFriendPopUp from "./AddFriendPopUp";

import "./addNewFriend.css";
import MessageDialog from "../../MessageDialog";


class AddFriendForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      all: [],
      displayed: [],
      openAddFriendPopUp: false,
      openMessageDialog: false,
      openMessageDialog2: false,
      dialogUser: null
    };

    this.lastQuery = '';
  };

  setAllAndDisplayed = (array) => {
    this.setState({all: array});
    this.setState({displayed: array});
  };

  asyncSetAll = async (array) => {
    await this.setState({all: array});
  };

  componentDidMount() {
    this.fetchNotFriends()
      .then(res => {
        this.setAllAndDisplayed(res);
      })
  }

  fetchNotFriends = () => {
    let url = '/home/users/' + sessionStorage.getItem('logged');
    return fetch(url)
      .then(res => res.json())
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  searchHandler = (event) => {
    this.lastQuery = event.target.value.toLowerCase();
    this.filterUsers(this.lastQuery);
  };

  filterUsers = (query) => {
    let filtered = this.state.all.filter((el) => {
      let searchValue = el.login.toLowerCase();
      return searchValue.indexOf(query) !== -1;
    });
    this.setState({displayed: filtered});
  };

  handleClick = (friend) => {
    this.fetchIfUserAlreadySentRequest(friend);
  };

  fetchIfFriendSentRequest = (friend) => {
    let url = '/home/find-request/' + friend.id + '/' + sessionStorage.getItem('logged') + '/1';
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({dialogUser: friend});
        res
          ? this.setState({openMessageDialog2: true})
          : this.setState({openAddFriendPopUp: true});
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchIfUserAlreadySentRequest = (friend) => {
    let url = '/home/find-request/' + sessionStorage.getItem('logged')+ '/' + friend.id  + '/1';
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({dialogUser: friend});
        res
          ? this.setState({openMessageDialog: true})
          : this.fetchIfFriendSentRequest(friend)
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  handleClose = () => {
    this.fetchNotFriends()
      .then((res) => {
        this.asyncSetAll(res)
          .then(() => {
            this.filterUsers(this.lastQuery);
            this.setState({openAddFriendPopUp: false});
          })
      });
  };

  handleCloseMessage = () => {
    this.setState({openMessageDialog: false});
  };

  handleCloseMessage2 = () => {
    this.setState({openMessageDialog2: false});
  };


  render() {
    const {displayed, dialogUser, openAddFriendPopUp, openMessageDialog, openMessageDialog2} = this.state;

    return (
      <Fragment>
        <Paper className="form-add-friend">
          <Typography className="title-add-friend">ADD NEW FRIEND</Typography>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search/>
                </InputAdornment>
              ),
            }}
            onChange={this.searchHandler}
            className="input-form-add-friend"
          />
          {displayed.length > 0 ?
            <List className="list-add-friend">
              {displayed.map((item, index) =>
                <ListItem key={item.id} id={item.id} button className="item-list-add-friend"
                          onClick={() => this.handleClick(item)}
                >
                  <ListItemIcon><AccountCircle fontSize="large"/></ListItemIcon>
                  <ListItemText primary={item.login}/>
                </ListItem>
              )}
            </List>
            :
            <List className="list-add-friend">
              <span>No users found.</span>
            </List>
          }
        </Paper>
        <AddFriendPopUp open={openAddFriendPopUp} friend={dialogUser} handleClose={this.handleClose} {...this.props}/>
        <MessageDialog open={openMessageDialog} handleClose={this.handleCloseMessage}
                       message={'You have already sent request to ' + (dialogUser ? dialogUser.login : '')}/>
        <MessageDialog open={openMessageDialog2} handleClose={this.handleCloseMessage2}
                       message={(dialogUser ? dialogUser.login : '') + ' has already sent you request. You should answer it.'}/>
      </Fragment>
    );
  };
}

export default AddFriendForm;