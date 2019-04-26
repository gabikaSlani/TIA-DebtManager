import React, {Component, Fragment} from "react";
import {Error, EuroSymbol, PersonAdd} from "@material-ui/icons";
import {Badge, ClickAwayListener, Grow, IconButton, List, Paper, Popper} from "@material-ui/core";
import ListItemWithButtons from "./ListItemWithButtons";

import "./notifications.css";
import ListItemWithText from "./ListItemWithText";

class Notification extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      count: this.props.count,
      messages: this.props.messages,
      invisible: true
    };
  }

  componentDidMount() {
    this.setState({invisible: this.state.count === 0});
  }

  handleToggle = (event) => {
    event.preventDefault();
    this.setState(state => ({open: !state.open}));
    if (this.state.count > 0 && this.state.messages.length > 0 && !this.state.invisible) {
      this.setState({invisible: true});
      this.fetchSetSeen();
    }
    if(this.state.invisible){
      this.setState({count: 0});
    }
  };

  fetchSetSeen = () => {
    const typeId = this.state.messages[0].type_id;
    let url = 'http://localhost:9000/home/set-seen/' + sessionStorage.getItem('logged') + '/' + typeId;
    fetch(url)
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  handleClose = event => {
    event.preventDefault();
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({open: false});
  };

  generate = () => {
    const {messages, reload, friendReload, user} = this.props;
    let children = [];
    const values = Object.values(messages);
    let counter = this.state.count;
    for (const value of values){
      value.requester_id
      ? children.push(<ListItemWithButtons key={value.id} messageInfo={value} {...this.props}
                                           user={user} reload={reload} friendReload={friendReload} colored={counter > 0}/>)
        : children.push(<ListItemWithText key={value.id} text={value.message} colored={counter > 0}/>);
      counter--;
    }
    return children;
  };

  render() {
    const {open, count, invisible} = this.state;
    const {type} = this.props;
    return (
      <Fragment>
        <IconButton color="inherit"
                    buttonRef={node => {
                      this.anchorEl = node;
                    }}
                    aria-owns={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleToggle}>
          <Badge badgeContent={count} color="primary" invisible={invisible} className="badge">
            {type === 'pair_off' ? <PersonAdd fontSize="large"/> :
              (type === 'settle_up' ? <EuroSymbol fontSize="large"/> :
                <Error fontSize="large"/>)
            }
          </Badge>
        </IconButton>
        <Popper open={open} anchorEl={this.anchorEl} placement="bottom-end" transition className="popper">
          {({TransitionProps}) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
            >
              <Paper className="notification-paper">
                <ClickAwayListener onClickAway={this.handleClose}>
                  <List dense={false} className="notification-list">
                    {this.generate()}
                  </List>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  }
}

export default Notification;