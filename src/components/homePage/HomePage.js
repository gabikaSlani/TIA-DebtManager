import React, {Component, Fragment} from "react";
import {Button} from "@material-ui/core";
import FriendsGroupsPaper from "./friendsGroups/FriendsGroupsPaper";
import AddFriendForm from "./addNewFriend/AddFriendForm";
import Header from "../mainComponents/header/Header";
import UserHeader from "../mainComponents/userHeader/UserHeader";
import AddItemPupUp from "../friendPage/addItemPopUp/AddItemPupUp";
import NotLogged from "../mainComponents/NotLogged";

import './homePage.css';
import "../paddinger.css";
import AddGroupPopUp from "./addGroupPopUp/AddGroupPopUp";

class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openGroup: false
    }
  }

  logout = () => {
    this.props.setUser(null);
    window.sessionStorage.removeItem('logged');
    this.props.history.push('/');
  };

  newItem = () => {
    this.setState({open: true});
  };

  newGroup = () => {
    this.setState({openGroup:true})
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleCloseGroup = () => {
    this.setState({openGroup: false});
  };

  loggedUserIdInUrl = () => {
    return this.props.match.params.id === window.sessionStorage.getItem('logged');
  };

  render() {
    const {user} = this.props;
    const {open, openGroup} = this.state;
    return (
      <Fragment>
        {user && this.loggedUserIdInUrl()
          ?
          <div>
            <Header logged={true} logout={this.logout}/>
            <UserHeader {...this.props}/>
            <div className="paddinger">
              <FriendsGroupsPaper user={user}/>
              <div className="new-group-and-friend">
                <AddFriendForm {...this.props}/>
                <div className="new-item-group-buttons">
                  <Button
                    variant={"contained"}
                    className="new-button new-item-btn"
                    type="submit"
                    onClick={this.newItem}>
                    New item
                  </Button>
                  <span className="spacer"/>
                  <Button
                    variant={"contained"}
                    className="new-button new-group-btn"
                    type="submit"
                    onClick={this.newGroup}>
                    New group
                  </Button>
                </div>
              </div>
            </div>
            <AddItemPupUp open={open} handleClose={this.handleClose} chips={true} friends={user.friends} {...this.props}/>
            <AddGroupPopUp open={openGroup} handleClose={this.handleCloseGroup} friends={user.friends} {...this.props}/>
          </div>
          :
          <NotLogged />
        }
      </Fragment>
    );
  }
}

export default HomePage;