import React, {Component, Fragment} from "react";
import {Button, ListSubheader, Snackbar, SnackbarContent} from "@material-ui/core";
import {Group} from "@material-ui/icons";
import AddItemPupUp from "../addItemPopUp/AddItemPupUp";

import './itemList.css';
import Tooltip from "@material-ui/core/Tooltip";

class ItemListGroupHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleAddItem = () => {
    this.setState({open: true});
  };


  handleClose = () => {
    this.setState({open: false});
  };

  printMembers = () => {
    const {group, user} = this.props;
    let children = [];
    group.members.forEach(member => {
        children.push(<p key={member.id} className="members-text">{member.login === user.info.login ? 'You' : member.login}</p>);
    });
    return <div>{children}</div>;
  };

  render() {
    const {group, debt} = this.props;
    const {open} = this.state;
    const debtFloat = parseFloat(debt);
    return (
      <Fragment>
        <ListSubheader className="items-list-header">
          <div className="items-friend-info">
            <Group className="friend-icon"/>
            <div>
              <div className="friend-name">{group.name}</div>
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
            <Tooltip title={this.printMembers()} className="with-margin-right">
              <span className="members">{group.members.length} members</span>
            </Tooltip>
            <Button className="button-green" onClick={this.handleAddItem}>Add item</Button>
          </div>
        </ListSubheader>
        <AddItemPupUp open={open} handleClose={this.handleClose} chips={false} group={group} {...this.props}/>
      </Fragment>
    );
  }
}

export default ItemListGroupHeader;