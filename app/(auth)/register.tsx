import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
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
import Typo from "@/components/Typo";
import * as Icons from "phosphor-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';


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

    console.log("PPPP",phoneNumberRef.current)

    setLoading(true);
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailRef.current,
          password: passwordRef.current,
          username: nameRef.current,
          phoneNum: phoneNumberRef.current,
        }),
      });

      const res = await response.json();
      console.log("RESSS::::",res)
      console.log(res.status)
      setLoading(false);

      if (res.error != undefined) {

        Alert.alert("Register", res.error);
      } else {
        // Store user data locally using AsyncStorage
       // await AsyncStorage.setItem("userData", JSON.stringify(res.user));
        Alert.alert("Register", "Registration successful!");
        // Optionally, navigate to another screen:
        router.replace({ pathname: "/(auth)/mfa_register", params: { email: emailRef.current } });
      }
    } catch (error) {
      Alert.alert("Register", "An error occurred during registration.");
      console.error("Registration error:", error);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} />

        {/* Welcome */}
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Let's
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track your expenses
          </Typo>
          <Input
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your name"
            onChangeText={(value) => (nameRef.current = value)}
          />
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
              <Icons.Phone
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your phone number"
            onChangeText={(value) => (phoneNumberRef.current = value)}
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
          {/* Button */}
          <Button loading={loading} onPress={onSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Sign Up
            </Typo>
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Login
            </Typo>
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
