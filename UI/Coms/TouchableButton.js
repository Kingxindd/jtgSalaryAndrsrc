import React from 'react';
import {
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
} from 'react-native';

import { DP, PX} from '../Lib/ScreenUtil';
import {fontSizeNormal} from '../Coms/commondef';
export default class TouchableButton extends React.Component {
    static defaultProps = {
        name: 'Button',
        bgc: '#395DA6',
        buttonStyle : {},
        textColor: 'white',
        onPressButton: null,
    };
    constructor(props)
    {
        super(props);
        this.state = {
            pressed: false,
        };
    }

    render() {
        return (
            <TouchableOpacity onPress= {this.props.onPressButton}
            style={[styles.button, {borderColor: this.props.bgc}, this.props.buttonStyle,
                {backgroundColor:this.props.bgc} ]}
            onHideUnderlay={()=>{this.setState({pressed: false})}}
            onShowUnderlay={()=>{this.setState({pressed: true})}}
            underlayColor = {this.props.bgc}>
            <Text style = {{textAlign: 'center' ,textAlignVertical: 'bottom', color: this.props.textColor, fontSize:fontSizeNormal}}>{this.props.name}</Text>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    button: {
        borderWidth: DP(1),
        borderRadius: DP(3),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
});