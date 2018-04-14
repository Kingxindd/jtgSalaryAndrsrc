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
  ScrollView
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

const s_w = Dimensions.get('window').width;
const s_h = Dimensions.get('window').height;

import MainHeaderWithBack from './Coms/mainHeaderWithBack';

import TouchableButton from './Coms/TouchableButton';
//import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import SwipeListView from './Coms/SwipeListView';
import SwipeRow from './Coms/SwipeRow';
let rowHeiht = 60;
import { DP, PX} from './Lib/ScreenUtil';

import {gServerAddr, postForm,gUserToken, fontSizeNormal} from './Coms/commondef';

class NotifyPage extends Component
{
    constructor(props)
    {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = 
        {
            ID: '',
            OrganID: '',
            Table: '',
            listViewData: '',
            msg: 'empty',
            dataLoaded: false,
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
            if(data.OrganID){
                this.setState({OrganID: data.OrganID});
            }
            console.log('notifyPage data:' + JSON.stringify(data));
        }catch(e){
             console.log('check发生错误' + e);
        };  

        //由ID和OrganID查询通知
        let url = gServerAddr + 'GetUserNoticeHandler.ashx';
        let cond = 'userID=' + this.state.ID + '&&userOrganID=' + this.state.OrganID;
        postForm(url, cond, (ret)=>{
            console.log(JSON.stringify(ret));
            console.log(ret.Table);
            if(ret.Table){
                this.setState({Table: ret.Table});
                dataSource = new Array();
                for(var li in ret.Table){
                    dataSource[li] = ret.Table[li].NoticeBody;
                }
                this.setState({listViewData: dataSource});
                this.setState({dataLoaded: true});
            }else{
                console.log('没有从服务读取到通知信息');
            }
        });
    };
    componentWillUnmount()
    {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
    };
    onBackAndroid = () => {
        this.props.navigation.goBack();
        return true;
    };
    _deleteRow(secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].closeRow();
		const newData = [...this.state.listViewData];
		newData.splice(rowId, 1);
		this.setState({listViewData: newData});
    };
    _touchRow(secId, rowId, rowMap)
    {
        //Alert.alert('you have click the row id is:' + rowId);
        //let noticeID = this.state.Table[rowId].noticeID;
        console.log('on touch row: noticeID:' + rowId + 'userID:' + this.state.ID);

        let id = this.state.Table[parseInt(rowId)].ID;
        let name = this.state.Table[parseInt(rowId)].OpName;
        this.props.navigation.navigate('NotifyDetailPage' ,{noticeID:id, userID: this.state.ID, name: name});
    }
    render()
    {
        return(<Image source={require('./images/bkg.png')} style = {st.container}>
            <View style = {st.top}>
                <MainHeaderWithBack navi = {this.props.navigation}></MainHeaderWithBack>
            </View>

            <View style={st.title}>
                <View style={{ width: DP(80), height: DP(80), justifyContent: 'center', alignItems: 'center' }}>
                    
                </View>
                <Text style={{ color: 'white', fontSize: fontSizeNormal }}>我的信息</Text>
                <View style={{ width: DP(80), height: DP(80), justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Image source={require('./images/search.png')} style={{ width: DP(25), height: DP(25) }}></Image>
                </View>
            </View>

            <View style = {st.body}>
            <ScrollView showsVerticalScrollIndicator = {false}>
                <View style = {st.bodyContent}>
                {
                    this.state.dataLoaded ? (
                        <SwipeListView
						dataSource={this.ds.cloneWithRows(this.state.listViewData)}
						renderRow={ (data, secId, rowId, rowMap) => (
                            <TouchableHighlight
                                onPress={ _ => this._touchRow(secId, rowId, rowMap) }
								style={styles.rowFront}
								underlayColor={'#AAA'}>
								<View>
									<Text style = {{fontSize: fontSizeNormal}}>{data}</Text>
								</View>
							</TouchableHighlight>
						)}
						renderHiddenRow={ (data, secId, rowId, rowMap) => (
							<View style={styles.rowBack}>
								<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this._deleteRow(secId, rowId, rowMap) }>
									<Text style={[styles.backTextWhite,{fontSize: fontSizeNormal}]}>删除</Text>
								</TouchableOpacity>
							</View>
						)}
                        rightOpenValue={DP(-75)}
                        stopRightSwipe = {DP(-75)}
                        disableRightSwipe = {true}
                        closeOnRowBeginSwipe = {true}
                        closeOnScroll = {true}
                        closeOnRowPress = {true}
                        recalculateHiddenLayout = {true}
                        preview = {false}
                        enableEmptySections = {true}
                        swipeRowStyle={{flex: 1}}
					/>
                    ) : (null)
                }
                    
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
        backgroundColor: 'white',
        shadowColor: 'red',
    },
    title:
    {
        flex: 1.3,
        marginTop: DP(20),
        width: s_w - DP(20),
        height: DP(80),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#395DA6',
        borderRadius: DP(5)
    },
    body:
    {
        flex: 8,
        width: s_w,
        marginTop: 0,

    },
    bodyContent:{
        marginLeft:DP(10),
        marginRight: DP(10),
        flexDirection: 'column',
        backgroundColor: 'white',
        height: DP(rowHeiht * (7 + 1)),
        borderRadius: DP(7),
    },
    marginTop3:
    {
        marginTop: DP(5),
    }
});



const styles = StyleSheet.create({
	backTextWhite: {
		color: '#FFF'
	},
	rowFront: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: '#C4C4C4',
		borderBottomWidth: DP(1),
		justifyContent: 'center',
        height: DP(60)
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft:DP( 15),
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: DP(75)
	},
	backRightBtnLeft: {
		backgroundColor: '#C8C7CD',
		right: DP(75)
	},
	backRightBtnRight: {
		backgroundColor: '#3E65B4',
		right: 0
	},
});

export default NotifyPage;