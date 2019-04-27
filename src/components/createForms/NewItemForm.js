import React, {Component, Fragment} from 'react';

import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {Button, FormControl} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormChips from "./formChips/FormChips";

import "./createForms.css";

class NewItemForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      description: '',
      chosenFriends: [],
      errorMsg: ''
    };
  }

  setErrorMsg = () => {
    this.setState({errorMsg: 'Friends cannot be empty. Choose at least one friend.'})
  };

  clearErrorMsg = () => {
    this.setState({errorMsg: ''})
  };

  submit = () => {
    const {chips, friend} = this.props;
    if(!chips) {
      this.setState({chosenFriends: [{value: friend.id, label: friend.login}]})
      this.fetchAddItem();
    }else {
      if (this.state.chosenFriends.length < 1) {
        this.setErrorMsg();
      } else {
        this.fetchAddItem();
      }
    }
  };

  fetchAddItem = () => {
    fetch('/home/add-item', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemInfo: this.state,
        id: sessionStorage.getItem('logged')
      })
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        this.fetchAddNotification(res.debt);
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchAddNotification = (debt) => {
    const {user} = this.props;
    const message = user.info.login + ' added new item "' + this.state.description + '". You owe ' + debt + '€';
    console.log(message);
    fetch('/home/add-action-notification', {
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
        const {reload, handleClose, friendReload} = this.props;
        console.log(res);
        handleClose();
        if (reload) reload();
        if (friendReload) friendReload();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  handleChange = prop => event => {
    this.setState({[prop]: event.target.value});
  };

  setChosenFriends = (chosenFriends) => {
    this.setState({chosenFriends: chosenFriends})
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('number', (amount) => {
      return !isNaN(amount) && parseFloat(amount) > 0;
    });
  }

  render() {
    const {description, amount, errorMsg} = this.state;
    const {chips, friends} = this.props;
    return (
      <ValidatorForm ref="form" onSubmit={this.submit} onError={errors => console.log(errors)}>
        <FormControl fullWidth required className="add-new-item-form-control">
          <TextValidator
            label="Description"
            onChange={this.handleChange('description')}
            name="description"
            value={description}
            validators={['required']}
            errorMessages={['Description is required.']}/>
        </FormControl>
        <FormControl fullWidth required className="add-new-item-form-control">
          <TextValidator
            label="Amount"
            onChange={this.handleChange('amount')}
            name="amount"
            value={amount}
            validators={['required', 'number']}
            errorMessages={['Amount is required.', 'Amount must be positive number.']}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"> € </InputAdornment>
              ),
            }}
          />
        </FormControl>
        {chips
          ? <Fragment>
            <FormChips friends={friends} setChosenFriends={this.setChosenFriends} clearErrorMsg={this.clearErrorMsg}/>
            <span className="error-msg">{errorMsg}</span><br/>
          </Fragment>
          : <Fragment/>}
        <Button variant={"contained"} type="submit" className="form-button">Submit</Button>
      </ValidatorForm>
    );
  }

}

export default NewItemForm;