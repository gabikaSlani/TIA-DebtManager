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
    let url = 'http://localhost:9000/home/' + sessionStorage.getItem('logged');
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
    let url = 'http://localhost:9000/home/total/' + sessionStorage.getItem('logged');
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
    let url = 'http://localhost:9000/home/friends/' + sessionStorage.getItem('logged');
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
    let url = 'http://localhost:9000/home/notifications/' + sessionStorage.getItem('logged');
    fetch(url)
      .then(res => res.json())
      .then(res => {

        this.setState({user: {...this.state.user, notifications: res}});
        console.log(this.state.user.notifications);
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