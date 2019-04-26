import React from 'react';
import './mainComponents.css';
import '../paddinger.css';
import Header from "./header/Header";

const ErrorPage = (props) => {

  const statusCode = props.match.params.code;
  const message = props.match.params.message;

  return (
    <div className="main-component">
      <Header logged={false}/>
      <div className="paddinger">
        <h1 className="not-found">Error</h1>
        <h3 className="white-text">{statusCode + ' ' + message}</h3>
      </div>
    </div>
  );
};

export default ErrorPage;