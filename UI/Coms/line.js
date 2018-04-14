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
  TouchableOpacity
} from 'react-native';

const w_w = Dimensions.get('window').width;


class SpecLine extends Component
{
    static defaultProps = {
      width: w_w,
      height: 1,
      color: 'red'
    };
    render(){
      return(
        <View style = {{width: this.props.width, height: this.props.height,  backgroundColor: this.props.color}}></View>
      );
    }
}

export default SpecLine;