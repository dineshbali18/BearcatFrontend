import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { setTempUser } from "@/store/slices/tempUserSlice";

const { width, height } = Dimensions.get("window");

const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const phoneNumberRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    console.log("onSubmit triggered!"); 
    const email = emailRef.current.trim().toLowerCase();
    const password = passwordRef.current.trim();
    const username = nameRef.current.trim();
    const phoneNum = phoneNumberRef.current.trim();

    if (!email || !password || !username || !phoneNum) {
      Alert.alert("Register", "Please fill all the fields!");
      return;
    }

    console.log("aaaaaaaaaaa")

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const digitsOnlyPhone = phoneNum.replace(/\D/g, "");
    if (digitsOnlyPhone.length !== 10) {
      Alert.alert("Invalid Phone", "Phone number must be exactly 10 digits.");
      return;
    }
console.log("bbbbbbb")
    setLoading(true);
    const emailPayload = { "email": email };

    dispatch(setTempUser({ email, password, username, phoneNum }));

    const retry = async (fn, label) => {
      let attempt = 0;
      let lastError = null;
      while (attempt < 3) {
        const { success, error } = await fn();
        if (success) return { success: true };
        lastError = error;
        attempt++;
      }
      return { success: false, error: `${label} failed: ${lastError || "Unknown error"}` };
    };
    console.log("bbbbbbbcccccccc")
    const generateOtp = async () => {
      try {
        const res = await fetch("http://api.otp.jack-pick.online:3001/api/user/generateotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });
        const result = await res.json();
        return { success: res.ok, error: result.error };
      } catch (err) {
        console.error("Generate OTP error:", err);
        return { success: false, error: "Network error" };
      }
    };
    console.log("bbbbbbbccccccccddddddd")
    const genResult = await retry(generateOtp, "OTP generation");
    if (!genResult.success) {
      setLoading(false);
      Alert.alert("\u274C Error", genResult.error);
      return;
    }
    console.log("eeeeeeeeeeeeee")
    const sendOtp = async () => {
      try {
        const res = await fetch("http://api.otp.jack-pick.online:3001/api/user/sendotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });
        const result = await res.json();
        return { success: res.ok, error: result.error };
      } catch (err) {
        console.error("Send OTP error:", err);
        return { success: false, error: "Network error" };
      }
    };
console.log("fffffffffff")
    const sendResult = await retry(sendOtp, "OTP sending");
    setLoading(false);

    if (!sendResult.success) {
      console.log("gggggggg")
      Alert.alert("\u274C Error", sendResult.error);
      return;
    }
console.log("000000")
    router.push("/(auth)/mfa_register");
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <Animated.View entering={FadeInDown.duration(600)} style={styles.headingWrapper}>
          <Text style={styles.gradientHeader}>Let’s</Text>
          <Text style={styles.gradientHeader}>Get Started</Text>
        </Animated.View>

        <View style={styles.form}>
          <Text style={styles.subtitleText}>Create an account to track your expenses</Text>

          <Animated.View entering={FadeInDown.delay(100)}>
            <Input
              icon={<Icons.User size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
              placeholder="Enter your name"
              onChangeText={(value) => (nameRef.current = value)}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Input
              icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
              placeholder="Enter your email"
              onChangeText={(value) => (emailRef.current = value)}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <Input
              icon={<Icons.Phone size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
              placeholder="Enter your phone number"
              onChangeText={(value) => (phoneNumberRef.current = value)}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)}>
            <Input
              icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)}>
            <Button testID="signUpButton" loading={loading} onPress={onSubmit} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Button>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.navigate("/(auth)/login")}> 
            <Text style={styles.linkText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  headingWrapper: {
    gap: 4,
    marginTop: spacingY._20,
  },
  gradientHeader: {
    fontSize: 32,
    fontWeight: "900",
    fontFamily: "Poppins",
    letterSpacing: 1,
    color: "#FF8DF4",
    textShadowColor: "#FEC8FF",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  subtitleText: {
    color: "#D4C2FF",
    fontSize: 15,
    fontFamily: "JosefinSans-SemiBold",
  },
  form: {
    gap: spacingY._20,
  },
  buttonStyle: {
    backgroundColor: "#A259FF",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
    fontFamily: "Poppins",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 20,
  },
  footerText: {
    color: "#D4C2FF",
    fontSize: 15,
    fontFamily: "JosefinSans-SemiBold",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF8DF4",
    textDecorationLine: "underline",
  },
});
