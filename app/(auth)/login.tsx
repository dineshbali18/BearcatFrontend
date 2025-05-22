import React, { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import * as Icons from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Constants from "expo-constants";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3000/v1/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailRef.current,
          password: passwordRef.current,
        }),
      });

      const res = await response.json();
      setLoading(false);

      if (res.error) {
        Alert.alert("Login", res.error);
      } else {
        dispatch(setUser({
          user: res.user,
          token: res.token,
          message: res.message,
        }));

        await AsyncStorage.setItem("userData", JSON.stringify(res.user));

        Alert.alert("Login", "Login successful!");
        router.replace(`/(auth)/mfa?email=${encodeURIComponent(emailRef.current)}`);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Login", "An error occurred during login.");
      console.log("Login error:", error);
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

        <Animated.View entering={FadeInDown.duration(600)} style={styles.headingWrapper}>
          <Text style={styles.gradientHeader}>Hey,</Text>
          <Text style={styles.gradientHeader}>Welcome Back</Text>
        </Animated.View>

        <View style={styles.form}>
          <Text style={styles.subtitleText}>Login now to track all your expenses</Text>

          <Animated.View entering={FadeInDown.delay(100)}>
            <Input
              icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
              placeholder="Enter your email"
              onChangeText={(value) => (emailRef.current = value)}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Input
              icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
            />
          </Animated.View>

          <Pressable onPress={() => router.replace("/(auth)/resetPassword")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>

          <Animated.View entering={FadeInDown.delay(300)}>
            <Button testID="loginButton" loading={loading} onPress={onSubmit} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Login</Text>
            </Button>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.navigate("/(auth)/register")}> 
            <Text style={styles.linkText}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
    marginTop: 5,
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