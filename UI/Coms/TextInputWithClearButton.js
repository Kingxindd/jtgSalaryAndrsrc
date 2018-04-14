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
import ScreenUtil from './Lib/ScreenUtil'

export default class TextInputWithClearButtion extends Component
{
    constructor()
    {
        this.state = {
        textInput1Status: 'untouched',
        textInput1Value: '',
        };
    };
    renderClearButotn()
    {
        if (this.state.textInput1Status == 'touched') {
            return (
                
            );
        } else {
        return '';
        }
    };
    onTextInput1Change(text) {
        this.setState({
            textInput1Status: 'touched',
            textInput1Value: text
        });
    };
    render() {
        return (
            <View>
            <TextInput
                onChangeText={(text) => this.onTextInput1Change(text)}
                value={this.state.textInput1Value}
            />
            {this.state.textInput1Status == 'touched' ?
                <TouchableOpacity onPress={this.clearText()}>
                    <Image
                    style={styles.button}
                    source={require('../images/clearbtn.png')}
                    />
                </TouchableOpacity>
                : null
            }
            </View>
        );
    }
}