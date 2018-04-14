import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  Alert,
  Dimensions,
  TouchableNativeFeedback
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';


import login from './Login';
import main from './main';
import uncheck from './uncheck';
import checked from './checked';
import details from './details';
import personalprofile from './personalProfile';
import changecellphone from './changeCellphone';
import notifypage from './notifyPage';
import notifydetail from './notifyDetailPage';


import swipoutex from './Coms/swipout/SwipeoutExample';

const App = StackNavigator(
{
    Login: {screen: login},
    Main: {screen: main},
    Uncheck: {screen: uncheck},
    Checked: {screen: checked},
    Details: {screen: details},
    PersonalProfile: {screen: personalprofile},
    ChangeCellphone:{screen: changecellphone},
    NotifyPage:{screen: notifypage},
    NotifyDetailPage: {screen: notifydetail},
    SwipoutEx: {screen: swipoutex},
}, 
{
    initialRouteName: 'Login', 
    navigationOptions:{
        header: null,
    },
});

export default App;
