import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";


const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const userState = useSelector((state) => state.user); 
  const userId = userState.user.id

  const handleSignOut = () => {
    console.log("INNNN")
    // Clear user data from Redux store
    dispatch(clearUser());

    // Navigate to the login screen
    router.replace({ pathname: "/(auth)/login" });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.wrapper}
      >
        <View style={styles.userInfoWrapper}>
          <View style={styles.userTxtWrapper}>
            <Text style={[styles.userText, { fontSize: 12 }]}>Hi, {userState.user.username}</Text>
            <Text style={[styles.userText, { fontSize: 16 }]}>
              My <Text style={styles.boldText}>Finance</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {handleSignOut()}}
          style={styles.btnWrapper}
        >
          <Text style={styles.btnText}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.black, 
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  userInfoWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
  },
  userTxtWrapper: {
    marginTop:-40,
    marginLeft:-20,
  },
  userText: {
    color: Colors.white,
  },
  boldText: {
    fontWeight:'700',
  },
  btnWrapper: {
    borderColor: "#666",
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    marginTop: -20,
  },
  btnText: { 
    color: Colors.white, 
    fontSize: 12,
    marginTop: -20,
  },
});
