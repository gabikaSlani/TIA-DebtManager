import React, {Component} from "react";
import HomePage from "../homePage/HomePage";
import './mainComponents.css';
import LoginPage from "./LoadingPage";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true
    };
  }

  setUser = (user) => {
    this.setState({user: user});
  };

  componentDidMount() {
    this.fetchUserInfo();
  };

  reload = () => {
    this.setState({loading: true});
    this.fetchUserInfo();
  };

  fetchUserInfo = () => {
    let url = '/api/home/' + sessionStorage.getItem('logged');
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({user: {...this.state.user, info: res[0]}});
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
        this.fetchUserGroups();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchUserGroups = () => {
    let url = '/api/home/groups/' + sessionStorage.getItem('logged');
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({user: {...this.state.user, groups: res}});
        console.log(this.state.user.groups);
        this.setState({loading :false})
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  render() {
    const {user, loading} = this.state;
    return (
      <React.Fragment>
        {loading
          ? <LoginPage/>
          :
          <div className="main-component">
            <HomePage user={user} setUser={this.setUser} {...this.props} reload={this.reload}/>
          </div>
        }
      </React.Fragment>
    );
  }
}

export default Home;