import React,{useState,useEffect} from "react";
import { View, Text, Button, StyleSheet,Modal,TouchableOpacity } from "react-native";


export default function NewModal({ open }) {

    console.log("Window:"+open);
    const [modalVisible,setModalVisible]=useState(false);

    useEffect(() =>{

            setModalVisible(open);

    },[open]);


  


   // setModalVisible(open);

  return (
    <View style={styles.container}>
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
                <Text style={styles.modalHeaderCloseText}>close</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginLeft:-15}} >
           
             
            </View>
          </View>
    </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
    textAlign: "center",
    fontSize:20,
    paddingLeft: 5,
    paddingRight: 5
  },
  modalHeaderContent: {
    flexGrow: 1,
    marginTop:50
  },
  sub: {
    fontWeight: "400",
    color: "#37373750",
  },
});
