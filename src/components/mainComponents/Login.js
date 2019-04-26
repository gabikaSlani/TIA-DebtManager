import React, {Component} from 'react';
import './mainComponents.css';
import LoginPage from "../loginPage/LoginPage";


class Login extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    window.sessionStorage.removeItem('logged');
  }

  render() {
    return (
      <div className="main-component">
        <LoginPage {...this.props}/>
      </div>
    );
  }
}

export default Login;
