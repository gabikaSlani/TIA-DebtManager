import React, {Fragment} from 'react';
import Header from "../mainComponents/header/Header";
import UserHeader from "../mainComponents/userHeader/UserHeader";
import ItemList from "./itemList/ItemList";

import "../paddinger.css";

const FriendPage = (props) => {

  const logout = () => {
    window.sessionStorage.removeItem('logged');
    props.history.push('/');
  };

  return (
    <Fragment>
      <Header logged={true} logout={logout}/>
      <UserHeader {...props}/>
      <div className="paddinger">
        <ItemList {...props}/>
      </div>
    </Fragment>
  );
};

export default FriendPage;