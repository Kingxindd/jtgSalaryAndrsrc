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

import { DP, PX} from '../Lib/ScreenUtil';
import {fontSizeNormal} from './commondef';
export default class Ta1 extends Component
{
    static defaultProps = {
    name: '',
    details: 'this is details...',
    allHeight: 70,
    };
    render()
    {
        return(
                <View 
                    style = {{height: DP(this.props.allHeight), width:  DP(350),
                            }}>
                    <View style = { {height:  DP(this.props.allHeight),width:  DP(320), marginLeft:  DP(10),
                        flexDirection: 'row', justifyContent: 'flex-start',
                        alignSelf:'center',
                        borderBottomColor:'#D2D2D2', borderBottomWidth:  DP(1)}}>
                        <Text style = {[{paddingTop:  DP(this.props.allHeight * 0.36), width:  DP(80), fontSize: fontSizeNormal}]}>{this.props.name}:</Text>
                        <View
                            style = {{height:  DP(this.props.allHeight * 0.71), width:  DP(1),marginTop:  DP(this.props.allHeight * 0.14),
                                    borderRightWidth:  DP(1), borderRightColor: '#D2D2D2'}}> 
                        </View>
                        <Text style = {{paddingTop:  DP(this.props.allHeight * 0.36),paddingLeft:  DP(5), fontSize: fontSizeNormal}}>{this.props.details}</Text>
                    </View>
                    
                </View>

        );
    }
}