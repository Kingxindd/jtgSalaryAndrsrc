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
  TouchableNativeFeedback,
  ScrollView
} from 'react-native';


import {
  StackNavigator,
  NavigationActions
} from 'react-navigation';

const s_w = Dimensions.get('window').width;
const s_h = Dimensions.get('window').height;

import MainHeaderWithBack, {resetAction} from './Coms/mainHeaderWithBack';


import TouchableButton from './Coms/TouchableButton';
import { DP, PX} from './Lib/ScreenUtil';
let rowHeiht = 60;
import {gServerAddr, postForm,gUserToken, fontSizeNormal} from './Coms/commondef';

import ImagePicker from 'react-native-image-crop-picker';

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
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', 
                    paddingLeft: DP(20), paddingRight: DP(20),height: DP(rowHeiht), alignItems: 'center',
                    borderBottomWidth: DP(1), borderBottomColor: '#C4C4C4'}}>
                        <Text style = {{fontSize: fontSizeNormal}}>{this.props.name}: </Text>
                        <Text style = {{fontSize: fontSizeNormal}}>{this.props.value}</Text>
                    </View>
        );
    }
}


class PersonalProfile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            ID: '',
            OpCode: '',
            OpName: '',
            PhoneNum: '',
            gjjClass: '',
            gjjAccount: '',
            gjjAddiAccount: '',
            avatar:'',
            avatarStream: '',
        }
    };
    async componentWillMount()
    {
        BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
        // 读取
        try{
            let data = await storage.load({
                key: gUserToken,
                autoSync: false,
                syncInBackground: false,
            });
            if(data.ID){
                this.setState({ID: data.ID});
            }
            if(data.PhoneNum){
                this.setState({PhoneNum: data.PhoneNum});
            }
            console.log('notifyPage data:' + JSON.stringify(data));
        }catch(e){
             console.log('personal Profile发生错误' + e);
        };  

        //由ID和OrganID查询通知
        let url = gServerAddr + 'GetUserProfileHandler.ashx';
        let cond = 'userID=' + this.state.ID;
        postForm(url, cond, (ret)=>{
            console.log(JSON.stringify(ret));
            if(ret.OpCode){
                this.setState({OpCode: ret.OpCode});
            }
            if(ret.OpName){
                this.setState({OpName: ret.OpName});
            }
            if(ret.公积金分类){
                this.setState({gjjClass: ret.公积金分类});
            }
            if(ret.公积金账号){
                this.setState({gjjAccount: ret.公积金账号});
            }
            if(ret.补充公积金账号){
                this.setState({gjjAddiAccount: ret.补充公积金账号});
            }

            // }
        });
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
    async uploadAvatar(){
        await ImagePicker.openPicker({
            width: 120,
            height: 120,
            cropping: true,
            multiple: false,
            cropperCircleOverlay: true,
            compressImageMaxWidth: 120,
            compressImageMaxHeight: 120,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeBase64: true,
            }).then(image => {
                console.log('received image', image);
                this.setState({
                    avatar: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
                });
                console.log(image.path);
                console.log(image.width);
                console.log(image.height);
                console.log(image.mime);
                console.log(image.size);
                //console.log(image.data);

            }).catch(e => {
                console.log(e);
                //Alert.alert(e.message ? e.message : e);
        });

        //发送
        console.log("准备发送");
        let url = gServerAddr + "UpdateHeadPortraitHandler.ashx";
        let uuu = this.state.avatar.uri.replace(/%/g, "%25");
        uuu = uuu.replace(/\&/g, "%26");  
        uuu = uuu.replace(/\+/g, "%2B"); 
        let cond = "userID=" + this.state.ID + "&&HeadPortrait=" + uuu;
        console.log(cond);
        await postForm(url, cond, data=>{
            console.log(JSON.stringify(data));
            if(data.Result == "True"){
                Alert.alert("头像上传成功！")
            }
            else{
                Alert.alert('头像上传失败！');
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
                <Text style = {[{color: '#6F88C0', marginRight: DP(20),fontSize: fontSizeNormal}]}>个人资料</Text>
                <View style = {{width: DP(1), height:DP(18), backgroundColor: '#C4C4C4', marginRight: DP(20)}}></View>
                <TouchableNativeFeedback onPress = {()=>{
                    this.props.navigation.navigate('ChangeCellphone');
                }}><Text style = {{fontSize: fontSizeNormal}}>绑定手机更换</Text></TouchableNativeFeedback>
            </View>

            <View style = {st.body}>
            <ScrollView showsVerticalScrollIndicator = {false}>
                <View style = {st.bodyContent}>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between',
                    paddingLeft: DP(20), paddingRight: DP(20),height:DP( rowHeiht),alignItems: 'center',
                    borderBottomWidth: DP(1), borderBottomColor: '#C4C4C4'}}>
                        <Text style = {{paddingTop: 5, fontSize:fontSizeNormal}}>设置头像: </Text>
                        <TouchableButton name = '上传图片' buttonStyle = {{width: DP(80), height:DP( rowHeiht / 2)}}
                        onPressButton = {this.uploadAvatar.bind(this)}></TouchableButton>
                    </View>

                    <TextValue style = {st.marginTop3} name = '工号' value = {this.state.OpCode}></TextValue>
                    <TextValue style = {st.marginTop3} name = '姓名' value = {this.state.OpName}></TextValue>
                    <TextValue style = {st.marginTop3} name = '公积金分类' value = {this.state.gjjClass}></TextValue>
                    <TextValue style = {st.marginTop3} name = '公积金账号' value = {this.state.gjjAccount}></TextValue>
                    <TextValue style = {st.marginTop3} name = '补充公积金账号' value = {this.state.gjjAddiAccount}></TextValue>
                    <TextValue style = {st.marginTop3} name = '绑定手机' value = {this.state.PhoneNum}></TextValue>
                    
                
                </View>
                </ScrollView>
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
        height: DP(48.33),
        width: s_w,
    },
    bgcWhite:
    {
       // backgroundColor: 'white',
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
        marginLeft: DP(10),
        marginRight: DP(10),
        flex: 9,
        width: s_w,
        marginTop: DP(10),
        //backgroundColor: '#F7F7F7',
        
    },
    bodyContent:{
        marginLeft:DP(10),
        marginRight: DP(0),
        flexDirection: 'column',
       //backgroundColor: 'white',
        width: s_w - DP(20),
        height: DP(rowHeiht * (7 + 1)),
        borderRadius: 7,
    },
    marginTop3:
    {
        marginTop: DP(5),
    }
});

export default PersonalProfile;