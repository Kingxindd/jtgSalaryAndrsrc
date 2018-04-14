import {
  Alert,
} from 'react-native';

import {DP} from '../Lib/ScreenUtil';

//网址：http://salary.dxflash.com:8081
//IP: http://106.14.155.147:8081
export const gServerAddr = 'http://salary.dxflash.com:8081/MobilePlatform/'; //正式部署IP：106.14.155.147
export function postForm(url, data, callback){
    //try{
        fetch(url,{
            method: 'POST',
            mode: 'cors',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
        .then((res)=>{
            //console.log('fetch return');
            if(res.ok){
                return res.json();
            }
        })
        .then(json=>{
                //console.log('json return');
                //console.log(JSON.stringify(json));
                callback(json);
            })
        .catch((er)=>{
            console.log('网络连接异常:' + er);
            Alert.alert('连接服务器超时或失败！');
        }).done();

    //     console.log('get response');
    //     console.log(response);
    //     //let responseJson = response.json();
    //     //let responseJson = await response.json();
    //     response.json().then((aa)=>
    // {
    //     console.log(aa);
    //     callback(aa);
    // })
    //     //console.log('parse json done');
    //     //console.log(JSON.stringify(responseJson));
    //    // callback(responseJson);      



    // }catch(e){
    //     Alert.alert('连接服务器超时或失败！');
    // };  
};

export const gUserToken = 'userToken';

export const fontSizeNormal = DP(16);