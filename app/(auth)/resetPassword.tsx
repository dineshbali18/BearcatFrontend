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
import { useRouter } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import Constants from 'expo-constants';
import Animated, { FadeInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isVerified, setIsVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      Alert.alert("❌ Error", "Please enter a valid email.");
      return;
    }
    try {
      const generateOtpResponse = await fetch(`http://api.otp.jack-pick.online:3001/api/user/generateotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const generateOtpData = await generateOtpResponse.json();
      if (!generateOtpData.message?.includes("OTP")) throw new Error("Failed to generate OTP.");

      const sendOtpResponse = await fetch(`http://api.otp.jack-pick.online:3001/api/user/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const sendOtpData = await sendOtpResponse.json();
      if (sendOtpData.message !== "OTP sent successfully.") throw new Error("Failed to send OTP.");

      Alert.alert("📩 OTP Sent", "Check your email for the OTP.");
      setStep(2);
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("❌ Error", "Please enter the OTP.");
      return;
    }
    try {
      const verifyOtpResponse = await fetch(`http://api.otp.jack-pick.online:3001/api/user/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, Otp: otp }),
      });
      const verifyOtpData = await verifyOtpResponse.json();
      if (verifyOtpData.message !== "OTP verified successfully.") throw new Error("Invalid OTP. Please try again.");

      Alert.alert("✅ Success", "OTP verified successfully.");
      setIsVerified(true);
      setStep(3);
    } catch (error) {
      Alert.alert("❌ Error", "Error verifying OTP.");
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 6) {
      Alert.alert("❌ Error", "Password must be at least 6 characters.");
      return;
    }
    try {
      const resetPasswordResponse = await fetch(`http://api.otp.jack-pick.online:3000/user/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const resetPasswordData = await resetPasswordResponse.json();
      if (resetPasswordData.message !== "User details updated successfully") throw new Error("Failed to reset password.");

      Alert.alert("✅ Success", "Password reset successful! Redirecting...");
      router.replace("../login");
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setStep(1);
    setIsVerified(false);
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.screen}>
      {/* <Image source={require("../../images/auth_bg.png")} style={styles.backgroundImage} resizeMode="cover" blurRadius={2} /> */}

      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <AntDesign name="closecircle" size={28} color="#FF4C4C" />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.duration(600)}>
        <Text style={styles.title}>🔓 Reset Password</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100)}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { color: step > 1 ? "#B0B0B0" : "#FFF" }]}
            placeholder="📧 Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            editable={step === 1}
          />
          {step > 1 && <Feather name="check-circle" size={24} color="#4CAF50" style={{ marginLeft: 10 }} />}
        </View>
      </Animated.View>

      {step === 1 && (
        <TouchableOpacity onPress={handleSendOtp} style={styles.primaryButton}>
          <Text style={styles.buttonText}>📨 Send OTP</Text>
        </TouchableOpacity>
      )}

      {step >= 2 && (
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { textAlign: "center", letterSpacing: 4, color: isVerified ? "#B0B0B0" : "#FFF" }]}
              placeholder="🔢 Enter OTP"
              placeholderTextColor="#888"
              value={otp}
              onChangeText={setOtp}
              editable={!isVerified}
            />
            {isVerified && <Feather name="check-circle" size={24} color="#4CAF50" style={{ marginLeft: 10 }} />}
          </View>
        </Animated.View>
      )}

      {step === 2 && !isVerified && (
        <TouchableOpacity onPress={handleVerifyOtp} style={styles.secondaryButton}>
          <Text style={styles.buttonText}>✅ Verify OTP</Text>
        </TouchableOpacity>
      )}

      {step === 3 && (
        <Animated.View entering={FadeInDown.delay(300)}>
          <TextInput
            style={styles.input}
            placeholder="🔑 Enter new password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Animated.View>
      )}

      {step === 3 && (
        <TouchableOpacity onPress={handleResetPassword} style={styles.primaryButton}>
          <Text style={styles.buttonText}>🔄 Reset Password</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ResetPasswordScreen;

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
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FF8DF4",
    textShadowColor: "#FEC8FF",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    fontFamily: "Poppins",
    marginBottom: 20,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    backgroundColor: "#333845",
    borderRadius: 10,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#A259FF",
    padding: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Poppins",
  },
});