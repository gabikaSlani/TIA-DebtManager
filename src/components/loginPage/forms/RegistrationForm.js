import React, {Component, Fragment} from 'react';
import {Button, FormControl, Paper, Snackbar, SnackbarContent, Typography} from "@material-ui/core";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';

import "./forms.css";

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        password: '',
        repeatPassword: ''
      },
      errorMsg: '',
      openSnackbar: false
    };
  }

  handleChange = (event) => {
    const {formData} = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({formData});
    this.setState({errorMsg: ''});
  };

  handleClose = () => {
    this.setState({openSnackbar: false});
  };

  componentDidMount() {
    // custom rules
    ValidatorForm.addValidationRule('passwordMatch', (password) => {
      if (password !== this.state.formData.password) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('minSize5', (value) => {
      if (value && value.length > 0 && value.length < 5) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('minSize8', (value) => {
      if (value && value.length > 0 && value.length < 8) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('maxSize15', (value) => {
      if (value && value.length > 15) {
        return false;
      }
      return true;
    });
  };

  tryRegistrate = (username, password) => {
    fetch('http://localhost:9000/', {
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
        if (res) {
          this.setState({openSnackbar: true});
          this.cleanFormData();
        } else {
          this.setState({errorMsg: 'Username already exists.'});
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  cleanFormData = () => {
    let {formData} = this.state;
    formData = {username: '', password: '', repeatPassword: ''};
    this.setState({formData});
  };

  submit = () => {
    let {formData} = this.state;
    this.tryRegistrate(formData.username, formData.password);
  };

  render() {
    const {formData, errorMsg, openSnackbar} = this.state;
    return (
      <Fragment>
        <Paper className="paper-registration">
          <Typography component="h1" variant="h5">Registration</Typography>
          <ValidatorForm ref="form" onSubmit={this.submit} onError={errors => console.log(errors)}>
            <FormControl margin="normal" required fullWidth>
              <TextValidator
                name="username"
                label="Username"
                onChange={this.handleChange}
                value={formData.username}
                validators={['required', 'minSize5', 'maxSize15']}
                errorMessages={['Username is required.', 'Minimum required size is 5.', 'Maximum required size is 15.']}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextValidator
                name="password"
                label="Password"
                type="password"
                onChange={this.handleChange}
                value={formData.password}
                validators={['required', 'minSize8', 'maxSize15']}
                errorMessages={['Password is required.', 'Minimum required size is 8.', 'Maximum required size is 15.']}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextValidator
                name="repeatPassword"
                label="Password repeat"
                type="password"
                onChange={this.handleChange}
                value={formData.repeatPassword}
                validators={['required', 'passwordMatch']}
                errorMessages={['Password is required.', 'Passwords mismatch.']}
              />
            </FormControl>
            <span className="error-msg">{errorMsg}</span><br/><br/>
            <Button variant={"contained"} className="form-button" type="submit">Register</Button>
          </ValidatorForm>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={this.handleClose}
        >
          <SnackbarContent message="User was successfully registered." className="snackbar"/>
        </Snackbar>
      </Fragment>
    );
  };
}

export default RegistrationForm;
