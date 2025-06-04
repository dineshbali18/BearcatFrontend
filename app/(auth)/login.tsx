import React, { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CustomAlert from "@/components/customAlerts";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const showAlert = (title, message, type = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      showAlert("Login", "Please fill all the fields!", "error");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://api.jack-pick.online:3000/v1/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailRef.current.trim().toLowerCase(),
          password: passwordRef.current.trim(),
        }),
      });

      const resData = await response.json();

      if (response.status === 200) {
        const userData = {
          email_id: resData.email_id,
          user_id: resData.user_id,
          token: resData.token,
          name: resData.name,
          phone_number: resData.phone_number,
        };

        dispatch(setUser(userData));
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        showAlert("Success", "Login successful!", "success");
        router.replace("../(tabs)/home");
      } else {
        showAlert("Login Failed", resData.errorDescription || "Invalid credentials", "error");
      }
    } catch (error) {
      showAlert("Error", "A network error occurred", "error");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />

      <View style={styles.container}>
        <BackButton iconSize={28} onPress={() => router.replace("/(auth)/welcome")} />

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
      <CustomAlert
      visible={alertVisible}
      title={alertTitle}
      message={alertMessage}
      type={alertType}
      onClose={() => setAlertVisible(false)}
    />
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
