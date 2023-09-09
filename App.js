import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Alert,Platform} from 'react-native';
import Routes from './src/router'
import 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';

import { useEffect } from 'react';
import * as PushNotifications from 'expo-notifications';


PushNotifications.setNotificationHandler({
  handleNotification: async ()=>{
      return   {
          shouldPlaySound:true,
          shouldSetBadge:false,
          shouldShowAlert:true
      }
  }
});


export default function App() {

  useEffect(()=>{

    async function configurePushNotification(){

     const {status}= await  PushNotifications.getPermissionsAsync();

     let finalStatus=status;

     if(finalStatus!=='granted'){
        const {status}= await  PushNotifications.requestPermissionsAsync();
        finalStatus=status;

        if(finalStatus!=='granted'){
            Alert.alert('Permisions Required','Push notifications need the appropriate permissions.')
        }

        return;

     }

     const pushTokenData=  await PushNotifications.getExpoPushTokenAsync({
      projectId: '99aeacb8-9fd2-4bd6-b9d1-b7df2bc701ee',
     });

   
     console.log("Push Notification");

     console.log(pushTokenData);

     if(Platform.OS==='android'){
      PushNotifications.setNotificationChannelAsync('defualt',{
        name:'default',
        importance:PushNotifications.AndroidImportance.DEFAULT
      });
     }


    }

   configurePushNotification();


  },[]);

  useEffect(()=>{
    const subscription1= PushNotifications.addNotificationReceivedListener((notificationobj)=>{
      console.log('Notification Received');
    });

    const subscription2= PushNotifications.addNotificationResponseReceivedListener((response)=>{
      console.log('response Received');
    });

    return () => {
      subscription1.remove();
      subscription2.remove();
    }

  },[])
  
  function scheduleNotificationHandler(){
    PushNotifications.scheduleNotificationAsync({
        content:{
          title:'My first local notification',
          body:'This is the body of the notification. second',
          data:{userName:'Max'}
      },
      trigger:{
        seconds:5
      }
    });
  };


  return (
    <>
    <RootSiblingParent>
      <StatusBar barStyle="dark-content" />
        <Routes />
      </RootSiblingParent>
     
    </>
  );
}


