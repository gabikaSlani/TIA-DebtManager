import React, {Component, Fragment} from 'react';

import "./createForms.css";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {Button, FormControl} from "@material-ui/core";
import FormChips from "./formChips/FormChips";

class NewGroupForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      chosenFriends: [],
      errorMsg: ''
    }
  }

  handleChange = prop => event => {
    this.setState({[prop]: event.target.value});
  };

  setChosenFriends = (chosenFriends) => {
    this.setState({chosenFriends: chosenFriends})
  };

  setErrorMsg = () => {
    this.setState({errorMsg: 'Choose at least 2 friends.'})
  };

  clearErrorMsg = () => {
    this.setState({errorMsg: ''})
  };

  submit = () => {
    const {reload, handleClose} = this.props;
    if (this.state.chosenFriends.length < 2) {
      this.setErrorMsg();
    } else {
      this.fetchAddGroup();
    }
  };

  fetchAddGroup = () => {
    fetch('/api/home/add-group', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupInfo: this.state,
        id: sessionStorage.getItem('logged')
      })
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        this.fetchAddNotification();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchAddNotification = () => {
    const {user} = this.props;
    const message = user.info.login + ' has created new group "' + this.state.name + '", which you have been added in.';
    console.log(message);
    fetch('/api/home/add-action-notification', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        receivers: this.state.chosenFriends,
      })
    })
      .then(res => res.json())
      .then((res) => {
        const {reload, handleClose} = this.props;
        console.log(res);
        handleClose();
        reload();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  render() {
    const {name, errorMsg} = this.state;
    const {friends} = this.props;
    return (
      <ValidatorForm ref="form" onSubmit={this.submit} onError={errors => console.log(errors)}>
        <FormControl fullWidth required className="add-new-item-form-control">
          <TextValidator
            label="Name"
            onChange={this.handleChange('name')}
            name="name"
            value={name}
            validators={['required']}
            errorMessages={['Name is required.']}
          />
        </FormControl>
        <FormChips friends={friends} setChosenFriends={this.setChosenFriends} clearErrorMsg={this.clearErrorMsg}/>
        <span className="error-msg">{errorMsg}</span><br/>

        <Button variant={"contained"} type="submit" className="form-button">Submit</Button>
      </ValidatorForm>
    );
  }

}

export default NewGroupForm;