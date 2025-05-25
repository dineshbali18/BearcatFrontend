import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";
import { useRouter } from "expo-router";
import { getWalletAmount } from "@/helper/Home";
import Colors from "@/constants/Colors";
import { UseSelector } from "react-redux";

const Header = ({ refreshTrigger }) => {
  const token = useSelector((state)=>state.user.token)
  const name = useSelector((state)=>state.user.name)
  const user = useSelector((state)=>state.user)

  console.log("IUUUUUUUU",user)
  const dispatch = useDispatch();
  const router = useRouter();
  const [walletAmt, setWalletAmt] = useState(0);

  const handleSignOut = () => {
    dispatch(clearUser());
    router.replace({ pathname: "/(auth)/login" });
  };

  const fetchWalletBalance = async () => {

    console.log("PPPPPPP",token)
    console.log("NAME:::::",name)
    try {
      const res = await getWalletAmount(token);
      setWalletAmt(res.wallet_balance);
    } catch (err) {
      console.log("Failed to fetch wallet balance", err);
    }
  };

  const handleAddFunds = () => {
    router.push('/(payments)/addFunds');
  };

  useEffect(() => {
    fetchWalletBalance();
  }, [refreshTrigger]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userTxtWrapper}>
          <Text style={[styles.userText, { fontSize: 12 }]}>Hi, {name}</Text>
          <Text style={[styles.userText, { fontSize: 16 }]}>
            Welcome to <Text style={styles.boldText}>LuckyWheel</Text>
          </Text>
        </View>

        <View style={styles.rightWrapper}>
      <TouchableOpacity onPress={handleAddFunds}>
        <View style={styles.walletRow}>
          <Text style={styles.walletIcon}>💳</Text>
          <Text style={styles.walletText}>${walletAmt}    +</Text>
        </View>
      </TouchableOpacity>
    </View>


          <TouchableOpacity onPress={handleSignOut} style={styles.btnWrapper}>
            <Text style={styles.btnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a2e",
    zIndex: 10,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  userTxtWrapper: {
    flexDirection: "column",
    marginTop: 2,
  },
  userText: {
    color: Colors.white,
  },
  boldText: {
    fontWeight: "700",
    color: "#00b894",
  },
  rightWrapper: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00b894",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  
  walletIcon: {
    fontSize: 16,
    color: "#fff",
    marginRight: 6,
  },
  
  walletText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  
  addFundsButton: {
    marginBottom: 8,
  },
  
  addFundsText: {
    color: "#00b894",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  
  btnWrapper: {
    borderColor: "#666",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  btnText: {
    color: Colors.white,
    fontSize: 12,
  },
});
