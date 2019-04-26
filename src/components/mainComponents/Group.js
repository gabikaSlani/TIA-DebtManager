import React, {Component} from 'react';
import './mainComponents.css';
import Header from "./header/Header";

class Group extends Component {

  state = {
    userId: this.props.match.userId,
    groupId: this.props.match.groupId
  };

  render() {
    const {userId, groupId} = this.state;
    return (
      <div className="main-component">
        <Header logged={false}>
          <p>{userId}</p>
          <p>{groupId}</p>
        </Header>
        <span className="settled"> TO DO </span>
      </div>
    );
  };
}

export default Group;