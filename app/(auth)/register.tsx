import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
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
import Constants from "expo-constants";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const phoneNumberRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !nameRef.current ||
      !phoneNumberRef.current
    ) {
      Alert.alert("Register", "Please fill all the fields!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${Constants.expoConfig?.extra?.REACT_APP_API}:3000/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailRef.current,
            password: passwordRef.current,
            username: nameRef.current,
            phoneNum: phoneNumberRef.current,
          }),
        }
      );

      const res = await response.json();
      setLoading(false);

      if (res.error != undefined) {
        Alert.alert("Register", res.error);
      } else {
        Alert.alert("Register", "Registration successful!");
        router.replace(
          `/(auth)/mfa_register?email=${encodeURIComponent(
            emailRef.current
          )}`
        );
      }
    } catch (error) {
      Alert.alert("Register", "An error occurred during registration.");
      console.error("Registration error:", error);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />

      {/* <Image
        source={require("../../images/auth_bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={2}
      /> */}

      <View style={styles.container}>
        <BackButton iconSize={28} />

        {/* Animated Title */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headingWrapper}>
          <Text style={styles.gradientHeader}>Let’s</Text>
          <Text style={styles.gradientHeader}>Get Started</Text>
        </Animated.View>

        {/* Form */}
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

        {/* Footer */}
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
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.6,
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