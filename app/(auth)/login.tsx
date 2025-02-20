import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import * as Icons from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import HomeCard from "@/components/HomeCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("dineshbali45@gmail.com");
  const passwordRef = useRef("gamer");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "please fill all the fields!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.194:3002/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "dineshbali45@gmail.com",
          password: "gamer"
        }),
      });
      emailRef.current = "dineshbali45@gmail.com"
      const res = await response.json();
      console.log("RESSS::::",res)
      setLoading(false);
      if (res.error != undefined) {

        Alert.alert("Login", res.error);
      } else {
        // Store user data locally using AsyncStorage
       await AsyncStorage.setItem("userData", JSON.stringify(res.user));
       
        Alert.alert("Login", "Login successful!");
        // Optionally, navigate to another screen:
        router.replace({ pathname: "/(auth)/mfa", params: { email: emailRef.current } });
      }
    }catch (error) {
      setLoading(false);
      Alert.alert("Login", "An error occurred during registration.");
      console.error("Registration error:", error);
    }

  //   setLoading(true);
  //  // const res = await login(emailRef.current, passwordRef.current);
  //   setLoading(false);
  //   if (!res.success) {
  //     Alert.alert("Login", res.msg);
  //   }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} />
        {/* welcome */}
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>
          <Input
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <View>
            <Pressable onPress={() => router.replace("/(auth)/resetPassword")}>
              <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
                Forgot Password?
              </Typo>
            </Pressable>
          </View>

          {/* button */}
          <Button loading={loading} onPress={onSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Login
            </Typo>
          </Button>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Dont't have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Sign up
            </Typo>
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
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
