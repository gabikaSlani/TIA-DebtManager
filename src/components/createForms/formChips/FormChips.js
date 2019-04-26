import React, {Component} from 'react';

import Select from 'react-select';
import NoSsr from "@material-ui/core/NoSsr";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import {Cancel} from "@material-ui/icons";

import "./formChips.css";

function NoOptionsMessage(props) {
  return (
    <Typography {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      className="chips-input"
      InputProps={{
        inputComponent,
        inputProps: {
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}
function Placeholder(props) {
  return (
    <Typography {...props.innerProps} className="chips-placeholder">
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className="chips-values">{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      onDelete={props.removeProps.onClick}
      deleteIcon={<Cancel{...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square {...props.innerProps} className="chips-paper">
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
};

class FormChips extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    multi: null,
  };

  friendsToOptions = () => {
    const {friends} = this.props;
    return friends.map(friend => {
      return {value: friend.id, label: friend.login}}
    );
  };

  setMultiOptions = async (name, value) => {
    await this.setState({
      [name]: value,
    });
  };

  handleChange = name => value => {
    this.setMultiOptions(name, value)
      .then(() => {
        let {setChosenFriends, clearErrorMsg} = this.props;
        setChosenFriends(value);
        clearErrorMsg();
      })
  };

  render() {
    const options = this.friendsToOptions();
    return (
      <div className="chips-root">
        <NoSsr>
          <Select
            textFieldProps={{
              label: 'Friends',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={options}
            components={components}
            value={this.state.multi}
            onChange={this.handleChange('multi')}
            isMulti
            className="chips-selector"
          />
        </NoSsr>
      </div>
    );
  }
}
export default FormChips;