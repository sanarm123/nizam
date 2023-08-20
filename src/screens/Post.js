import React, { useState, useEffect } from "react";
import { useNavigation,useIsFocused,StackActions } from "@react-navigation/native";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ToastProvider } from "react-native-toast-notifications";

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { ref,uploadBytesResumable,getStorage,getDownloadURL } from "firebase/storage";


import Fire from "../components/Fire/index2";

import {
  View,
  Text,
  Alert,
  Image,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";

import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 

const firebaseConfig = require("../config/firebaseConfig");
// "add moment(item.timestamp).fromNow()" in code "item.node_id"
const data = Fire.shared.fakeData;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }

 

export default function Post() {

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [progress, setProgress] = useState(0);
 


  const [photoUrl, setPhotoUrl] = useState(
    "https://img.icons8.com/material-outlined/24/000000/user--v1.png"
  );

  const navigation = useNavigation();


 

   function SplashScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Please Wait while loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
 

  function RenderImage() {

    if(image!=null){
      return (
        <View  style={{width: 100, height: 120}} v>
                 <Image source={{uri:image}} style={{width: 100, height: 100}} />
                 <Button  title="Remove" onPress={()=>{setImage(null)}}  ></Button>
              </View>
               
      );
    }
    
  }



  async function handlePost() {
    const data = {
      text: text.trim(),
      localUri: image,
      likes: 0,
      comments: [],
    };

    return Fire.shared
      .addPost(data)
      .then(() => {
        setText("");
        setImage(null);
        navigation.goBack();
      })
      .catch((err) => {
        Alert.alert("erro", JSON.stringify(err));
      });
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;

     // alert(imageUri);
      setImage(imageUri);
    });
  };


  async function pickImage() {
    const resul = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

   // alert(resul.uri);

    if (!resul.cancelled) {
      setImage(resul.uri);
    }
  }

   const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest()
       xhr.onload = function () {
         // return the blob
         resolve(xhr.response)
       }
       xhr.onerror = function () {
         reject(new Error('uriToBlob failed'))
       }
       xhr.responseType = 'blob'
       xhr.open('GET', uri, true)
   
       xhr.send(null)})}

  const uploadImage = async () => {


    if( image == null ) {
      return null;
    }

    setIsLoading(true);
   
    const uploadUri = image;

   // alert(image);

   const blobFile = await uriToBlob(uploadUri);

    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    

    setUploading(true);
    setTransferred(0);

    const storageMain = firebase.storage().ref(`photos/${filename}`);
    const storageRef = ref(storageMain, `photos/${filename}`);

    //alert('moving');

    const task =uploadBytesResumable(storageRef,blobFile);

   
    
  //  alert('moving test');


    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {

      console.log('taskonchanged');

      const progress =
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress.toFixed());

    });

    try {
      await task;

      const url = getDownloadURL(task.snapshot.ref);
    
      //alert(url);
      setUploading(false);
      setImage(null);
      setIsLoading(false); 
      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {

      console.log(e);
      setIsLoading(false);
      return null;
    }

  };



  useEffect(async () => {
    //console.disableYellowBox = true;
    AsyncStorage.getItem("@user").then((response) => {
        let myData=JSON.parse(response);

        setUserInfo(myData);
    });
        
    

  }, []);

  const PostComment= async ()=> {
    const imageUrl = await uploadImage();


    setIsLoading(true);
  
    firebase.firestore().collection("posts").add({
      text: text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner:userInfo.uid,
      imageLink:imageUrl,
      owner_name: userInfo.displayName
    }).then(async (doc) => {
        setIsLoading(false);
        setText('');

          Alert.alert("Info", "Successfully uploaded");

        //   navigation.dispatch(StackActions.replace('Thankyoupost'));

    }).catch((err) => {
        setIsLoading(false);
        Alert.alert("Error", "Failed to load");
    });

  }

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
        <View style={{flex:1}}>
          <View style={{flexDirection:"row",justifyContent:'flex-start'}}>
            <Text style={{textAlign:"left",fontSize:16}}>
            దయచేసి మీ సమస్యలను పోస్ట్ చేయండి,  మేము మీ అభిప్రాయాన్ని విలువైనదిగా పరిగణిస్తాము మరియు దానిని తెలుసుకోవడానికి మరియు మెరుగుపరచడానికి ఒక అవకాశంగా చూస్తాము.
            </Text>
          </View> 
            <View style={{flexDirection:"row",width:'100%', justifyContent:'flex-start'}}>
                <TextInput
                placeholder="దయచేసి ఇక్కడ టైప్ చేయండి"
                multiline
                value={text}
                onChangeText={setText}
                numberOfLines={5}
                autoFocus = {false}
                style={{width:"80%",marginTop:10, height:'auto',width:'100%',justifyContent:'flex-start',textAlignVertical:'top', borderStyle:'dotted',borderWidth:1}}
                
                />


            
            </View>

            <View style={{flexDirection:"row",justifyContent:'flex-start',marginTop:10,alignItems:'center',width:'100%'}}>

            
              <View style={{width:'100%',alignItems:'center'}}>
                <TouchableOpacity style={styles.appButtonContainer} onPress={() => pickImage()}  >
                    <Text style={{textAlign:'center'}}>Add Photo</Text>
                </TouchableOpacity>
              </View>              
           
              
            </View>

          <View style={{borderRadius:20,marginTop:20,height:130}} >
              <RenderImage></RenderImage>               
            
          </View>
          <View style={{borderRadius:20,marginTop:20}}>
          <Button
            onPress={PostComment}
            title="Post"
            disabled={text.length==0}
            accessibilityLabel="Post "
            />
          </View>
            
        </View>

      
          
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    justifyContent: "space-between",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginLeft:5,
    marginRight:5
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  inputContainer: {
   
    flexDirection: "row",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: "auto",
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
});
