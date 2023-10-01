import React, { useEffect,useState } from "react";
import { View,Modal, Text,Dimensions,ActivityIndicator, Image, StyleSheet,Button,FlatList,Platform,TouchableHighlight,TouchableOpacity} from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import * as rssParser from 'react-native-rss-parser';
import { WebView } from 'react-native-webview';
import {useNavigation,StackActions } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import NewModal from "./NewModal";
import { AntDesign } from '@expo/vector-icons'; 

export default function Notifications() {
  const [posts, setPosts] = useState([]);
  const [tempURL, setTempURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false)

  function GetNewsDetails(){

  const newsData= fetch('https://news.google.com/rss/search?q=telangana&hl=te&gl=IN&ceid=IN:te')
      .then((response) => response.text())
      .then((responseData) =>{
       const data= rssParser.parse(responseData)

       const itemsdata=JSON.parse(JSON.stringify(data._j)).items;


       const list =[];

       console.log( JSON.parse(JSON.stringify(data._j)).items);

       for (let index = 0; index < itemsdata.length; index++) {
        console.log("title:"+itemsdata[index].title + ' Date:'+itemsdata[index].published);
        list.push(itemsdata[index]);
       }

       setPosts(list);

      })
      .then((rss) => {
        console.log(rss.title);
        console.log(rss.items.length);
    });

  }


  function ItemDetails(item){
    
    console.log(item.links[0].url);
    setTempURL(item.links[0].url);
    
  //  this.RBSheet.open();
  }

  useEffect(()=>{
    GetNewsDetails();

  },[]);


 function IndicatorLoadingView() {
    return (
      <ActivityIndicator
        color="#3235fd"
        size="large"
        style={styles.IndicatorStyle}
      />
    );
  }

  return (
    <View style={styles.container}>
    
    <FlatList
     style={styles.feed}
     refreshControl={
      <RefreshControl refreshing={isLoading} onRefresh={GetNewsDetails}>

      </RefreshControl>
    }
     
  data={posts}
  renderItem={({item, index, separators}) => (
    <TouchableHighlight
      key={item.key}
  
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.feedItem}>
     
        <TouchableOpacity onPress={() =>{  console.log(item.links[0].url);
    setTempURL(item.links[0].url);
    setOpen(true);}}>
             <Text style={{fontSize:20}}>{item.title}</Text>
        </TouchableOpacity>
      </View>

      
    </TouchableHighlight>
  )}
/>



<Modal
        visible={open}
        animationType="fade"
          transparent={true}
        onRequestClose={() => setOpen(false)}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>


<AntDesign name="doubleleft" size={45} color="black" style={styles.modalHeaderCloseText}/>
</TouchableOpacity>
            </View>
            <View style={{ flex:1, flexDirection: 'col',width:'100%'}} >
           
                  <WebView
                    originWhitelist={['*']}
                    source={{uri: tempURL}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    allowsFullscreenVideo={ false }
                    renderLoading={this.IndicatorLoadingView}
                    startInLoadingState={true}
                    onLoad={() =>setIsLoading(false)}
                  />
            </View>
          </View>
    </Modal>
    <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={'800'}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            
            }
          }}
        >

        

          <View style={{ flex:1, flexDirection: 'col',width:'100%'}}>
            <Button
                title="Cancel"
                type="outline"
                onPress={() => this.RBSheet.close()}
                style={{marginLeft:50,  padding: 30}}
              />

               

             
           
          </View>
         
    </RBSheet>


   

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sub: {
    fontWeight: "400",
    color: "#37373750",
  },
  modal: {
    flex: 1,
    marginTop:20,
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
  modalHeaderCloseText: {
    textAlign: "left",
    fontSize:30,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom:10
  },
  modalHeaderContent: {
    flexGrow: 1,
    marginTop:50
  },
  IndicatorStyle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});
