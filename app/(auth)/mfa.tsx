import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';

const MFAScreen = () => {
  const { email } = useLocalSearchParams(); // From login/register
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const user = useSelector((state) => state.user.user);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("❌ Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3000/api/user/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, Otp: otp }),
      });

      const result = await response.json();
      console.log("OTP Verification Response:", result);

      if (result.message === "OTP verified successfully." && !result.error) {
        Alert.alert("✅ Success", "OTP Verified Successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#FFD700", marginBottom: 20 }}>
        🔐 Two-Factor Authentication
      </Text>

      {/* Email (Non-editable) */}
      <TextInput
        testID="emailDisplay"
        style={{
          width: "100%",
          padding: 15,
          backgroundColor: "#333845",
          borderRadius: 10,
          color: "#B0B0B0",
          fontSize: 16,
          marginBottom: 15,
        }}
        value={email}
        editable={false}
      />

      {/* OTP Input */}
      <TextInput
        testID="otpInput"
        style={{
          width: "100%",
          padding: 15,
          backgroundColor: "#444B5A",
          borderRadius: 10,
          color: "#FFFFFF",
          fontSize: 18,
          textAlign: "center",
          letterSpacing: 4,
        }}
        placeholder="Enter 6-digit OTP"
        placeholderTextColor="#888"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      {/* Verify Button */}
      <TouchableOpacity
        testID="verifyOtpButton"
        onPress={handleVerifyOTP}
        style={{
          marginTop: 20,
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 10,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>✅ Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MFAScreen;
