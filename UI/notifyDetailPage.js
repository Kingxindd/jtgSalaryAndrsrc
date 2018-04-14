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
  ListView,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

const s_w = Dimensions.get('window').width;
const s_h = Dimensions.get('window').height;

import MainHeaderWithBack from './Coms/mainHeaderWithBack';

import TouchableButton from './Coms/TouchableButton';
import { DP, PX} from './Lib/ScreenUtil';
let rowHeiht = 60;
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
                    paddingLeft: DP(20), paddingRight: DP(20),height: DP(rowHeiht), alignItems: 'center',
                    borderBottomWidth: DP(1), borderBottomColor: '#C4C4C4'}}>
                        <Text style = {{fontWeight: 'bold', fontSize: fontSizeNormal}}>{this.props.name}: </Text>
                        <Text style = {{fontSize: fontSizeNormal}}>{this.props.value}</Text>
                    </View>
        );
    }
}

class NotifyDetailPage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            NoticeTitle: '',
            NoticePerson: 'person',
            CreatedTime: '',
            NoticeBody: '',
        }
    };
    async componentWillMount()
    {
        BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
        const {state} = this.props.navigation;
        let noticeID = state.params.noticeID;
        let userID = state.params.userID;
        let name = state.params.name;
        let url = gServerAddr + 'GetUserNoticeDetailHandler.ashx';
        let cond = 'userID=' + userID + '&&noticeID=' + noticeID;
        console.log('notify details page will mount');
        console.log(url);
        console.log(cond);
        this.setState({NoticePerson: name});
        postForm(url, cond, (data)=>{
            if(data.NoticeTitle && data.NoticeBody && data.CreatedTime){
                this.setState({NoticeTitle: data.NoticeTitle});
                this.setState({NoticeBody: data.NoticeBody});
                this.setState({CreatedTime: data.CreatedTime});
                
            }else{
                console.warn('detail page fetch 失败');
            }
        });
    };
    componentWillUnmount()
    {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
    };
    onBackAndroid = () => {
        this.props.navigation.navigate('NotifyPage');
        return true;
       // return false;
    };

    render()
    {
        return(<Image source={require('./images/bkg.png')} style = {st.container}>
            <View style = {st.top}>
                <MainHeaderWithBack  navi = {this.props.navigation}></MainHeaderWithBack>
            </View>

            <View style = {st.body}>
                <View style = {st.bodyContent}>
                    <TextValue style = {st.marginTop3} name = '通知人' value =  {this.state.NoticePerson}></TextValue>
                    <TextValue style = {st.marginTop3} name = '通知标题' value = {this.state.NoticeTitle}></TextValue>
                    <TextValue style = {st.marginTop3} name = '通知时间' value = {this.state.CreatedTime}></TextValue>
                    
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white',
                                        paddingLeft: DP(20), paddingRight: DP(20),height: DP(rowHeiht * 4), alignItems: 'flex-start',
                                        paddingTop: DP(20)}}>
                                            <Text style = {{fontWeight: 'bold', fontSize: fontSizeNormal}}>通知内容: </Text>
                                            <Image source = {require('./images/notifyDetail.png')} 
                                                style = {{width: DP(240), height: DP(144)}}>
                                                <Text style = {{lineHeight: DP(28), padding:DP(10), fontSize: fontSizeNormal}}>{this.state.NoticeBody}</Text>
                                            </Image>


            
                                        </View>

                </View>
            </View>

            <View style = {st.bottom}>
                
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
    body:
    {
        flex: 8,
        width: s_w,
        marginTop: DP(20),
        opacity: 0.8
    },
    bodyContent:{
        marginLeft:DP(20),
        marginRight: DP(20),
        flexDirection: 'column',
        //backgroundColor: 'white',
        height: DP(rowHeiht * (7 + 1)),
        //opacity: 0.8
    },
    marginTop3:
    {
        marginTop: DP(5),
    },
    bottom:
    {
        flex: 1,
        width: s_w,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        marginRight:DP( 40),
    }
});


export default NotifyDetailPage;