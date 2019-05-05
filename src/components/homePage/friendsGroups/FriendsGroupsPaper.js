import React, {Component} from 'react';
import {Paper, Tab, Tabs} from "@material-ui/core";
import {AccountCircle, Group} from "@material-ui/icons";
import FriendList from "./FriendList";
import GroupList from "./GroupList";

import "./friendsGroups.css";

class FriendsGroupsPaper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({value: value});
  };

  render() {
    const {value} = this.state;
    const {user} = this.props;
    return (
      <Paper className="paper-tabs">
        <Tabs
          value={value}
          onChange={this.handleChange}
          variant="fullWidth"
          className="tabs"
          indicatorColor="primary"
        >
          <Tab icon={<AccountCircle/>} label="Friends"/>
          <Tab icon={<Group/>} label="Groups"/>
        </Tabs>
        {value === 0 && <FriendList user={user}/>}
        {value === 1 && <GroupList user={user}/>}
      </Paper>
    );
  }
}

export default FriendsGroupsPaper;