import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux"; // Assuming Redux for user data
import Constants from 'expo-constants';
const MFARegisterScreen = () => {
  const { email } = useLocalSearchParams(); // Get the email passed from previous screen
  const router = useRouter();
  const [otp, setOtp] = useState(""); // State for OTP input
  const user = useSelector((state) => state.user.user); // Get the user data from Redux store

  // Function to handle OTP verification
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("❌ Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      // Send OTP verification request to backend
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3000/api/user/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Email from the local search params
          Otp: otp, // OTP entered by the user
        }),
      });

      const result = await response.json();
      console.log("QQQQQQQQQQ",result)

      if (result.message == "OTP verified successfully." && result.error == undefined) {
        // If OTP is verified successfully, navigate to home
        Alert.alert("✅ Success", "OTP Verified Successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"), // Navigate to home screen (replace with your home screen path)
          },
        ]);
      } else {
        // Handle error if OTP is incorrect
        Alert.alert("❌ Error", result.error|| "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification error:", error);
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

export default MFARegisterScreen;
