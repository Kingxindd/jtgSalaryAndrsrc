


import Swipeout from './Swipout';


import React, {Component} from 'react';
import {AppRegistry, StyleSheet, ListView, Text, Image,View, TouchableWithoutFeedback} from 'react-native';
var btnsDefault = [ { text: 'Button' } ];

var btnsTypes = [
  { text: 'Primary',    type: 'primary',   },
  { text: 'Secondary',  type: 'secondary', },
  { text: 'Delete',     type: 'delete',    }
];

var rows = [
  {
    text: "Basic Example",
    right: btnsDefault,
  }, {
    text: "onPress Callback",
    right: [
      {
        text: 'Press Me',
        onPress: function(){ alert('button pressed') },
        type: 'primary',
      }
    ],
  }, {
    text: "Button Types",
    right: btnsTypes,
  }, {
    text: "Button with custom styling",
    right: [
      {
        text: 'Button',
        backgroundColor: '#4fba8a',
        color: '#17807a',
        underlayColor: "#006fff",
      }
    ],
  },
  {
    text: "Overswipe background color (drag me far)",
    right: btnsDefault,
    backgroundColor: '#006fff',
  }, {
    text: "Swipeout autoClose={true}",
    right: btnsDefault,
    autoClose: true,
  }, {
    text: "Five buttons (full-width) + autoClose={true}",
    right: [
      { text: 'One'},
      { text: 'Two'},
      { text: 'Three' },
      { text: 'Four' },
      { text: 'Five' }
    ],
    autoClose: true,
  }, {
    text: "Custom button component",
    right: [
      {
        component: <Image style={{flex: 1}} source={{uri: 'http://facebook.github.io/react/img/logo_og.png'}} />
      }
    ],
  }, {
    text: "Swipe me right (buttons on left side)",
    left: btnsDefault,
  }, {
    text: "Buttons on both sides",
    left: btnsTypes,
    right: btnsTypes,
  },
];
//  example swipout app
class SwipeoutExample extends Component {

  constructor() {
    super();

    //  datasource rerendered when change is made (used to set swipeout to active)
    var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});

    this.state = {
      dataSource: ds.cloneWithRows(rows),
      sectionID: null,
      rowID: null,
    };
  }

  _renderRow(rowData: string, sectionID: number, rowID: number) {
    return (
      <Swipeout
        close={!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
        left={rowData.left}
        right={rowData.right}
        rowID={rowID}
        sectionID={sectionID}
        autoClose={rowData.autoClose}
        backgroundColor={rowData.backgroundColor}
        onOpen={(sectionID, rowID) => {
          this.setState({
            sectionID,
            rowID,
          })
        }}
        onClose={() => console.log('===close') }
        scroll={event => console.log('scroll event') }
      >
        <TouchableWithoutFeedback onPress={() => console.log('press children')}>
          <View style={styles.li} >
            <Text style={styles.liText}>{rowData.text}</Text>
          </View>
        </TouchableWithoutFeedback>
      </Swipeout>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusbar}/>
        <View style={styles.navbar}><Text style={styles.navbarTitle}>Swipeout</Text></View>
        <ListView
          scrollEnabled
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          style={styles.listview}
        />
      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
  },
  navbarTitle: {
    color: '#444',
    fontSize: 16,
    fontWeight: "500",
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  }
});

export default SwipeoutExample;
