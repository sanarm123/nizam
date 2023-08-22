import React, { useState,useEffect, Fragment, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage,{useAsyncStorage} from "@react-native-async-storage/async-storage"; 

import moment from "moment";

import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  AppState,
  ToastAndroid
} from "react-native";

import ImageZoom from 'react-native-image-pan-zoom';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { RefreshControl } from "react-native-gesture-handler";
import {PinchGestureHandler, State } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';



export default function Home() {
 
  const currentState = useRef(AppState.currentState);
  const [posts, setPosts] = useState([]);
  const [likeIcon, setLikeIcon] = useState("ios-heart-empty");
  const [likeColor, setLikeColor] = useState("#73788B");
  const [isLoading, setIsLoading] = useState(false);
  const [lastDoc,setLastDoc]=useState();
  const [lastPost,setLastPost]=useState(false);
  const [modalVisible,setModalVisible]=useState(false);
  const [selectedItem,setSelectedItem]=useState(null);

  const scale=new Animated.Value(1);

  const screen = Dimensions.get('window')

  const isFocused = useIsFocused();
  const [state, setState] = useState(currentState.current);
  const [userInfo, setUserInfo] = useState();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  

  useEffect(async () => {
   
    AsyncStorage.getItem("@user").then((response) => {
        let myData=JSON.parse(response);

        setUserInfo(myData);

        setUserName(myData.displayName);
        setEmail(myData.email);
    });
        
    

  }, []);

 
  useEffect(() => {

    Toast.show('Hi', {
      duration: 3000,
    });

    const handleChange = AppState.addEventListener("change", changedState => {

     // alert(state);
     fetchDataWithoutSnapShot();
      currentState.current = changedState;
      setState(currentState.current);
    });
  
    return () => {
      handleChange.remove();
    };
  }, []);

  function ago(time) {


   let tm= new Date(time.seconds * 1000 + time.nanoseconds/1000000)

    let difference = moment(tm).diff(moment());
    return moment.duration(difference).humanize();
  }


  async function fetchData() {

    ToastAndroid.show('Request sent successfully!', ToastAndroid.SHORT);

    setIsLoading(true);
    const list =[];

    let query = firebase.firestore().collection("posts").orderBy("created", "desc").limit(3);


    query.onSnapshot((snapshot) => {

      const list =posts;
      let changedDocs = snapshot.docChanges();

     // const poststest=collections.docs

     let count=0;
      changedDocs.forEach((change) => {

        if (change.type == "added") {
          count=count+1;
        }



     
      })

      if(count>0){
       // fetchDataWithoutSnapShot();
      }

    });


      query.get()
      .then((collections) => {
        collections.forEach((doc) => {
          
          list.push(doc.data());
          console.log(doc.data());

        })


        //alert(JSON.stringify(list));
      
        setPosts(list);
        setIsLoading(false);
        const lastDoc=collections.docs[collections.docs.length-1];
        setLastDoc(lastDoc);

       // alert(JSON.stringify(lastDoc));


      }).catch((err) => {
        setIsLoading(false);
        console.log(err)
      })
  }

  async function fetchDataWithoutSnapShot() {

   // setIsLoading(true);
    const list =[];

    let query = firebase.firestore().collection("posts").orderBy("created", "desc").limit(3);


      query.get()
      .then((collections) => {
        collections.forEach((doc) => {
          
          list.push(doc.data());
         // console.log(doc.data());

        })


        //alert(JSON.stringify(list));
      
        setPosts(list);
     //   setIsLoading(false);
        const lastDoc=collections.docs[collections.docs.length-1];
        setLastDoc(lastDoc);

       // alert(JSON.stringify(lastDoc));


      }).catch((err) => {
        setIsLoading(false);
        console.log(err)
      })
  }
    
  useEffect( async ()=>{
    
    fetchData();
  
   },[])


async function FetchMore(){
   
    const list = posts;

 let query = firebase
 .firestore()
 .collection("posts")
 .orderBy("created", "desc").startAfter(lastDoc).limit(3);

 query.get()
   .then((collections) => {
     const isCollectionEmpty=collections.size===0;

    
     if(!isCollectionEmpty){
       const poststest=collections.docs

       collections.docs.length==0?setLastPost(true):setLastPost(false);

       poststest.forEach((doc)=>{
            list.push(doc.data());
       });

       setPosts(list);
       setIsLoading(false);
       const lastDoc=collections.docs[collections.docs.length-1];
       setLastDoc(lastDoc);
      // alert(JSON.stringify(lastDoc));

     }
     else
     {
       setIsLoading(false);
       collections.docs.length==0?setLastPost(true):setLastPost(false);
     }
     
   }).catch((err) => {
     setIsLoading(false);
     console.log(err)
   })


  }

  const hidden = false;
  useEffect(() => {
    console.disableYellowBox = true;
  }, []);

  function like(item) {
    if (likeIcon === "ios-heart-empty") {
      setLikeIcon("ios-heart");
      setLikeColor("#ff3612");
    } else {
      setLikeIcon("ios-heart-empty");
      setLikeColor("#73788B");
    }
    item.site_admin = true;
  }

  function SplashScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Please Wait while loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale: scale }
      }
    ],
    {
      useNativeDriver: true
    }
  )

  onPinchStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
      }).start()
    }
  }

  function FoorScreen() {
    if (isLoading) {
      // We haven't finished checking for the token yet
      return <SplashScreen />;
    }
  }

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (

    <Fragment>
      <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 35, height: 20 }} />
        <Text style={styles.textHeader}>Welcome {userName}</Text>
        <TouchableOpacity
          style={{ height: 35, width: 35, borderRadius: 35 / 2 }}
        >
        
        </TouchableOpacity>
      </View>
      {hidden ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
         
          <Text style={{ fontSize: 20, fontWeight: "500", color: "#33333350" }}>
            Posts
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.feed}
          data={posts}
          keyExtractor={(item,index) => String(item.index)}
          showsVerticalScrollIndicator={true}
          renderItem={({ item, index }) => (
            <>
              <View style={styles.feedItem}>
                <Image
                  source={{ uri: item.avatar_url }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={styles.name}>Posted By:{item.owner_name}</Text>
                      <Text style={styles.timestamp}>{ago(item.created)} ago</Text>
                    </View>

                   
                  </View>

                  <Text style={styles.post}>{item.text}</Text>
                  <TouchableOpacity onPress={()=>{setModalVisible(true);setSelectedItem(item)}}>
                    <Image
                      source={{ uri: item.imageLink }}
                      resizeMode="cover"
                      style={styles.postImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
            </>
          )}
          
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchData}>

            </RefreshControl>
          }
       
          ListFooterComponent={!lastPost&&<SplashScreen/>}
          onEndReached={FetchMore}
         

        />
        
      )}
    </View>

    <Modal
        visible={modalVisible}
        animationType="fade"
          transparent={true}
        onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
               </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalHeaderCloseText}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginLeft:-15}} >
            <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={Dimensions.get('window').width* 0.9}
                       imageHeight={Dimensions.get('window').width* 0.9}  >
                <Image style={{ width: '100%', height: '100%'}} resizeMode="cover"
                       source={selectedItem!==null?{uri:selectedItem.imageLink}:null}/>
            </ImageZoom>
             
         
             
            </View>
          </View>
      </Modal>

    </Fragment>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    paddingTop: 34,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.5,
    zIndex: 10,
  },
  textHeader: {
    fontSize: 22,
    fontWeight: "bold",
  },
  feed: {
    marginHorizontal: 16,
    marginLeft:-5
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    
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
    alignItems:'center',
    marginVertical: 16,
  },
  postZoomImage: {
    width: "100%",
    height: 500,
    alignItems:'center',
    marginVertical: 16,
  },
  modal: {
    flex: 1,
    margin: 10,
    padding: 5,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  /* The content of the modal takes all the vertical space not used by the header. */
  modalContent: {
    flex: 1
  },
  modalHeader: {
    flexDirection: "row",
  },
  /* The header takes up all the vertical space not used by the close button. */
  modalHeaderContent: {
    flexGrow: 1,
  },
  modalHeaderCloseText: {
    textAlign: "center",
    fontSize:20,
    paddingLeft: 5,
    paddingRight: 5
  }
});
