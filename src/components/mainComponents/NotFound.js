import React from 'react';
import './mainComponents.css';
import '../paddinger.css';
import Header from "./header/Header";

const NotFound = (props) => {

  const {message} = props;

  return (
    <div className="main-component">
      <Header logged={false}/>
      <div className="paddinger">
        <h4 className="not-found">{message ? message : 'Page is not found.'}</h4>
      </div>
    </div>
  );
};

export default NotFound;