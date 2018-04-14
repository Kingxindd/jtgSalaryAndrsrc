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

import TouchableButton from './Coms/TouchableButton';

import MainHeaderWithBack from './Coms/mainHeaderWithBack';
import Table from './Coms/Table';

import { DP, PX } from './Lib/ScreenUtil';
import { gServerAddr, postForm, gUserToken, fontSizeNormal } from './Coms/commondef';
const sw = Dimensions.get('window').width;
export default class Details extends Component {
    static defaultProps = {
        name: 'nu',
        tableColumns:
        [
            {
                title: '项目',
                width:(sw - DP(40)) * 2 / 3,
                dataIndex: 'category'
            },
            {
                title: '金额',
                width:(sw - DP(40)) / 3,
                dataIndex: 'asum'
            },
        ],
    };
    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
    };
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
    };
    onBackAndroid = () => {
        this.props.navigation.goBack();
        return true;
        //return false;
    };
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            dataSource: [
                {
                    category: '项目',
                    asum: '金额',
                },
                {
                    category: 'test pro',
                    asum: '1000',
                },
                {
                    category: 'test pro',
                    asum: '1000',
                },
                {
                    category: 'test pro',
                    asum: '1000',
                },
                {
                    category: 'test pro',
                    asum: '1000',
                },
                {
                    category: 'test pro',
                    asum: '1000',
                },
                {
                    category: 'test pro',
                    asum: '1000',
                },
                {
                    category: 'test pro',
                    asum: '1000',
                },
                {
                    category: '总计',
                    asum: '000',
                },
            ],
        };
    };
    async componentWillMount() {
        console.log("component will mount");
        const { state } = this.props.navigation;
        let ID = state.params.ID;
        let userID = state.params.userID;
        let SalaryYears = state.params.SalaryYears;
        let OpCode = state.params.OpCode;
        let OpName = state.params.OpName;
        let SignDate = "";
        if(state.params.SignDate){
            SignDate = state.params.SignDate;
        }
        let SignPlatform = "";
        if(state.params.SignPlatform){
            SignPlatform = state.params.SignPlatform;
        }
        console.log("SalaryID:" + ID);
        console.log("userID: " + userID);
        console.log("SalaryYears:", SalaryYears);
        console.log("SingDate:" + SignDate);
        console.log("SignPlatform: " + SignPlatform);


        let url = gServerAddr + "GetSalaryDetailHandler.ashx";
        let cond = "userID=" + userID + "&&SalaryID=" + ID + "&&SalaryYears=" + SalaryYears;
        postForm(url, cond, (ret) => {
            console.log(JSON.stringify(ret));
            let ll = new Array();
            let as = 0;
            let aa = { "category": "项目", "asum": "金额" };
            ll[as] = aa;
            as = as + 1;
            aa = { "category": "工资年月", "asum": SalaryYears };
            ll[as] = aa;
            as = as + 1;
            aa = { "category": "工号", "asum": OpCode };
            ll[as] = aa;
            as = as + 1;
            aa = { "category": "姓名", "asum": OpName };
            ll[as] = aa;
            as = as + 1;
            let asum = 0.00;
            if (ret.DetailResult) {
                for (var li in ret.DetailResult) {
                    for (var key in ret.DetailResult[li]) {
                        let value = parseFloat(ret.DetailResult[li][key]);
                        if(value > 0.1){
                            let t = { "category": key, "asum": value.toFixed(2) };
                            asum = asum + value;
                            ll[as] = t;
                            as = as + 1;
                        }
                        //let t = { "category": key, "asum": ret.DetailResult[li][key] };
                        //asum = parseInt(ret.DetailResult[li][key]) + asum;
                        
                    }

                }
            }
            //加上签收时间和签收端
            if(SignDate != "" && SignPlatform != ""){
                aa = { "category": "签收时间", "asum": SignDate };
                ll[as] = aa;
                as = as + 1;
                aa = { "category": "签收端", "asum": SignPlatform };
                ll[as] = aa;
                as = as + 1;
            }
            

            console.log("ll : " + ll);
            //ll[as] = { "category": "总计", "asum": asum.toFixed(2) };
            this.setState({ dataSource: ll });
            this.setState({dataLoaded: true});

        });

    };

    render() {
        const { state } = this.props.navigation;
        return (<Image source={require('./images/bkg.png')} style={st.container}>
            <View style={st.top}>
                <MainHeaderWithBack navi={this.props.navigation} ></MainHeaderWithBack>
            </View>

            <View style={st.mid}>
                <View style={{ paddingTop: DP(15), paddingBottom: DP(15) }}>
                    <Text  style = {{fontSize: fontSizeNormal}}>工资</Text>
                </View>
                <View style={{ borderTopWidth: DP(1), borderTopColor: '#D2D2D2' }}>
                {this.state.dataLoaded ? (
                    <Table height={DP(490)} columns={this.props.tableColumns} dataSource={this.state.dataSource} />
                ):(
                    <View style = {{width:(sw - DP(40)), height: DP(400)}}></View>
                )}
                    
                </View>
            </View>

            <View style={st.btm}>
                
            </View>
        </Image>);
    }
}

const st = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //backgroundColor: '#F7F7F7',
        alignItems: 'center',
        width:null,
        height:null,
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        resizeMode:Image.resizeMode.cover,
        //祛除内部元素的白色背景
        backgroundColor:'rgba(0,0,0,0)',
    },
    top: {
        flex: 1,
    },
    mid: {
        flex: 8,
        marginTop: DP(25),
        borderRadius: DP(7),
        flexDirection: 'column',
        alignItems: 'center',
        //backgroundColor: 'white',
        paddingLeft: DP(18),
        paddingRight: DP(18),
    },
    btm: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: DP(18 + 18 + 95 + 245)
    },
});
