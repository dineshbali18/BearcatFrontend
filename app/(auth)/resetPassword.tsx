import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import Constants from 'expo-constants';

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [isVerified, setIsVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      Alert.alert("❌ Error", "Please enter a valid email.");
      return;
    }

    try {
      // First request: generate OTP
      const generateOtpResponse = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3000/api/user/generateotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const generateOtpData = await generateOtpResponse.json();
      console.log("!!!!!!!!",generateOtpData.message)
      if (generateOtpData.message !== "OTP updated successfully." && generateOtpData.message !== "OTP generated and saved successfully." && generateOtpData.message !== "OTP generated or updated successfully.") {
        throw new Error("Failed to generate OTP.");
      }
      

      // Second request: send OTP
      const sendOtpResponse = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3000/api/user/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const sendOtpData = await sendOtpResponse.json();
      console.log(sendOtpData)
      if (sendOtpData.message !== "OTP sent successfully.") {
        throw new Error("Failed to send OTP.");
      }

      Alert.alert("📩 OTP Sent", "Check your email for the OTP.");
      setStep(2);
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === "") {
      Alert.alert("❌ Error", "Please enter the OTP.");
      return;
    }

    try {
      // Third request: verify OTP
      const verifyOtpResponse = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3000/api/user/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, Otp: otp }),
      });
      const verifyOtpData = await verifyOtpResponse.json();
      console.log("VVVVV",verifyOtpData)
      if (verifyOtpData.message != "OTP verified successfully.") {
        throw new Error("Invalid OTP. Please try again.");
      }

      Alert.alert("✅ Success", "OTP verified successfully.");
      setIsVerified(true);
      setStep(3);
    } catch (error) {
      Alert.alert("❌ Error", "Error in verified ");
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 6) {
      Alert.alert("❌ Error", "Password must be at least 6 characters.");
      return;
    }

    try {
      // Final request: update password
      console.log("QQQQQQ")
      const resetPasswordResponse = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:email, password:password }),
      });
      const resetPasswordData = await resetPasswordResponse.json();
      console.log("RRRRRREEEE",resetPasswordData)
      if (resetPasswordData.message !== "User details updated successfully") {
        throw new Error("Failed to reset password.");
      }

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E", padding: 20 }}>
      
      {/* Close Button */}
      <TouchableOpacity onPress={handleClose} style={{ position: "absolute", top: 40, right: 20 }}>
        <AntDesign name="closecircle" size={28} color="#FF4C4C" />
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#FFD700", marginBottom: 20 }}>
        🔓 Reset Password
      </Text>

      {/* Step 1: Email Input */}
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 15 }}>
        <TextInput
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: "#333845",
            borderRadius: 10,
            color: step > 1 ? "#B0B0B0" : "#FFF",
            fontSize: 16,
          }}
          placeholder="📧 Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          editable={step === 1}
        />
        {step > 1 && <Feather name="check-circle" size={24} color="#4CAF50" style={{ marginLeft: 10 }} />}
      </View>

      {/* Send OTP Button (Only in Step 1) */}
      {step === 1 && (
        <TouchableOpacity
          onPress={handleSendOtp}
          style={{
            backgroundColor: "#4CAF50",
            padding: 15,
            borderRadius: 10,
            width: "100%",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>📨 Send OTP</Text>
        </TouchableOpacity>
      )}

      {/* Step 2: OTP Input */}
      {step >= 2 && (
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 15 }}>
          <TextInput
            style={{
              flex: 1,
              padding: 15,
              backgroundColor: "#333845",
              borderRadius: 10,
              color: isVerified ? "#B0B0B0" : "#FFF",
              fontSize: 18,
              textAlign: "center",
              letterSpacing: 4,
            }}
            placeholder="🔢 Enter OTP"
            placeholderTextColor="#888"
            value={otp}
            onChangeText={setOtp}
            editable={!isVerified}
          />
          {isVerified && <Feather name="check-circle" size={24} color="#4CAF50" style={{ marginLeft: 10 }} />}
        </View>
      )}

      {/* Verify OTP Button (Only in Step 2) */}
      {step === 2 && !isVerified && (
        <TouchableOpacity
          onPress={handleVerifyOtp}
          style={{
            backgroundColor: "#FFA500",
            padding: 15,
            borderRadius: 10,
            width: "100%",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>✅ Verify OTP</Text>
        </TouchableOpacity>
      )}

      {/* Step 3: New Password Input */}
      {step === 3 && (
        <TextInput
          style={{
            width: "100%",
            padding: 15,
            backgroundColor: "#444B5A",
            borderRadius: 10,
            color: "#FFF",
            fontSize: 16,
            marginBottom: 15,
          }}
          placeholder="🔑 Enter new password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      )}

      {/* Reset Password Button (Only in Step 3) */}
      {step === 3 && (
        <TouchableOpacity
          onPress={handleResetPassword}
          style={{
            backgroundColor: "#4CAF50",
            padding: 15,
            borderRadius: 10,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>🔄 Reset Password</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ResetPasswordScreen;
