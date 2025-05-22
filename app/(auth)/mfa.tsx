import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';
import Animated, { FadeInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const MFAScreen = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const user = useSelector((state) => state.user.user);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("❌ Error", "Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/api/user/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, Otp: otp }),
      });
      const result = await response.json();
      if (result.message === "OTP verified successfully." && !result.error) {
        Alert.alert("✅ Success", "OTP Verified Successfully!", [
          { text: "OK", onPress: () => router.replace("/(tabs)/home") },
        ]);
      } else {
        Alert.alert("❌ Error", result.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      Alert.alert("❌ Error", "An error occurred during OTP verification.");
    }
  };

  return (
    <View style={styles.screen}>
      {/* <Image source={require("../../images/auth_bg.png")} style={styles.backgroundImage} resizeMode="cover" blurRadius={2} /> */}

      <Animated.View entering={FadeInDown.duration(600)} style={styles.titleContainer}>
        <Text style={styles.title}>🔐 Two-Factor Authentication</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100)}>
        <TextInput
          testID="emailDisplay"
          style={styles.emailInput}
          value={email}
          editable={false}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)}>
        <TextInput
          testID="otpInput"
          style={styles.otpInput}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#888"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)}>
        <TouchableOpacity
          testID="verifyOtpButton"
          onPress={handleVerifyOTP}
          style={styles.verifyButton}
        >
          <Text style={styles.verifyButtonText}>✅ Verify OTP</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default MFAScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  backgroundImage: {
    position: "absolute",
    width,
    height,
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.6,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FF8DF4",
    textShadowColor: "#FEC8FF",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  emailInput: {
    width: "100%",
    padding: 15,
    backgroundColor: "#333845",
    borderRadius: 10,
    color: "#B0B0B0",
    fontSize: 16,
    marginBottom: 15,
  },
  otpInput: {
    width: "100%",
    padding: 15,
    backgroundColor: "#444B5A",
    borderRadius: 10,
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 4,
  },
  verifyButton: {
    marginTop: 20,
    backgroundColor: "#A259FF",
    padding: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Poppins",
  },
});