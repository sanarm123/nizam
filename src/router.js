import React, { useState,useEffect } from "react";
import {
 
  View,
  ActivityIndicator
 
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 

import {
   Text
  } from "react-native";

import AppTab from "./components/tab";

import Thankyou from "./screens/Thankyou";

import Login from "./screens/Login";
import Loading from "./screens/Loading";
import RegisterScreen from "./screens/Register";



const firebaseConfig = require("./config/firebaseConfig");



const Stack = createStackNavigator();

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}





export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  function SplashScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Please Wait while loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  const checkLocalUser=async()=>{
   
    const userJSON= await AsyncStorage.getItem("@user");

    
    if(JSON.parse(userJSON)!=null){
  
    let tempdata=JSON.parse(userJSON);
    setUserInfo(tempdata);

     setIsLoading(false);
     
   }
    else
    {
  
      setIsLoading(false)
   
    }
  
  }
  
  
  useEffect( async ()=>{
      
    checkLocalUser();
  
  
     return ()=>checkLocalUser();
  
   },[])
  
  
  
   function AuthStack() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="login">
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="AppTab" component={AppTab} />
      <Stack.Screen name="Thankyou" component={Thankyou} />
    </Stack.Navigator>
    );
  }

  function HomeStack() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="AppTab">
     <Stack.Screen name="AuthStack" component={AuthStack} />
     
      <Stack.Screen name="AppTab" component={AppTab} />
      <Stack.Screen name="Thankyou" component={Thankyou} />
    </Stack.Navigator>
    );
  }
  
  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }


 // alert(userInfo);

  return (



    <NavigationContainer>
      <Stack.Navigator headerMode="none">
      {userInfo == null ? (
           
          <Stack.Screen name="AuthStack" component={AuthStack} />
           
        ) : (
          // User is signed in
          <Stack.Screen name="HomeStack" component={HomeStack} />
          
        )}

    
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}
