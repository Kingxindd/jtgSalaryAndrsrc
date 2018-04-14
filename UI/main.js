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
  NavigationActions 
} from 'react-navigation';
import JPushModule from 'jpush-react-native';

const s_w = Dimensions.get('window').width;
const s_h = Dimensions.get('window').height;

import MainHeader from './Coms/mainHeader';
import { DP, PX} from './Lib/ScreenUtil';
import TouchableButton from './Coms/TouchableButton';
import {gServerAddr, postForm,gUserToken, fontSizeNormal} from './Coms/commondef';
class Main extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
           ID: "",
           avatar: '123',
           hasLoadAvatar: false,
           OpCode: "",
        };
        
    };
    async componentWillMount()
    {
        console.log('rn: main will mount');
        BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid); 
         // 读取
          // 读取
        let id = '';
        let loadedAvatar = false;
        try{
            let data = await storage.load({
                key: gUserToken,
                autoSync: false,
                syncInBackground: false,
            });
            if(data.ID){
                this.setState({ID: data.ID});
                id = data.ID;
            }
            if(data.OpCode){
                this.setState({OpCode: data.OpCode});
            }
            
        }catch(e){
             console.log('personal Profile发生错误' + e);
        };  
       // console.log("main" + this.state.OpCode);
        // //如果OpCode不为空，则设置Jpush的alias
        // if(this.state.OpCode !== ""){
        //     JPushModule.setAlias(this.state.OpCode, () => {
        //         console.log("Set alias succeed");
        //     }, () => {
        //         console.log("Set alias failed");
        //     });
        // }
        //用ID去查询图片
        let url = gServerAddr + "GetHeadPortraitHandler.ashx";
        let cond = "userID=" +  id;
        //cond = cond + "&&avatar=" + this.state.avatar.uri;
        await postForm(url, cond, data=>{
            //console.log(JSON.stringify(data));
            if(data.Column_头像){
                let uuu = data.Column_头像.replace(/(%25)/g, "%");
                uuu = uuu.replace(/(%26)/g, "&");  
                uuu = uuu.replace(/(%2B)/g, "+");


                this.setState({avatar: uuu});
                this.setState({hasLoadAvatar: true});
                //console.log("update 头像");
                //console.log("avatar:" + this.state.avatar);
                //console.log(typeof(this.state.avatar));
            }
        });
        
    };
    componentDidMount() {
        //console.log("did monunt");
        //console.log(this.state.avatar);
        //console.log('rn: main did mount');
        // JPushModule.getInfo((map) => {
		// 	this.setState({
		// 		appkey: map.myAppKey,
		// 		imei: map.myImei,
		// 		package: map.myPackageName,
		// 		deviceId: map.myDeviceId,
		// 		version: map.myVersion
		// 	});
		// });
		// JPushModule.notifyJSDidLoad((resultCode) => {
		// 	if (resultCode === 0) {
		// 	}
		// });
		// JPushModule.addReceiveCustomMsgListener((map) => {
		// 	this.setState({
		// 		pushMsg: map.message
		// 	});
		// 	console.log("rn: extras: " + map.extras);
		// });
		// JPushModule.addReceiveNotificationListener((map) => {
		// 	console.log("rn: alertContent: " + map.alertContent);
		// 	console.log("rn: extras: " + map.extras);
		// 	// var extra = JSON.parse(map.extras);
		// 	// console.log(extra.key + ": " + extra.value);
		// });
		// JPushModule.addReceiveOpenNotificationListener((map) => {
		// 	console.log("rn: Opening notification!");
		// 	console.log("rn: map.extra: " + map.extras);
		// 	JPushModule.jumpToPushActivity("SecondActivity");
		// });
		// JPushModule.addGetRegistrationIdListener((registrationId) => {
		// 	console.log("rn: Device register succeed, registrationId " + registrationId);
        // });

    };
    componentWillUnmount()
    {
        //console.log('rn: main will unmount');
        BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);  
        // JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
		// JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
		// JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
		// JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
		// console.log("Will clear all notifications");
        // JPushModule.clearAllNotifications();

    };
    onBackAndroid = () => {
        BackHandler.exitApp();
        return true;
    };
    render()
    {
        
        return(
        <Image source={require('./images/bkg.png')} style = {st.container}>
            <View style = {st.top}>
                
            </View>
             
            <View style = {st.mid}>
            {
                this.state.hasLoadAvatar ?(
                <Image source = {{uri: this.state.avatar}} 
                style = {{width: DP(120),height: DP(120),borderRadius: DP(60)}}/>
                ):(
                    <Image source = {require('./images/avatar.png')} 
                style = {{width: DP(120),height: DP(120),borderRadius: DP(60)}}/>
            )}
                
            </View>

            <View style = {st.btm}>
                <View style = {st.btm_btn}>
                <TouchableNativeFeedback onPress = {()=>{
                    Alert.alert('提示', '请选择工资类型',
                    [
                        {text: '已签收工资', onPress : ()=>this.props.navigation.navigate('Checked')},
                        {text: '未签收工资', onPress : ()=>this.props.navigation.navigate('Uncheck')},
                    ],
                { cancelable: true });
                }}>
                    <Image source = {require('./images/gongzi.png')} 
                    style = {{height:DP(30), width:DP( 325), 
                    resizeMode:Image.resizeMode.contain,}}></Image>
                </TouchableNativeFeedback>
                    
                </View>
                    
                <View style = {st.btm_btn}>
                <TouchableNativeFeedback onPress = {()=>{
                    this.props.navigation.navigate('NotifyPage');
                }}>
                    <Image source = {require('./images/tongzhi.png')} 
                    style = {{height:DP(30), width:DP( 325), 
                    resizeMode:Image.resizeMode.contain,}}></Image>
                </TouchableNativeFeedback>
                </View>

                <View style = {st.btm_btn}>
                <TouchableNativeFeedback onPress = {()=>{
                    this.props.navigation.navigate('PersonalProfile');
                }}>
                    <Image source = {require('./images/shezhi.png')} 
                    style = {{height:DP(30), width:DP( 325), 
                    resizeMode:Image.resizeMode.contain,}}></Image>
                </TouchableNativeFeedback>
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
        backgroundColor: '#F7F7F7',
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
    },
    mid:{
        flex: 2.5,
        marginTop: DP(30),
        justifyContent: 'center',
    },
    btm:{
        flex: 6.5,
        paddingTop: DP(0),
        flexDirection:'column',
    },
    boldtxt:{
        fontWeight: 'bold',
    },
    btm_btn:{
        marginTop: DP(60),
        marginLeft: DP(10)
    },
});

export default Main;