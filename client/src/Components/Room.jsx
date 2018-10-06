import React from 'react';
import EditorHolder from './EditorHolder.jsx';
import UserNav from './UserNav.jsx';
import GithubNav from './DashGithubNav.jsx';
import ChatNav from './ChatNav.jsx';
import otherUsers from '../../fakeOtherUsers.js';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedTab: '',
      tabs: ['GitHub', 'Comm'],
      roomId: window.location.pathname.split('/')[2],
      user: {},
      loading: true,
      refId: null
    }

    this.closeRightNav = this.closeRightNav.bind(this);
    this.openRightNav = this.openRightNav.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    axios.post('/api/enterroom', { roomId: this.state.roomId })
      .then(data => {
        axios.get('/api/retrieveRoomInfo', { params: { roomId: this.state.roomId } })
          .then(({ data }) => {
            this.setState({
              refId: data.roomInfo.ref,
              loading: false,
              user: data.currentUser
            })
          });
      });
  }

  logout() {
    axios.post('/api/logout', { roomId: this.state.roomId, user: this.state.user })
      .then(result => window.location.assign('/'));
  }

  openRightNav(e) {
    let tab = e.target.className.split("Span")[0];
    if (tab === 'github') {
      this.setState({ clickedTab: 'github' });
    } else {
      this.setState({ clickedTab: 'chat' });
    }
    document.getElementById("rightNav").style.width = "30%";
    document.getElementById("Editor").style.marginRight = "30%";
  }

  closeRightNav() {
    document.getElementById("rightNav").style.width = "0";
    document.getElementById("Editor").style.marginRight = "0";
  }


  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    } else {
      if (localStorage.getItem('authenticated')) {
        return (
          <div className="wrapper">
            {/* USER NAVIGATION BAR */}

            <nav id="userNav" className="sidenav">
              <UserNav user={this.state.user} logout={this.logout} />
            </nav>


            {/* MIDDLE SECTION OF DASHBOARD */}
            <div id="Editor" >
              <div className="row" >
                <div id="iconBar" >
                  <div className="text-center" >
                    <span className="userSpan text-center" style={{ padding: '2px' }} >&#9776;</span>
                  </div>
                </div>

                <div className="col-xs-11 col-md-11 col-lg-11" id="main" >
                  {/* NAME OF THE APPLICATION */}
                  <div className="row" >

                    <div className="col-xs-12 col-md-12 col-lg-12" style={{ padding: '0px' }} >
                      <p className="text-center" >
                        <a style={{ fontSize: '40px', color: '#ffffff' }} >ATHESIO</a>
                        <a >Share room: {this.state.roomId}</a>
                      </p>
                    </div>
                  </div>

                  {/* SHOWS USERS IN THE SESSION */}
                  <div className="row">
                    <div className="col-xs-11 col-md-11" id="userDiv" >
                      {otherUsers.map((user, i) => {
                        return (
                          <a key={i} style={{ color: '#f1f1f1', padding: '10px', fontSize: '12px', float: 'right' }} className="joinedUsers" >
                            {/* <img className="img-circle text-right" id="userImg" src={user.img} /> {user.username} */}
                          </a>
                        )
                      })
                      }
                    </div>
                  </div>

                  {/* HOLDS BOTH THE FIREPAD AND THE IFRAME */}
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ paddingLeft: '0px' }} >
                    <EditorHolder roomId={this.state.roomId} refId={this.state.refId} />
                  </div>


                  {/* <span className="githubSpan" name="Github" onClick={this.openRightNav}>GitHub</span>
            <span className="chatSpan" name="Chat" onClick={this.openRightNav}>Slack</span>
            <span className="chatSpan" name="Testing" onClick={this.openRightNav} style={{ top: '100px', right: '15px' }} >Testing</span>
            <span className="chatSpan" name="Tasks" onClick={this.openRightNav} style={{ top: '140px', right: '15px' }} >Tasks</span> */}
                </div>
              </div>
            </div>

            {/* RIGHT NAVIGATION BAR */}
            <nav id="rightNav" className="rightNav">
              {this.state.clickedTab === 'github' ? <GithubNav close={this.closeRightNav} /> : ('')}

              {this.state.clickedTab === 'chat' ? <ChatNav close={this.closeRightNav} /> : ('')}
            </nav>
          </div>
        )
      } else {
        return (<Redirect to='/login' />)
      }
    }
  }
}

export default Room;
