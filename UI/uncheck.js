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
    TouchableOpacity,
  DatePickerAndroid,
  NativeModules,
  ScrollView
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import TouchableButton from './Coms/TouchableButton';

import ModalDropdown from 'react-native-modal-dropdown';
import MainHeaderWithBack from './Coms/mainHeaderWithBack';

import Ta1 from './Coms/Ta1';

import { DP, PX} from './Lib/ScreenUtil';

import {gServerAddr, postForm,gUserToken, fontSizeNormal} from './Coms/commondef';

const RCTDatePicker = NativeModules.DatePicker;


class Ta1Btn2 extends Component
{
    static defaultProps = {
    name: '',
    details: 'this is details...',
    btn1Name: 'Button1',
    btn2Name: 'Button2',
    onPressBtn1: null,
    onPressBtn2: null,
    allHeight: 70,
    };
    render()
    {
        return(
                <View 
                    style = {{height: DP(this.props.allHeight), width:  DP(350), backgroundColor:'white'
                            }}>
                    <View style = { {height:  DP(this.props.allHeight),width:  DP(320), marginLeft: DP(10),
                        flexDirection: 'row', justifyContent: 'flex-start',
                        alignSelf:'center',
                        borderBottomColor:'#D2D2D2', borderBottomWidth:  DP(1),}}>
                        <Text style = {[{paddingTop:  DP(this.props.allHeight * 0.36), width:  DP(80), fontSize: fontSizeNormal}]}>{this.props.name}:</Text>
                        <View
                            style = {{height:  DP(this.props.allHeight * 0.71), width:  DP(1),marginTop:  DP(this.props.allHeight * 0.14),
                                    borderRightWidth:  DP(1), borderRightColor: '#D2D2D2'}}> 
                        </View>
                        <Text style = {{paddingTop:  DP(25),paddingLeft: DP( 5), width:  DP(160), fontSize: fontSizeNormal}}>{this.props.details}</Text>
                        <View style = {{flexDirection: 'column', justifyContent: 'space-around', width:  DP(80)}}>
                                    <TouchableButton name = {this.props.btn1Name} buttonStyle = {{width:  DP(80), height:  DP(25)}} onPressButton = {this.props.onPressBtn1}></TouchableButton>
                                    <TouchableButton name = {this.props.btn2Name} buttonStyle = {{width:  DP(80), height:  DP(25)}} onPressButton = {this.props.onPressBtn2}></TouchableButton>         
                        </View>
                    </View>
                    
                </View>

        );
    }
}

class Uncheck extends Component
{
     constructor(props)
    {
        super(props);
        this.state = 
        {
           OpCode:'',
           isReadSingNum: 0,
           OpName: '',
           userID: '',
           YearMonth: '',
           hasGetInfo: false,
           SignPlatform: '',
           TotalGongziArray: new Array(),
           TotalBaoxiaoArray: new Array(),
           TotalJiangjinArray: new Array(),
           gongziIDArray: new Array(),
           baoxiaoIDArray: new Array(),
           jiangjinIDArray: new Array(),
        }
    };
    pad(num, n) {  
        var len = num.toString().length;  
        while(len < n) {  
            num = "0" + num;  
            len++;  
        }
        return num;  
    }; 

    async RequestSalary(url, cond){
        await postForm(url, cond, (ret)=>{
            console.log(JSON.stringify(ret));
            //ret.table读到了值，把值设置到state里面，并把 hasGetInfo设置为true
            if(ret.Table){
                console.log("table");
                console.log(ret.Table);
                let tJiangjin = new Array();
                let tBaoxiao = new Array();
                let tGongzi = new Array();
                let idtJiangjin = new Array();
                let idtBaoxiao = new Array();
                let idtGongzi = new Array();
                for(var li in ret.Table){
                    if(ret.Table[li].OpCode){
                        this.setState({OpCode: ret.Table[li].OpCode});
                    }
                    if(ret.Table[li].OpName){
                        this.setState({OpName:ret.Table[li].OpName});
                    }
                    if(ret.Table[li].SalaryYears){
                        this.setState({YearMonth: ret.Table[li].SalaryYears});
                    }
                    if(ret.Table[li].SignPlatform){
                        this.setState({hasGetInfo: true});
                        if(ret.Table[li].SignPlatform == '1'){
                            this.setState({SignPlatform: '手机'});
                        }else{
                            this.setState({SignPlatform: 'PC'});
                        }
                        
                    }
                    //使用数组
                    if(ret.Table[li].Description == '奖金'){
                        tJiangjin.push(ret.Table[li].TotalSalary);
                        idtJiangjin.push(ret.Table[li].ID);
                    }
                    if(ret.Table[li].Description == '报销'){
                        tBaoxiao.push(ret.Table[li].TotalSalary);
                        idtBaoxiao.push(ret.Table[li].ID);
                    }
                    if(ret.Table[li].Description == '工资'){
                        tGongzi.push(ret.Table[li].TotalSalary);
                        idtGongzi.push(ret.Table[li].ID);
                    }
                }
                //
                this.setState({TotalGongziArray: tGongzi, gongziIDArray: idtGongzi});
                this.setState({TotalBaoxiaoArray: tBaoxiao, baoxiaoIDArray: idtBaoxiao});
                this.setState({TotalJiangjinArray: tJiangjin, jiangjinIDArray: idtJiangjin});
                
            }
            else{
                console.warn('没有table的值');
            }
        });
    }

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
            if(data.OpCode){
                this.setState({OpCode: data.OpCode});
            }
            if(data.OpName){
                this.setState({OpName: data.OpName});
            }
            if(data.userID){
                this.setState({userID: data.userID});
                //_userid = data.userID;
            }
        }catch(e){
             console.log('check发生错误' + e);
        };  
        //由OpCode 查询工资
        let today = new Date();
        let year = today.getFullYear().toString();
        let month = this.pad(today.getMonth() + 1, 2);
        let url = gServerAddr + 'GetSalaryHandler.ashx';
        year = year+month;
        //year = '201409';
        this.setState({YearMonth: year});
        let cond = 'OpCode=' + this.state.OpCode + '&&SalaryYears=' + year + '&&isReadSignNum=' + this.state.isReadSingNum+ '&&userID=' + this.state.userID;
        console.log("cond");
        console.log(cond);
        this.RequestSalary(url, cond);

    };
    componentWillUnmount()
    {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
    };
    onBackAndroid = () => {
        //this.props.navigation.navigate('Main');
        this.props.navigation.goBack();
        return true;
    };
    async showDataPicker()
    {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth();
        var options = {
           year: y,
            month: m,
        };
        RCTDatePicker.showDatePicker(options, (y,m)=>{
            console.log("year:" + y);
            console.log("month:" + m);
            let year = y;
            let month = m - 1;
            let ym = year.toString() + this.pad(month + 1, 2);
            this.setState({YearMonth: ym});

            //这里去根据月份去查询相应的工资
            this.setState({YearMonth: ym});
            this.setState({hasGetInfo: false});
            let url = gServerAddr + 'GetSalaryHandler.ashx';
            let cond = 'OpCode=' + this.state.OpCode + '&&SalaryYears=' + ym + '&&isReadSignNum=' + this.state.isReadSingNum+ '&&userID=' + this.state.userID;
            this.RequestSalary(url, cond);
        });
    };


    render()
    {
        return(<Image source={require('./images/bkg.png')} style = {st.container}>
            <View style = {st.top}> 
                <MainHeaderWithBack  navi = {this.props.navigation}></MainHeaderWithBack>
            </View>

            <View style = {st.mid}>
                <Text style = {{ paddingTop:  DP(20), width:  DP(130), paddingLeft:  DP(20) , fontSize: fontSizeNormal}}>工资月份： </Text>
                <TouchableOpacity style = {{width: DP(220),
                        borderWidth:DP(0.3),
                        borderColor:'#000000',
                        borderRadius: DP(5),
                        height:DP( 40),
                        alignSelf: 'center',
                        justifyContent: 'center',
                        }}
                        onPress = {this.showDataPicker.bind(this)}>
                        <Text style = {{paddingLeft: DP(10), fontSize: fontSizeNormal}}>{this.state.YearMonth}</Text>
                </TouchableOpacity>
            </View>

            <View style = {st.btm}>
            <ScrollView showsVerticalScrollIndicator = {false}>
                <Ta1 name = '工号' details = {this.state.OpCode}></Ta1>
                <Ta1 name = '姓名' details = {this.state.OpName}></Ta1>
                
                {this.state.YearMonth != '' && this.state.hasGetInfo ?(<Ta1 name = '发放时间' details = {this.state.YearMonth}></Ta1>):(null)}
                
                {this.state.TotalGongziArray.length > 0 && this.state.gongziIDArray.length > 0 ?(
                    <Ta1Btn2 name = '工资总额' btn1Name = '明细' btn2Name = '签收' 
                    onPressBtn1 = {()=>{
                        this.props.navigation.navigate('Details', {ID: this.state.gongziIDArray[0], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID});
                    }}
                    onPressBtn2 = {()=>
                    {
                        let url = gServerAddr + "UpdateSalaryHandler.ashx";
                        let cond = "UpdateID=" + this.state.gongziIDArray[0] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                        console.log(cond);
                        postForm(url, cond, data =>{
                            console.log(JSON.stringify(data));
                            if(data.Result == "True"){
                                Alert.alert("签收","签收成功!");
                                //this.setState({hasSignedGongzi: true});
                                let tmp1 = this.state.TotalGongziArray;
                                tmp1.splice(0, 1);
                                let tmp2 = this.state.gongziIDArray;
                                tmp2.splice(0, 1);
                                this.setState({TotalGongziArray: tmp1, gongziIDArray: tmp2});
                            }else{
                                Alert.alert("签收","签收失败!");
                            }
                        });
                    }}
                    details = {this.state.TotalGongziArray[0]}>
                </Ta1Btn2>
                ):(null)}

                {this.state.TotalGongziArray.length > 1 && this.state.gongziIDArray.length > 1 ? (
                    <Ta1Btn2 name='工资总额' btn1Name='明细' btn2Name='签收'
                        onPressBtn1={() => {
                            this.props.navigation.navigate('Details', { ID: this.state.gongziIDArray[1], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID });
                        }}
                        onPressBtn2={() => {
                            let url = gServerAddr + "UpdateSalaryHandler.ashx";
                            let cond = "UpdateID=" + this.state.gongziIDArray[1] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                            console.log(cond);
                            postForm(url, cond, data => {
                                console.log(JSON.stringify(data));
                                if (data.Result == "True") {
                                    Alert.alert("签收", "签收成功!");
                                    //this.setState({hasSignedGongzi: true});
                                    let tmp1 = this.state.TotalGongziArray;
                                    tmp1.splice(1, 1);
                                    let tmp2 = this.state.gongziIDArray;
                                    tmp2.splice(1, 1);
                                    this.setState({ TotalGongziArray: tmp1, gongziIDArray: tmp2 });
                                } else {
                                    Alert.alert("签收", "签收失败!");
                                }
                            });
                        }}
                        details={this.state.TotalGongziArray[1]}>
                    </Ta1Btn2>
                ) : (null)}
                {this.state.TotalGongziArray.length > 2 && this.state.gongziIDArray.length > 2 ?(
                    <Ta1Btn2 name = '工资总额' btn1Name = '明细' btn2Name = '签收' 
                    onPressBtn1 = {()=>{
                        this.props.navigation.navigate('Details', {ID: this.state.gongziIDArray[2], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID});
                    }}
                    onPressBtn2 = {()=>
                    {
                        let url = gServerAddr + "UpdateSalaryHandler.ashx";
                        let cond = "UpdateID=" + this.state.gongziIDArray[2] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                        console.log(cond);
                        postForm(url, cond, data =>{
                            console.log(JSON.stringify(data));
                            if(data.Result == "True"){
                                Alert.alert("签收","签收成功!");
                                //this.setState({hasSignedGongzi: true});
                                let tmp1 = this.state.TotalGongziArray;
                                tmp1.splice(2, 1);
                                let tmp2 = this.state.gongziIDArray;
                                tmp2.splice(2, 1);
                                this.setState({TotalGongziArray: tmp1, gongziIDArray: tmp2});
                            }else{
                                Alert.alert("签收","签收失败!");
                            }
                        });
                    }}
                    details = {this.state.TotalGongziArray[2]}>
                </Ta1Btn2>
                ):(null)}



                {this.state.TotalJiangjinArray.length > 0 && this.state.jiangjinIDArray.length > 0 ? (
                    
                    <Ta1Btn2 name = '奖金总额' btn1Name = '明细' btn2Name = '签收'
                    onPressBtn1 = {()=>{
                        this.props.navigation.navigate('Details', {ID: this.state.jiangjinIDArray[0], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID});
                    }}
                    onPressBtn2 = {()=>{
                        let url = gServerAddr + "UpdateSalaryHandler.ashx";
                        let cond = "UpdateID=" + this.state.jiangjinIDArray[0] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                        postForm(url, cond, data =>{
                            if(data.Result == "True"){
                                Alert.alert("签收","签收成功!");
                                //this.setState({hasSignedJiangjin: true});
                                let tmp1 = this.state.TotalJiangjinArray;
                                tmp1.splice(0, 1);
                                let tmp2 = this.state.jiangjinIDArray;
                                tmp2.splice(0, 1);
                                this.setState({TotalJiangjinArray: tmp1, jiangjinIDArray: tmp2});
                            }else{
                                Alert.alert("签收","签收失败!");
                            }
                        });
                    }
                    }
                    details = {this.state.TotalJiangjinArray[0]}>
                </Ta1Btn2>
                ):(null)}

                {this.state.TotalJiangjinArray.length > 1 && this.state.jiangjinIDArray.length > 1 ? (
                    <Ta1Btn2 name='奖金总额' btn1Name='明细' btn2Name='签收'
                        onPressBtn1={() => {
                            this.props.navigation.navigate('Details', { ID: this.state.jiangjinIDArray[1], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID });
                        }}
                        onPressBtn2={() => {
                            let url = gServerAddr + "UpdateSalaryHandler.ashx";
                            let cond = "UpdateID=" + this.state.jiangjinIDArray[1] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                            postForm(url, cond, data => {
                                if (data.Result == "True") {
                                    Alert.alert("签收", "签收成功!");
                                    //this.setState({hasSignedJiangjin: true});
                                    let tmp1 = this.state.TotalJiangjinArray;
                                    tmp1.splice(1, 1);
                                    let tmp2 = this.state.jiangjinIDArray;
                                    tmp2.splice(1, 1);
                                    this.setState({ TotalJiangjinArray: tmp1, jiangjinIDArray: tmp2 });
                                } else {
                                    Alert.alert("签收", "签收失败!");
                                }
                            });
                        }
                        }
                        details={this.state.TotalJiangjinArray[1]}>
                    </Ta1Btn2>
                ) : (null)}
                {this.state.TotalJiangjinArray.length > 2 && this.state.jiangjinIDArray.length > 2 ? (
                    <Ta1Btn2 name='奖金总额' btn1Name='明细' btn2Name='签收'
                        onPressBtn1={() => {
                            this.props.navigation.navigate('Details', { ID: this.state.jiangjinIDArray[2], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID });
                        }}
                        onPressBtn2={() => {
                            let url = gServerAddr + "UpdateSalaryHandler.ashx";
                            let cond = "UpdateID=" + this.state.jiangjinIDArray[2] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                            postForm(url, cond, data => {
                                if (data.Result == "True") {
                                    Alert.alert("签收", "签收成功!");
                                    //this.setState({hasSignedJiangjin: true});
                                    let tmp1 = this.state.TotalJiangjinArray;
                                    tmp1.splice(2, 1);
                                    let tmp2 = this.state.jiangjinIDArray;
                                    tmp2.splice(2, 1);
                                    this.setState({ TotalJiangjinArray: tmp1, jiangjinIDArray: tmp2 });
                                } else {
                                    Alert.alert("签收", "签收失败!");
                                }
                            });
                        }
                        }
                        details={this.state.TotalJiangjinArray[2]}>
                    </Ta1Btn2>
                ) : (null)}

                {this.state.TotalBaoxiaoArray.length > 0 && this.state.baoxiaoIDArray.length > 0 ? (
                    <Ta1Btn2 name = '报销总额' btn1Name = '明细' btn2Name = '签收'
                    onPressBtn1 = {()=>{
                        this.props.navigation.navigate('Details', {ID: this.state.baoxiaoIDArray[0], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID});
                    }}
                    onPressBtn2 = {()=>{
                        let url = gServerAddr + "UpdateSalaryHandler.ashx";
                        let cond = "UpdateID=" + this.state.baoxiaoIDArray[0] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                        postForm(url, cond, data =>{
                            if(data.Result == "True"){
                                Alert.alert("签收","签收成功!");
                                //this.setState({hasSignedBaoxiao: true});
                                let tmp1 = this.state.TotalBaoxiaoArray;
                                tmp1.splice(0, 1);
                                let tmp2 = this.state.baoxiaoIDArray;
                                tmp2.splice(0, 1);
                                this.setState({TotalBaoxiaoArray: tmp1, baoxiaoIDArray: tmp2});
                            }else{
                                 Alert.alert("签收","签收失败!");
                            }
                        });
                    }}
                    details = {this.state.TotalBaoxiaoArray[0]}>
                </Ta1Btn2>
                ):(null)}

                {this.state.TotalBaoxiaoArray.length > 1 && this.state.baoxiaoIDArray.length > 1 ? (
                    <Ta1Btn2 name='报销总额' btn1Name='明细' btn2Name='签收'
                        onPressBtn1={() => {
                            this.props.navigation.navigate('Details', { ID: this.state.baoxiaoIDArray[1], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID });
                        }}
                        onPressBtn2={() => {
                            let url = gServerAddr + "UpdateSalaryHandler.ashx";
                            let cond = "UpdateID=" + this.state.baoxiaoIDArray[1] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                            postForm(url, cond, data => {
                                if (data.Result == "True") {
                                    Alert.alert("签收", "签收成功!");
                                    //this.setState({hasSignedBaoxiao: true});
                                    let tmp1 = this.state.TotalBaoxiaoArray;
                                    tmp1.splice(1, 1);
                                    let tmp2 = this.state.baoxiaoIDArray;
                                    tmp2.splice(1, 1);
                                    this.setState({ TotalBaoxiaoArray: tmp1, baoxiaoIDArray: tmp2 });
                                } else {
                                    Alert.alert("签收", "签收失败!");
                                }
                            });
                        }}
                        details={this.state.TotalBaoxiaoArray[1]}>
                    </Ta1Btn2>
                ) : (null)}
                {this.state.TotalBaoxiaoArray.length > 2 && this.state.baoxiaoIDArray.length > 2 ? (
                    <Ta1Btn2 name = '报销总额' btn1Name = '明细' btn2Name = '签收'
                    onPressBtn1 = {()=>{
                        this.props.navigation.navigate('Details', {ID: this.state.baoxiaoIDArray[2], SalaryYears: this.state.YearMonth, OpCode: this.state.OpCode, OpName: this.state.OpName, userID: this.state.userID});
                    }}
                    onPressBtn2 = {()=>{
                        let url = gServerAddr + "UpdateSalaryHandler.ashx";
                        let cond = "UpdateID=" + this.state.baoxiaoIDArray[2] + "&&isToSignNum=1&&Description=test&&userID=" + this.state.userID;
                        postForm(url, cond, data =>{
                            if(data.Result == "True"){
                                Alert.alert("签收","签收成功!");
                                //this.setState({hasSignedBaoxiao: true});
                                let tmp1 = this.state.TotalBaoxiaoArray;
                                tmp1.splice(2, 1);
                                let tmp2 = this.state.baoxiaoIDArray;
                                tmp2.splice(2, 1);
                                this.setState({TotalBaoxiaoArray: tmp1, baoxiaoIDArray: tmp2});
                            }else{
                                 Alert.alert("签收","签收失败!");
                            }
                        });
                    }}
                    details = {this.state.TotalBaoxiaoArray[2]}>
                </Ta1Btn2>
                ):(null)}

                </ScrollView>
            </View>

            <View style = {st.foot}>

            
            </View>


            
        </Image>);
    }
}

const st = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
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
    flex: 1,
    paddingTop:  DP(20),
    height:  DP(100),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btm:{
      flex: 7,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop:  DP(10),
      backgroundColor: 'white',
      width:  DP(350),
      alignSelf: 'center',
      justifyContent: 'flex-start',
      paddingBottom:  DP(50),
      borderRadius:  DP(7),
      opacity: 0.8,
  },
  paddingLeft20:{
      paddingLeft:  DP(20),
  },
  foot:{
      flex: 1,

  }
});

export default Uncheck;