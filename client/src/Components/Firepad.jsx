import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';


class Firepad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: this.props.roomId,
      refId: this.props.refId,
      code: ""
    };
  }

  componentDidMount() {
    const config = {
      apiKey: '',
      authDomain: 'athesio-66b77.firebaseapp.com',
      databaseURL: 'https://athesio-66b77.firebaseio.com'
    };
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(config);
    }
    let firepadRef = firebase.database().ref(this.state.refId);
    // create Ace editor and config
    let editor = ace.edit('firepad-container');
    editor.setTheme('ace/theme/tomorrow_night');
    editor.$blockScrolling = 1;

    let session = editor.getSession();
    session.setUseWrapMode(true);
    session.setUseWorker(false);
    session.setTabSize(2);
    session.setMode('ace/mode/javascript');

    let firepad = window.Firepad.fromACE(firepadRef, editor, {
      defaultText: 'console.log("hello world");'
    });

    firepad.on('synced', () => {
      this.setState({code: firepad.getText()});
      //console.log(firepad.getText());
    });
  }

  render() {
    return (
      <div>
        <div id='firepad-container'>
        </div>
        <div className="row" >
        <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" id='runBtn' >
          <Button type="button" onClick={() => this.props.toggleGistModal(this.state.code)} > Create Gist </Button>
          <Button type="button" onClick={this.props.handleSaveClick}>Save Code</Button> 
        </div>
          <Button type="button" color="success"
            onClick={() => {
              axios.post('/api/run-code', { data: this.state.code })
                .then((response) => {
                  console.log(response);
                  console.log(typeof response);
                  this.props.runCode(response.data);
                }
              )}
            }>Run</Button>
      </div>
      </div>
    );
  }

};

export default Firepad;
