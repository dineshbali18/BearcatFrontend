import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [isVerified, setIsVerified] = useState(false);

  const handleSendOtp = () => {
    if (!email.includes("@")) {
      Alert.alert("❌ Error", "Please enter a valid email.");
      return;
    }
    setStep(2);
    Alert.alert("📩 OTP Sent", "Check your email for the OTP.");
  };

  const handleVerifyOtp = () => {
    if (otp !== "123456") {
      Alert.alert("❌ Error", "Invalid OTP. Try again.");
      return;
    }
    setIsVerified(true);
    setStep(3);
  };

  const handleResetPassword = () => {
    if (password.length < 6) {
      Alert.alert("❌ Error", "Password must be at least 6 characters.");
      return;
    }
    Alert.alert("✅ Success", "Password reset successful! Redirecting...");
    router.replace("../login");
  };

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setStep(1);
    setIsVerified(false);
    router.replace("/(auth)/login")
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
