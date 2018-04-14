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
  TouchableOpacity,
  PixelRatio,
  ScrollView,
  NativeModules,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import SpecLine from './Coms/line';
import TouchableButton from './Coms/TouchableButton';

import { DP, PX} from './Lib/ScreenUtil';

const w_w = Dimensions.get('window').width;

const fontSizeSmall = 12;
const fontSizeMid = 22;
const fontSizeLarge = 20;

const RCTDatePicker = NativeModules.DatePicker;
//for server
import {gServerAddr, postForm,gUserToken, fontSizeNormal} from './Coms/commondef';
//手机号查询用户名
//return 真实姓名和所有科
const addrPhonenumber2name = 'GetNameHandler.ashx';
//手机号获得验证码
//返回验证码
const addrPhonenumber2Certificate = 'GetPhoneCodeHandler.ashx';
import JPushModule from 'jpush-react-native';

class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            account: '',
            OpName: '',
            Password: '',
            ID: '',
            OrganID: '',
            PhoneNum: '',
            PhoneCode: '',
            inputPhoneCode: '',
            userID: '',
            needCerCode: false,
            password: '',
            hasQueryRegID: false,
            regID: ''
        };
    };


    async GetName()
    {
        console.log('GetName');
        let url = gServerAddr + 'GetNameHandler.ashx';
        let cond = 'PhoneNum=' + this.state.account;
        await postForm(url, cond, (data)=>{
            console.log(data);
            if(data.OpCode && data.OpName && data.OrganID && data.userID && data.PhoneNum && data.userID){
                this.setState({OpName: data.OpName});
                this.setState({OpCode: data.OpCode});
                this.setState({OrganID: data.OrganID});
                this.setState({ID: data.userID});
                this.setState({PhoneNum: data.PhoneNum.trim()});
                this.setState({userID: data.userID});
                //getname返回成功后，更新RegistrationID
                let url2 = gServerAddr + 'UpdateRegistrationIDHandler.ashx';
                let cond2 = 'UserID=' + data.userID + '&&RegistrationID=' + this.state.regID;
                console.log('查询RegID, COND: ' + cond2);

               postForm(url2, cond2, (data)=>{
                   console.log(JSON.stringify(data));
                   if(data.Result == 'True'){
                        console.log("reg res true");
                        this.setState({needCerCode: true});
                   }else{
                    console.log("reg res false");
                    this.setState({needCerCode: false});
                   }
               });
            }else{
                Alert.alert('手机号或工号输入有误！');
            }  
        }); 
    };

    async GetPhoneCode()
    {
        let url = gServerAddr + 'GetPhoneCodeHandler.ashx';
        let cond = "userID=" + this.state.userID +"&&PhoneNum=" + this.state.PhoneNum;
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
    }

    async LoginHandler()
    {
        let url = gServerAddr + 'LoginHandler.ashx';
        let cond = '';
        if(this.state.needCerCode){
            console.log("登录需要验证码");
            cond = 'UserID=' + this.state.userID + '&&Password=' + this.state.password + '&&PhoneCode=' + this.state.inputPhoneCode;
        }else{
            cond = 'UserID=' + this.state.userID + '&&Password=' + this.state.password;
        }

        //let cond = 'UserID=' + this.state.userID + '&&PhoneCode=' + this.state.inputPhoneCode;
        //let cond = 'UserID=' + this.state.userID + '&&Password=' + this.state.password;
        console.log('Login:' + cond);
        await postForm(url, cond, (data)=>{
            console.log(data);
            if(data.Result == 'False'){
                Alert.alert('登录失败！');
            }else{
                //serialize
                console.log('userID:' + this.state.userID);
                storage.save({
                    key: gUserToken,
                    data: {
                        ID: this.state.ID,
                        OrganID: this.state.OrganID,
                        OpCode: this.state.OpCode,
                        OpName: this.state.OpName,
                        PhoneNum: this.state.PhoneNum,
                        Password: this.state.Password,
                        userID: this.state.userID
                    },
                    // 如果不指定过期时间，则会使用defaultExpires参数
                    // 如果设为null，则永不过期
                    expires: null
                });
                //如果OpCode不为空，则设置Jpush的alias
                if (this.state.OpCode !== "") {
                    JPushModule.setAlias(this.state.OpCode, () => {
                        console.log("Set alias succeed");
                    }, () => {
                        console.log("Set alias failed");
                    });
                }
                this.props.navigation.navigate('Main', { ID: this.state.ID });
            }
        });
    }

    componentWillMount()
    {
        // storage.remove({
        //     key: gUserToken
        // });
        console.log('component will Mount');
        JPushModule.addGetRegistrationIdListener((registrationId) => {
            console.log("Device register succeed, registrationId " + registrationId);
            this.setState({regID: registrationId});
        });
        //let retID = JPushModule.getRegistrationID();
        //console.log("get regID:" + JPushModule.getRegistrationID());
        JPushModule.getRegistrationID((id)=>{
            console.log("get regid: " + id);
            this.setState({regID: id});
        });
    };
    componentDidMount() {
        console.log('componentDid Mount');
        JPushModule.addGetRegistrationIdListener((registrationId) => {
            console.log("Device register succeed, registrationId " + registrationId);
            this.setState({regID: registrationId});
        });
    };
    render()
    {
        let rowHeight = 60;
        return(
            
            <Image source={require('./images/bkg.png')} style = {[styles.bkg, styles.container]}>
            <ScrollView showsVerticalScrollIndicator = {false}>
                <View style = {[styles.alignCenter,styles.header]}>
                    <Image source={require('./images/logo.png')} style = {styles.logo} />
                    <Text style = {[styles.alignCenter, {fontSize: DP(fontSizeSmall)}]}>上海动车段</Text>
                    <Text style = {[styles.alignCenter, {fontSize: DP(fontSizeLarge)}]}>工资电子签收系统</Text>
                </View>

                <View style = {styles.body}>

                    <View style = { {height: DP(rowHeight),width: DP(370), 
                        flexDirection: 'row', justifyContent: 'flex-start',
                        alignSelf:'center', alignItems: 'center',
                        borderBottomColor:'#D2D2D2', borderBottomWidth: DP(1),}}>
                        <Text style = {[{width: DP(80), paddingLeft: DP(5), fontSize:fontSizeNormal}]}>账号</Text>
                        <View
                            style = {{height: DP(rowHeight * 0.61), width: DP(1),
                                    borderRightWidth: DP(1), borderRightColor: '#D2D2D2'}}> 
                        </View>
                        <TextInput placeholder = '手机号或工号' underlineColorAndroid = 'transparent'  value = {this.state.account}
                        style = {{paddingLeft: DP(10),width: DP(260), height: DP(rowHeight * 0.9), fontSize:fontSizeNormal}} onBlur = {this.GetName.bind(this)}
                        onChangeText = {(data)=>{this.setState({account: data});}}/>
                        <TouchableOpacity
                        onPress = {()=>
                        {
                            this.setState({account: '', OpName: '', password: ''});
                        }}>
                        <View style = {{width: DP(29),height: DP(rowHeight),  justifyContent: 'center'}}>
                            <Image source = {require('./images/cb.png')}  style = {{width: DP(13), height: DP(13), alignSelf:'center'}}/>
                        </View>
                                
                        </TouchableOpacity>
                    </View>
                     

                    <View style = { {height: DP(rowHeight),width: DP(370), 
                        flexDirection: 'row', justifyContent: 'flex-start',
                        alignSelf:'center', alignItems: 'center',
                        borderBottomColor:'#D2D2D2', borderBottomWidth: DP(1),}}>
                        <Text style = {[{width: DP(80), paddingLeft: DP(5), fontSize:fontSizeNormal}]}>姓名</Text>
                        <View
                            style = {{height: DP(rowHeight * 0.61), width: DP(1),
                                    borderRightWidth: DP(1), borderRightColor: '#D2D2D2'}}> 
                        </View>
                        <TextInput placeholder = '' underlineColorAndroid = 'transparent' editable = {false}
                        style = {{paddingLeft: DP(10),width: DP(260), height: DP(rowHeight * 0.9), fontSize:fontSizeNormal}} 
                        value = {this.state.OpName}/>
                        <TouchableOpacity >
                        <View style = {{width: DP(29),height: DP(rowHeight),  justifyContent: 'center'}}>
                            <Image source = {require('./images/cb.png')}  style = {{width: DP(13), height: DP(13), alignSelf:'center'}}/>
                        </View>
                                
                        </TouchableOpacity>
                    </View>

                
                    <View style = { {height: DP(rowHeight),width: DP(370), 
                        flexDirection: 'row', justifyContent: 'flex-start',
                        alignSelf:'center', alignItems: 'center',
                        borderBottomColor:'#D2D2D2', borderBottomWidth: DP(1),}}>
                        <Text style = {[{width: DP(80), paddingLeft: DP(5), fontSize:fontSizeNormal}]}>密码</Text>
                        <View
                            style = {{height: DP(rowHeight * 0.61), width: DP(1),
                                    borderRightWidth: DP(1), borderRightColor: '#D2D2D2'}}> 
                        </View>
                        <TextInput placeholder = '密码' underlineColorAndroid = 'transparent' value = {this.state.password} secureTextEntry={true}
                        style = {{paddingLeft: DP(10),width: DP(260), height: DP(rowHeight * 0.9), fontSize:fontSizeNormal}}
                        onChangeText = {(data)=>{this.setState({password: data});}}/>
                        <TouchableOpacity
                        onPress = {()=>
                        {
                            this.setState({password: '', OpName: '', account: ''});
                        }}>
                        <View style = {{width: DP(29),height: DP(rowHeight),  justifyContent: 'center'}}>
                            <Image source = {require('./images/cb.png')}  style = {{width: DP(13), height: DP(13), alignSelf:'center'}}/>
                        </View>
                                
                        </TouchableOpacity>
                    </View>


                    {this.state.needCerCode ? (
                        <View style = { {height: DP(rowHeight),width:DP( 370), 
                        flexDirection: 'row', justifyContent: 'flex-start',
                        alignSelf:'center', alignItems: 'center',
                        borderBottomColor:'#D2D2D2', borderBottomWidth: DP(1),}}>
                        <Text style = {[{width: DP(80), paddingLeft: DP(5), fontSize:fontSizeNormal}]}>验证码</Text>
                        <View
                            style = {{height: DP(rowHeight * 0.61), width: DP(1),
                                    borderRightWidth: DP(1), borderRightColor: '#D2D2D2'}}> 
                        </View>
                        <TextInput placeholder = '请输入验证码' underlineColorAndroid = 'transparent' 
                        editable = {true} value = {this.state.inputPhoneCode}
                        onChangeText = {(data)=>{this.setState({inputPhoneCode: data});}}
                        style = {{paddingLeft: DP(10),width: DP(210), height:DP( rowHeight * 0.9), fontSize:fontSizeNormal}} />
                        <TouchableButton name = '获 取' buttonStyle = {{width: DP(80), height: DP(35)}}
                         onPressButton = {this.GetPhoneCode.bind(this)}/>
                    </View>
                    ):(null)}

                    
                    
                    <View style = {{marginLeft: DP(10), marginRight: DP(10), marginTop: DP(30)}}>
                        <TouchableButton name = '登录' buttonStyle = {{height:DP(40), width:DP( 370), backgroundColor:"#395DA6"}}
                        onPressButton = { this.state.OpName != '' ? (this.LoginHandler.bind(this)) : (null)}
                        bgc = { this.state.OpName != '' ? ('#395DA6') : ('#696969')}
                             />

                    </View>
                </View>
            
            </ScrollView>
            </Image>
            
            
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    flexDirection: 'column',
    width: w_w,
  },
  bkg:{
    flex: 1,
    width:null,
    height:null,
    //不加这句，就是按照屏幕高度自适应
    //加上这几，就是按照屏幕自适应
    resizeMode:Image.resizeMode.cover,
    //祛除内部元素的白色背景
    backgroundColor:'rgba(0,0,0,0)',
  },
  logo:{
    width:  DP(180),
    height:  DP(145),
  },
  alignCenter:{
      alignItems: 'center',
      alignSelf: 'center',
  },
  header:{
    flex:1,
    marginTop:  DP(20),
  },
  body:{
    flex:2,
    marginTop:  DP(20),
  },
  cer:{
      flexDirection: 'row',
      justifyContent: 'flex-start',

  }



});

export default Login;