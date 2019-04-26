import React from 'react';
import './mainComponents.css';
import '../paddinger.css';
import Header from "./header/Header";
import {CircularProgress} from "@material-ui/core";

const LoginPage = () => {
  return (
    <div className="main-component">
      <Header logged={false}/>
      <div className="center">
        <CircularProgress className="loading"/>
      </div>
    </div>
  );
};

export default LoginPage;