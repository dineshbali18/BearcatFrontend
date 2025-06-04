import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState({
    sendOtp: false,
    resetPassword: false,
  });

  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      Alert.alert("❌ Error", "Please enter a valid email.");
      return;
    }
    setLoading({ ...loading, sendOtp: true });
    try {
      const generateOtpResponse = await fetch(
        `http://api.otp.jack-pick.online:3001/api/user/generateotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const generateOtpData = await generateOtpResponse.json();
      if (!generateOtpData.message?.includes("OTP"))
        throw new Error("Failed to generate OTP.");

      const sendOtpResponse = await fetch(
        `http://api.otp.jack-pick.online:3001/api/user/sendotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const sendOtpData = await sendOtpResponse.json();
      if (sendOtpData.message !== "OTP sent successfully.")
        throw new Error("Failed to send OTP.");

      Alert.alert("📩 OTP Sent", "Check your email for the OTP.");
      setStep(2);
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    } finally {
      setLoading({ ...loading, sendOtp: false });
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 6) {
      Alert.alert("❌ Error", "Password must be at least 6 characters.");
      return;
    }
    if (!otp) {
      Alert.alert("❌ Error", "Please enter the OTP.");
      return;
    }
    
    setLoading({ ...loading, resetPassword: true });
    try {
      const resetPasswordResponse = await fetch(
        `http://api.jack-pick.online:3000/v1/user/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, otp }),
        }
      );

      const resetPasswordData = await resetPasswordResponse.json();

      if (resetPasswordData.message !== "User updated successfully")
        throw new Error("Failed to reset password.");

      Alert.alert("✅ Success", "Password reset successful! Redirecting...");
      router.replace("../login");
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    } finally {
      setLoading({ ...loading, resetPassword: false });
    }
  };

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setStep(1);
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <AntDesign name="closecircle" size={28} color="#FF4C4C" />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.duration(600)}>
        <Text style={styles.title}>🔓 Reset Password</Text>
      </Animated.View>

      <View style={styles.formContainer}>
        {/* Email Input */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                { color: step > 1 ? "#B0B0B0" : "#FFF" },
              ]}
              placeholder="📧 Enter your email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              editable={step === 1}
            />
            {step > 1 && (
              <Feather
                name="check-circle"
                size={24}
                color="#4CAF50"
                style={styles.checkIcon}
              />
            )}
          </View>
        </Animated.View>

        {step === 1 && (
          <TouchableOpacity
            onPress={handleSendOtp}
            style={styles.primaryButton}
            disabled={loading.sendOtp}
          >
            {loading.sendOtp ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>📨 Send OTP</Text>
            )}
          </TouchableOpacity>
        )}

        {/* OTP and Password Inputs (Step 2) */}
        {step === 2 && (
          <>
            <Animated.View entering={FadeInDown.delay(200)} style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="🔢 Enter OTP"
                  placeholderTextColor="#888"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)} style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="🔑 Enter new password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </Animated.View>

            <TouchableOpacity
              onPress={handleResetPassword}
              style={styles.primaryButton}
              disabled={loading.resetPassword}
            >
              {loading.resetPassword ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>🔄 Reset Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
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
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
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
    marginBottom: 30,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: "#333845",
    borderRadius: 10,
    fontSize: 16,
    color: "#FFF",
  },
  checkIcon: {
    position: "absolute",
    right: 15,
  },
  primaryButton: {
    backgroundColor: "#A259FF",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Poppins",
  },
});