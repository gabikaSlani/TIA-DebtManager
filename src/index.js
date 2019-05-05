import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './components/mainComponents/Login';
import Home from './components/mainComponents/Home';
import Friend from './components/mainComponents/Friend';
import NotFound from './components/mainComponents/NotFound';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import ErrorPage from "./components/mainComponents/ErrorPage";
import Group from "./components/mainComponents/Group";


const routing = (
  <BrowserRouter>
      <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/home/:id" component={Home}/>
      <Route path="/friend/:userId/:friendId" component={Friend}/>
      <Route path="/group/:userId/:groupId" component={Group}/>
      <Route path="/error/:message" component={ErrorPage}/>
      <Route component={NotFound}/>
      </Switch>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
