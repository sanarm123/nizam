import { Alert } from "react-native";
import Constants from "expo-constants";
import Permissions from "expo-permissions";

class getPermissions {
  get getCameraPermission() {
    if(Constants.platform.android) {
      const { status } =  Permissions.askAsync(Permissions.CAMERA);
      if(status != "granted") {
        Alert.alert("desculpe","Nos precisamos de permissão de sua camera");
      }
    }
  }
}

export default new getPermissions();