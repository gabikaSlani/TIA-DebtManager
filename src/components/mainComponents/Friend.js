import React, {Component} from 'react';
import FriendPage from "../friendPage/FriendPage";
import './mainComponents.css';
import LoadingPage from "./LoadingPage";
import NotLogged from "./NotLogged";
import NotFound from "./NotFound";

class Friend extends Component {

  friendId = parseInt(this.props.match.params.friendId);
  userId = this.props.match.params.userId;
  logged = (this.userId === sessionStorage.getItem('logged'));

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      friend: null,
      items: [],
      debt: null,
      loading: true,
      isFriend: true
    };
  }

  componentDidMount() {
    if (this.logged) {
      this.fetchUserInfo();
    }
  }

  fgReload = () => {
    this.setState({loading: true});
    this.fetchUserInfo();
  };

  fetchUserInfo = () => {
    let url = '/api/home/' + sessionStorage.getItem('logged');
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({user: {...this.state.user, info: res[0]}})
        this.fetchUserTotal();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchUserTotal = () => {
    let url = '/api/home/total/' + sessionStorage.getItem('logged');
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({user: {...this.state.user, total: res}});
        this.fetchUserFriends();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchUserFriends = () => {
    let url = '/api/home/friends/' + sessionStorage.getItem('logged');
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({user: {...this.state.user, friends: res}});
        if(this.isMyFriend()){
          this.fetchFriendInfo();
        }
        else{
          this.setState({isFriend: false});
          this.setState({loading: false})
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchFriendInfo = () => {
    let url = '/api/friend/' + this.friendId;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({friend: res[0]});
        this.fetchItems();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchItems = () => {
    let url = '/api/friend/items/' + this.userId + '/' + this.friendId;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({items: res});
        this.setDebt();
        this.fetchNotifications();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchNotifications = () => {
    let url = '/api/home/notifications/' + sessionStorage.getItem('logged');
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({user: {...this.state.user, notifications: res}});
        this.setState({loading: false})
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  isMyFriend = () => {
    const isFriend = (this.state.user.friends.filter(friend => {
      return friend.id === this.friendId
    })).length > 0;
    return isFriend;
  };

  getFriendFromUrl = () => {
    const friend = this.state.user.friends.filter(friend => {
      return friend.id === this.friendId
    })[0];
    return friend;
  };

  setDebt = () => {
    const friend = this.getFriendFromUrl();
    this.setState({debt: friend.debt})
  };

  render() {
    const {loading, user, friend, debt, items, isFriend} = this.state;
    return (
      <React.Fragment>
        {!this.logged
          ? <NotLogged {...this.props}/>
          : (loading
              ? <LoadingPage/>
              : (!isFriend
                  ? <NotFound message={'Url is wrong. Cannot find friend.'}/>
                  :
                  <div className="main-component">
                    <FriendPage user={user} friend={friend} debt={debt} items={items}
                                fgReload={this.fgReload} {...this.props}/>
                  </div>
              )
          )
        }
      </React.Fragment>
    );
  };
}

export default Friend;