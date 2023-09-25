import React, {useState,useEffect,createRef,useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import uriToBlob from './convertUriToBlob';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MDIcon from "react-native-vector-icons/MaterialIcons";
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from "expo-image-picker";
import Animated from 'react-native-reanimated';
import  firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { ref,uploadBytesResumable,getStorage,getDownloadURL } from "firebase/storage";
import {useNavigation,StackActions } from "@react-navigation/native";
import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 
import { colors,Button,Input } from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";


const Profile = () => {
  const [userInfo, setUserInfo] = useState();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState({});
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
 
  const {colors} = useTheme();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [progress, setProgress] = useState(0);
 
  
  const input = createRef();
  
  
  
  async function pickImage() {

    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

   
    if (!result.canceled) {

     
      const tempImageURL=await uploadImage(result.uri);

      firebase.auth().currentUser.updateProfile({
           photoURL:tempImageURL
      }).then(()=>{
          console.log("Profile Updated")
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  async function SaveUserName(){
    firebase.auth().currentUser.updateProfile({
      displayName:userName
      }).then(()=>{
          console.log("Profile Updated"+userName)
      }).catch((err)=>{
        console.log(err);
      })
  }


  const uploadImage = async (tempimage) => {

   // alert(tempimage);

    if( tempimage == null ) {
      return null;
    }

    setIsLoading(true);
   
    const uploadUri = tempimage;

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
      setImage(uploadUri);
      setIsLoading(false); 
      
      return url;

    } catch (e) {

      console.log(e);
      setIsLoading(false);
      return null;
    }

  };

  function RenderImage() {

    if(image!=null){
      return (
       
                 <Image source={{uri:image}} style={{width: '100%', height:'100%',borderRadius:20}} />
              
      );
    }
    
  }


 

  useEffect(async () => {
    console.disableYellowBox = true;
    AsyncStorage.getItem("@user").then((response) => {
  
    let myData=JSON.parse(response);
    setUserName(myData.displayName);
    setEmail(myData.email);
    setImage(myData.photoURL);
    
 });
    
   

    //console.log("Profile:"+userJSON);

    //alert(userInfo.displayName);


    setUserName(userInfo.displayName);

   // setAvatarUrl(Fire.shared.userData.photoURL);
    Fire.shared.userInfos
      .get()
      .then(function (doc) {
        setInfos(doc.data());
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [avatarUrl]);
  

  function sinoutMe(){

   
    try {
     

      firebase.auth().signOut();

      AsyncStorage.removeItem('@user');


     navigation.dispatch(StackActions.replace('Thankyou'));
     
       
    } catch(e) {
      alert("error");
    }
     console.log('Done')

}


  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems:'flex-start'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
       >
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

 

  return (
    <View style={styles.container}>

  
    <Animated.View style={{margin: 20}}>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={() => pickImage()} >
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
             
              style={{height: 100, width: 100,backgroundColor:colors.backdrop,borderRadius:20}}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                 <ActivityIndicator size="large" animating={isLoading} />
                <RenderImage></RenderImage>
              
              </View>
           
            </View>
          </View>
          <View style={{marginTop:-5,alignItems:'center'}}>
          <Icon
                  name="camera"
                  size={35}
                  color="#fff"
                  style={{
                  
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#fff',
                    color:colors.backdrop,
                    borderRadius: 10,
                  
                  }}
                />
          </View>
        </TouchableOpacity>
        <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
          {email}
        </Text>
      </View>


      <View style={styles.action}>
        <FontAwesome name="user-o" color={colors.text} size={20} />
        <Text
          placeholder="Email"
          placeholderTextColor="#666666"
          keyboardType="email-address"
          autoCorrect={false}
          style={[
            styles.textInput,
            {
              color: colors.text,
              textAlign:'left',
              marginTop:1,
              verticalAlign:'middle',
            },
          ]}
        >{userName}</Text>
       <FontAwesome name="edit" color={colors.text} size={20} onPress={() => this.RBSheet.open()} />
      </View>
    
     
     
      <View style={styles.action}>
        <Feather name="phone" color={colors.text} size={20} />
        <Text
          placeholder="Phone"
          placeholderTextColor="#666666"
          keyboardType="number-pad"
          autoCorrect={false}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}

        />
          <FontAwesome name="edit" color={colors.text} size={20} onPress={() => this.RBSheet.open()} />
      </View>
      
    
      
      <TouchableOpacity style={styles.commandButton} onPress={() => sinoutMe()}>
        <Text style={styles.panelButtonTitle}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
 

      <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={200}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            
            }
          }}
        >

          <View style={{width:'100%'}}>
          <Input
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              placeholder='INPUT WITH ERROR MESSAGE'
              isFocused={true}
              ref={input}
              errorStyle={{ color: 'red' }}
              errorMessage=''
              value={userName}
              autoFocus={true}
              inputStyle={{width:'80%'}}
              onChangeText={(value) =>setUserName(value)}
            />
          </View>

          <View style={{ flexDirection: 'row'}}>
         

              <Button
                title="Cancel"
                type="outline"
                onPress={() => this.RBSheet.close()}
                style={{marginLeft:50,  padding: 30}}
              />

              <View style={{width:20}}></View>

            <Button
                title="Save"
                type="outline"
                style={{marginRight:10,  padding: 30}}
                onPress={() => {SaveUserName();this.RBSheet.close() }}
              />
          </View>
         
    </RBSheet>
    </View>
    
  );
};

export default Profile;




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor:colors.primary
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    verticalAlign:'middle'
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});