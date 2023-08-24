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
import { getAuth,onAuthStateChanged} from "firebase/auth";

import {
   Text
  } from "react-native";

import AppTab from "./components/tab";

import Thankyou from "./screens/Thankyou";
import Thankyoupost from "./screens/Thankyoupost";

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

    console.log(userJSON);
    
    if(JSON.parse(userJSON)!=null){
  
    let tempdata=JSON.parse(userJSON);


    //let tt=new Date(tempdata.stsTokenManager.expirationTime);
    //console.log(tt);


    setUserInfo(tempdata);

     setIsLoading(false);
     
   }
    else
    {
  
      setIsLoading(false)
   
    }
  
  }
  
  
  useEffect( async ()=>{
      
   // checkLocalUser();
  
  
   //  return ()=>checkLocalUser();
  
   },[])
  
  
   useEffect( ()=>{
    
    const auth = getAuth();
   
    const unsubsc=onAuthStateChanged(auth,async (user)=>{

      //    console.log(JSON.stringify(user));
      //  alert(JSON.stringify(user));
         if(user){
             setUserInfo(user);
             setIsLoading(false);
             await AsyncStorage.setItem("@user",JSON.stringify(user));
  
         }
         else
         {
          // setIsLoading(false);
          setIsLoading(false);
         }
  
     })
  
     return ()=>unsubsc();
  
   },[])

  
  
   function AuthStack() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="login">
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="AppTab" component={AppTab} />
      <Stack.Screen name="Thankyou" component={Thankyou} />
      <Stack.Screen name="Thankyoupost" component={Thankyoupost} />
    </Stack.Navigator>
    );
  }

  function HomeStack() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="AppTab">
     <Stack.Screen name="AuthStack" component={AuthStack} />
     
      <Stack.Screen name="AppTab" component={AppTab} />
      <Stack.Screen name="Thankyou" component={Thankyou} />
      <Stack.Screen name="Thankyoupost" component={Thankyoupost} />
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
