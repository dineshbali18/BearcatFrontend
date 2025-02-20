import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const MFAScreen = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = () => {
    if (otp.length === 6 && otp === "123456") {
      // Mock OTP validation, replace with actual backend check
      Alert.alert("✅ Success", "OTP Verified Successfully!", [
        { text: "OK", onPress: () => router.replace("../(tabs)") },
      ]);
    } else {
      Alert.alert("❌ Error", "Invalid OTP. Please try again.");
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

export default MFAScreen;
