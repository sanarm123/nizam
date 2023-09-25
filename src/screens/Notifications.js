import React, { useEffect,useState } from "react";
import { View, Text,Dimensions,ActivityIndicator, Image, StyleSheet,Button,FlatList,Platform,TouchableHighlight,Linking} from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import * as rssParser from 'react-native-rss-parser';
import { WebView } from 'react-native-webview';
import {useNavigation,StackActions } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";

export default function Notifications() {
  const [posts, setPosts] = useState([]);
  const [tempURL, setTempURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

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
    
    this.RBSheet.open();
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
      onPress={() => ItemDetails(item)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.feedItem}>
        <Text>{item.title}</Text>
      </View>
    </TouchableHighlight>
  )}
/>

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
