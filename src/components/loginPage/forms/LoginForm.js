import React, {Component} from 'react';
import {Button, FormControl, Paper, Typography} from "@material-ui/core";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';

import "./forms.css";

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        password: ''
      },
      loginErrorMsg: '',
      validForm: false
    };
  }

  handleChange = (event) => {
    const {formData} = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({formData});
    this.setState({loginErrorMsg: ''});
  };

  validData = (username, password) => {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: username,
        password: password
      })
    })
      .then(res => res.json())
      .then(res => {
          if (res.valid) {
            window.sessionStorage.setItem('logged', res.id);
            this.props.history.push('/home/' + res.id);
          } else {
            this.setState({loginErrorMsg: 'Invalid username or password'});
          }
        }
      )
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  submit = () => {
    const {formData} = this.state;
    this.validData(formData.username, formData.password);
  };

  render() {
    const {formData, loginErrorMsg} = this.state;
    return (
      <Paper className="paper-login">
        <Typography component="h1" variant="h5">Log in</Typography>
        <ValidatorForm ref="form" onSubmit={this.submit} onError={errors => console.log(errors)}>
          <FormControl margin="normal" required fullWidth>
            <TextValidator
              label="Username"
              onChange={this.handleChange}
              name="username"
              value={formData.username}
              validators={['required']}
              errorMessages={['Username is required.']}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextValidator
              label="Password"
              onChange={this.handleChange}
              name="password"
              value={formData.password}
              type="password"
              validators={['required']}
              errorMessages={['Password is required.']}/>
          </FormControl>
          <span className="error-msg">{loginErrorMsg}</span><br/><br/>
          <Button variant={"contained"} type="submit" className="form-button">Log in</Button>
        </ValidatorForm>
      </Paper>
    );
  }
}

export default LoginForm;
