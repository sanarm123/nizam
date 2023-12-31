import React, { useState,useEffect,useCallback,useRef} from "react";
import { useNavigation,StackActions} from "@react-navigation/native";
import  firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { colors } from 'react-native-elements';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Notifications from 'expo-notifications';

import {
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
  ActivityIndicator,
  Button
} from "react-native";

import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 
import { getAuth,onAuthStateChanged,
  setPersistence,signInWithEmailAndPassword,
  browserLocalPersistence,GoogleAuthProvider,signInWithCredential } from "firebase/auth";


WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async ()=>{
      return   {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }
  }
});





const notificationResponseListener = Notifications.addNotificationResponseReceivedListener((response)=>{
  console.log("hi received");
})
export default function Login() {

  

  const notificationListener = useRef();
  const responseListener = useRef();
  
  const lastNotificationResponse = Notifications.useLastNotificationResponse()
  useEffect(() => {
    
    if (

      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      console.log(lastNotificationResponse.notification.request.content)
    }
  }, [lastNotificationResponse])


 
  useEffect(()=>{

   
    async function configurePushNotification(){

     const {status}= await  Notifications.getPermissionsAsync();

     let finalStatus=status;

     console.log("Push Notification Status:"+finalStatus);

     if(finalStatus!=='granted'){
        const {status}= await  Notifications.requestPermissionsAsync();
        finalStatus=status;

        if(finalStatus!=='granted'){
            Alert.alert('Permisions Required','Push notifications need the appropriate permissions.')
        }

        return;

     }

     const pushTokenData=  await Notifications.getExpoPushTokenAsync({
      projectId: '99aeacb8-9fd2-4bd6-b9d1-b7df2bc701ee',
     });

   
     console.log("Push Notification");

     console.log(pushTokenData);

     if(Platform.OS==='android'){
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX
      });
     }


    }

   configurePushNotification();


  },[]);

  
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();


  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
     androidClientId: "402597814020-di3t5qd59sh1f760pfqm1m8m8u5hop0p.apps.googleusercontent.com",
     iosClientId:"402597814020-pismu01phaac1eakoqvpo5ovir16s3uj.apps.googleusercontent.com"
  });
 
  React.useEffect(() => {
    if (response?.type === "success") {
      const auth = getAuth();
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      setLoading(true);
      signInWithCredential(auth, credential)
      .then(function () {

       /// alert('success');
        setLoading(false);
       
      })
      .catch((err) => {
        alert(err.message);

        setLoading(false);
        setError(err.message);
      });
    }
  }, [response]);
 
  const checkLocalUser=async()=>{
   
    const userJSON= await AsyncStorage.getItem("@user");

    console.log(userJSON);


    setLoading(true);
    if(JSON.parse(userJSON)!=null){

      let tempdata=JSON.parse(userJSON);
    // console.log("sucess");
     setUserInfo(tempdata);
     //alert(JSON.stringify(userInfo));
     setLoading(false);
   //  navigation.navigate("AppTab", { screen: "home" });

      ///firebase.auth().signInWithCredential()

     navigation.dispatch(StackActions.replace('AppTab'));
     
   }
    else
    {

      setLoading(false);
   
    }

  }


  function  handleLogin()  {
    setLoading(true);

    const auth = getAuth();

  
   setPersistence(auth,browserLocalPersistence);
   signInWithEmailAndPassword(auth, email, password)
      .then(function () {
        setLoading(false);
        navigation.navigate("AppTab", { screen: "home" });

      
      })
      .catch((err) => {
        alert(err.message);

        setLoading(false);
        setError(err.message);
      });
  }

  LayoutAnimation.easeInEaseOut();


  useEffect( ()=>{
    
    checkLocalUser();

    const auth = getAuth();

    const unsubsc=onAuthStateChanged(auth, async (user)=>{

         if(user){
             setUserInfo(user);
             AsyncStorage.setItem("@user",JSON.stringify(user));
         }
  
     })
  
     return ()=>unsubsc();
  
   },[])

   

   if(userInfo===null){
      // alert("Going to Login");
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />

         
          <View style={{ width: "100%", height: "auto" }}>
           
    
            <Image
              source={require("../../assets/loginLogo.png")}
              style={{ alignSelf: "center", marginTop: 10 }}
            />
    
            <Text
              style={styles.greeting}
            >{`నిజాయితీ తో కూడిన సేవ మరియు మీ సంతృప్తి మా కర్తవ్యం`}</Text>
    
            <View style={styles.errorMessage}>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
    
            <View style={styles.form}>
              <View>
                <Text style={styles.inputTitle}>Email</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={email}
                  placeholder="దయచేసి మీ ఇమెయిల్‌ని టైప్ చేయండి"
                  onChangeText={setEmail}
                />
              </View>
    
              <View style={{ marginTop: 32 }}>
                <Text style={styles.inputTitle}>Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  placeholder="దయచేసి మీ పాస్‌వర్డ్‌ని టైప్ చేయండి"
                  onChangeText={setPassword}
                />
              </View>
            </View>
    
            <TouchableOpacity onPress={() => handleLogin()} style={styles.button}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text
                  style={{ color: "#FFF", fontWeight: "500", fontWeight: "bold" }}
                >
                  Login
                </Text>
              )}
            </TouchableOpacity>
    
            <TouchableOpacity style={{ alignSelf: "center", marginTop: 10 }}>
              <Text style={{ color: "#414959", fontSize: 18 }} onPress={() => navigation.navigate('RegisterScreen')}>
                Sing up?{" "}
                <Text
                  
                  style={{ fontWeight: "500", color: "#E9446A" }}
                >
                  Go
                </Text>
              </Text>
            </TouchableOpacity>

        
        <View style={{alignItems:"center"}}>

        <TouchableOpacity
        
        onPress={() => promptAsync()}
      >

   

<Text style={{ fontSize: 32, fontWeight: "bold",marginTop:20 }}>
        Sign In with{" "}
        <Text style={{ color: "#4285F4" }}>
          G<Text style={{ color: "#EA4336" }}>o</Text>
          <Text style={{ color: "#FBBC04" }}>o</Text>
          <Text style={{ color: "#4285F4" }}>g</Text>
          <Text style={{ color: "#34A853" }}>l</Text>
          <Text style={{ color: "#EA4336" }}>e</Text>
        </Text>
      </Text>
      </TouchableOpacity>
    
        </View>
      
   
          </View>

          <Button
            onPress={ ()=>{
               // alert("");
               Notifications.scheduleNotificationAsync({
                content:{
                  title:'Email',
                  body:'This is the body of the notification. second',
                  data:{userName:'Max'}
              },
              trigger:{
                seconds:2,
                channelId: 'default',
              }
            });

            
            }}
            title="Schedule Notification"  />
         
          <Text>Sponserd by Dolphineye</Text>
        </View>
      );
   }

 

 
  



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageHeaer: {
    position: "absolute",
    width: 520,
    height: 349,
    top: -140,
    right: -150,
  },
  imageFooter: {
    position: "absolute",
    opacity: 0.4,
    width: 500,
    height: 340,
    bottom: -220,
    zIndex: -5,
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 5,
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  errorText: {
    color: "#E9446A",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    marginBottom: 40,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 12,
    fontWeight:"bold",
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
