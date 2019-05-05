import React, {Component} from 'react';
import './mainComponents.css';
import NotLogged from "./Friend";
import LoadingPage from "./LoadingPage";
import NotFound from "./NotFound";
import FriendPage from "../friendPage/FriendPage";

class Group extends Component {

  groupId = parseInt(this.props.match.params.groupId);
  userId = this.props.match.params.userId;
  logged = (this.userId === sessionStorage.getItem('logged'));

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      group: null,
      items: [],
      debt: null,
      loading: true,
      isInGroup : true
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
        if(this.isInGroup()){
          this.fetchGroupInfo();
        }
        else{
          this.setState({isInGroup: false});
          this.setState({loading: false})
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchGroupInfo = () => {
    let url = '/api/group/' + this.groupId;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({group: res[0]});
        this.fetchMembers();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };


  fetchMembers = () => {
    let url = '/api/group/members/' + this.groupId;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({group: {...this.state.group, members: res}});
        this.fetchItems();
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error/'+err.message)
      });
  };

  fetchItems = () => {
    let url = '/api/group/items/' + this.userId + '/' + this.groupId;
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


  isInGroup = () => {
    const inGroup = (this.state.user.groups.filter(group => {
      return parseInt(group.id) === this.groupId
    })).length > 0;
    return inGroup;
  };

  getGroupFromUrl = () => {
    const group = this.state.user.groups.filter(group => {
      return parseInt(group.id) === this.groupId
    })[0];
    return group;
  };

  setDebt = () => {
    const group = this.getGroupFromUrl();
    this.setState({debt: group.debt});
  };

  render() {
    const {loading, group, debt, items, isInGroup, user } = this.state;
    return (
      <React.Fragment>
        {!this.logged
          ? <NotLogged {...this.props}/>
          : (loading
              ? <LoadingPage/>
              : (!isInGroup
                  ? <NotFound message={'Url is wrong. Cannot find group.'}/>
                  :
                  <div className="main-component">
                    <FriendPage user={user} group={group} debt={debt} items={items}
                                fgReload={this.fgReload} {...this.props}/>
                  </div>
              )
          )
        }
      </React.Fragment>
    );
  };
}

export default Group;