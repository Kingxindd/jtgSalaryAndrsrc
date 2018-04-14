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
  BackHandler,
  TouchableNativeFeedback
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

const s_w = Dimensions.get('window').width;
const s_h = Dimensions.get('window').height;

import MainHeaderWithBack, {resetAction} from './Coms/mainHeaderWithBack';

import TouchableButton from './Coms/TouchableButton';
let rowHeiht = 60;

import { DP, PX} from './Lib/ScreenUtil';
import {gServerAddr, postForm,gUserToken, fontSizeNormal} from './Coms/commondef';
class TextValue extends Component
{
    constructor(props)
    {
        super(props);
    };
    static defaultProps = {
        name : 'name',
        value : 'value',
    };
    render()
    {
        return(
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white',
                    paddingLeft: DP(20), paddingRight: DP(20),height:DP( rowHeiht), alignItems: 'center',
                    borderBottomWidth: DP(1), borderBottomColor: '#C4C4C4'}}>
                        <Text style = {{fontSize: fontSizeNormal}}>{this.props.name}: </Text>
                        <Text style = {{fontSize: fontSizeNormal}}>{this.props.value}</Text>
                    </View>
        );
    }
}






class ChangeCellphone extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            ID: '',
            PhoneNum: '',
            NewPhoneNum: '',
            CerCode:'',
        }
    };
    async componentWillMount()
    {
        BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
        // 读取
        try{
            let data = await storage.load({
                key: gUserToken,
            
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: false,
                
                // syncInBackground(默认为true)意味着如果数据过期，
                // 在调用sync方法的同时先返回已经过期的数据。
                // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
                syncInBackground: false,
            });
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 你只能在then这个方法内继续处理ret数据
            // 而不能在then以外处理
            // 也没有办法“变成”同步返回
            // 你也可以使用“看似”同步的async/await语法
            if(data.ID){
                this.setState({ID: data.ID});
            }
            if(data.PhoneNum){
                this.setState({PhoneNum: data.PhoneNum});
            }
        }catch(e){
             console.log('change cellphone num 发生错误' + e);
        };  
    };
    componentWillUnmount()
    {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
    };
    onBackAndroid = () => {
        //this.props.navigation.navigate('Main');
        this.props.navigation.dispatch(resetAction)
        return true;
    };
    ChangeNewPhoneNum()
    {
        //由ID和OrganID查询通知
        let url = gServerAddr + 'UpdatePhoneNumHandler.ashx';
        let cond = 'userID=' + this.state.ID + '&&PhoneNum=' + this.state.NewPhoneNum + '&&PhoneCode=' + this.state.CerCode;
        console.log('cond:' + cond);
        postForm(url, cond, (ret)=>{
            console.log(JSON.stringify(ret));
            if(ret.Result){
                if(ret.Result == 'True'){
                    Alert.alert('绑定新手机成功！请退出重新登录！');
                }else{
                    Alert.alert('绑定新手机失败');
                }

            }
            
         });
    };    
    async GetPhoneCode()
    {
        let url = gServerAddr + 'GetPhoneCodeHandler.ashx';
        //let cond = 'PhoneNum=' + this.state.NewPhoneNum;
        let cond = "userID=" + this.state.ID +"&&PhoneNum=" + this.state.NewPhoneNum;
        console.log(url);
        console.log(cond + ';');
        await postForm(url, cond, (data)=>{
            console.log(data);
            if(data.Result == "False"){
                Alert.alert('验证码获取失败！');
            }else{
                Alert.alert('验证码获取成功！');
            }
        });
    };

    render()
    {
        return(<Image source={require('./images/bkg.png')} style = {st.container}>
            <View style = {st.top}>
                <MainHeaderWithBack  navi = {this.props.navigation} back2main = {true}></MainHeaderWithBack>
            </View>

            <View style = {st.title}>
                <TouchableNativeFeedback onPress = {()=>{
                    this.props.navigation.navigate('PersonalProfile');
                }}><Text style = {{marginRight: DP(20), fontSize: fontSizeNormal}}>个人资料</Text></TouchableNativeFeedback>
                <View style = {{width: DP(1), height:DP(18), backgroundColor: '#C4C4C4', marginRight: DP(20)}}></View>
                <Text style = {{color: '#6F88C0' , fontSize: fontSizeNormal}}>绑定手机更换</Text>
                
            </View>

            <View style = {st.body}>
                <View style = {st.bodyContent}>
                    <View style = {{paddingLeft: DP(20), height: DP(rowHeiht), borderBottomColor: '#C4C4C4', borderBottomWidth: DP(1), justifyContent: 'center'}}>
                        <Text style = {{color: '#6F88C0', fontSize: fontSizeNormal}}>绑定手机更换</Text>
                    </View>
                    
                    <View style = {st.staticRow}>
                        <Text style = {st.staticText}>新手机号</Text>
                        <TextInput value = {this.state.NewPhoneNum} onChangeText = {(data)=>{this.setState({NewPhoneNum: data});}}
                        underlineColorAndroid="transparent" style = {{height: DP(40),width: DP(200), backgroundColor: '#D4D4D4', marginLeft: DP(10), marginRight: DP(10)}}></TextInput>
                        <TouchableButton name = '获取验证码' buttonStyle = {{height: DP(30), width: DP(90)}}
                        onPressButton = {this.GetPhoneCode.bind(this)}></TouchableButton>
                    </View>

                    <View style = {st.staticRow}>
                        <Text style = {st.staticText}>验证码</Text>
                        <TextInput value = {this.state.CerCode} onChangeText = {(data)=>{this.setState({CerCode:data});}}
                        underlineColorAndroid="transparent"  style = {{height: DP(40),width: DP(300), backgroundColor: '#D4D4D4', marginLeft: DP(10)}}></TextInput>
                    </View>

                    <View style = {{height: DP(rowHeiht), flexDirection: 'column', justifyContent: 'center', marginTop: DP(rowHeiht / 4)}}>
                        <TouchableButton name = '绑定' 
                        onPressButton = {this.state.CerCode != '' ? (this.ChangeNewPhoneNum.bind(this)) : (null)}
                        bgc = { this.state.CerCode  != '' &&this.state.NewPhoneNum != ''? ('#395DA6') : ('#696969')}
                        buttonStyle = {{height: DP(30), width: DP(90), marginLeft: DP(300)}}></TouchableButton>
                    </View>


                
                </View>
            </View>
             
        </Image>);
    }
}

const st =  StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#F7F7F7',
        width:null,
        height:null,
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        resizeMode:Image.resizeMode.cover,
        //祛除内部元素的白色背景
        backgroundColor:'rgba(0,0,0,0)',
    },
    top:{
        flex: 1,
        height: DP(48.33),
        width: s_w,
    },
    bgcWhite:
    {
        //backgroundColor: 'white',
        shadowColor: 'red',
    },
    title:
    {
        marginTop: DP(30),
        width: s_w - DP(20),
        height: DP(40),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: DP(10),
        paddingLeft: DP(20),
        //backgroundColor: 'white',
    },
    body:
    {
        flex: 9,
        width: s_w,
        marginTop: DP(10),
       // backgroundColor: '#F7F7F7',
    },
    bodyContent:{
        marginLeft:DP(10),
        marginRight: DP(10),
        flexDirection: 'column',
        //backgroundColor: 'white',
        height: DP(rowHeiht * (7 + 1)),
    },
    marginTop3:
    {
        marginTop: DP(5),
    },
    staticText:
    {
        width: DP(rowHeiht),
        fontSize: fontSizeNormal
    },
    staticRow:
    {
        borderBottomColor: '#C4C4C4', 
        borderBottomWidth: DP(1),
        height: DP(rowHeiht + 10),
        paddingLeft: DP(20), 
        marginTop: DP(5),
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
    },
    staticInput:
    {

    }
});

export default ChangeCellphone;