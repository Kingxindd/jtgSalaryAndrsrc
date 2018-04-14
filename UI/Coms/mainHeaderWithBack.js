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
  BackAndroid,
  BackHandler,
  TouchableNativeFeedback
} from 'react-native';

import {
  StackNavigator,
  NavigationActions
} from 'react-navigation';

import { DP, PX} from '../Lib/ScreenUtil';

const s_w = Dimensions.get('window').width;
const s_h = Dimensions.get('window').height;

const fontSizeSmall = 8;
const fontSizeLarge = 12;
import {gServerAddr, postForm,gUserToken,fontSizeNormal} from './commondef';
export const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
            NavigationActions.navigate({ routeName: 'Main'})
        ]});

class MainHeaderWithBack extends Component
{
    static defaultProps = {
        navi: null,
        back2main: null,
    };
    constructor(props)
    {
        super(props);
        this.state = 
        {
            OpCode: '',
            OpName: ''
        }
    };
    componentWillMount()
    {
        //console.log('main header will mount!');
        // 读取
        storage.load({
            key: gUserToken,
            
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false,
            
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
            syncInBackground: false,
        }).then(data => {
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 你只能在then这个方法内继续处理ret数据
            // 而不能在then以外处理
            // 也没有办法“变成”同步返回
            // 你也可以使用“看似”同步的async/await语法
            if(data.OpCode){
                this.setState({OpCode: data.OpCode});
            }
            if(data.OpName){
                this.setState({OpName: data.OpName});
            }
            //console.log('main header data:' + JSON.stringify(data));
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            // switch (err.name) {
            //     case 'NotFoundError':
            //         // TODO;
            //         break;
            //     case 'ExpiredError':
            //         // TODO
            //         break;
            // }
        });
    };
    render(){
        return(
            <View style={st.top}>
                <View style = {st.top_left}>
                <TouchableNativeFeedback onPress = {()=>{
                    if(this.props.back2main && this.props.navi){
                       this.props.navi.dispatch(resetAction)
                    }else if (this.props.navi) {
                        this.props.navi.goBack();
                        //this.props.navi.dispatch(resetAction)
                    }
                    } }>
                        <Image source={require('../images/back2.png')} style = {{width: DP(50), height: DP(50), resizeMode:Image.resizeMode.cover}} />
                </TouchableNativeFeedback>
                    

                </View>


                <View style={st.top_right}>
                    

                </View>

            </View>
        );
    }
}

const st =  StyleSheet.create({
    top:{
        flex: 1,
        flexDirection: 'row',
        width: s_w,
        height: DP(50),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        //backgroundColor: '#F7F7F7'
    },
    top_left:{
        flex: 1,
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: s_w / 2,
        height: DP(50),
        paddingLeft: DP(20)
    },
    top_right:{
        flex: 1,
        //backgroundColor:'#979797',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});

export default MainHeaderWithBack;