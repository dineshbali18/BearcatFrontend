import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice"; // Ensure this path is correct
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import * as Icons from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Constants from 'expo-constants';
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
      console.log(`Àaaaaa ${Constants.expoConfig?.extra?.REACT_APP_API}:3002/user/login`)
      const apiUrl = String(Constants.expoConfig?.extra?.REACT_APP_API)+":3002/user/login";
      console.log(apiUrl)
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailRef.current,
          password: passwordRef.current,
        }),
      });

      const res = await response.json();
      console.log("Response:", res);
      setLoading(false);

      if (res.error) {
        Alert.alert("Login", res.error);
      } else {
        // Dispatch action to store user data in Redux store
        dispatch(setUser({
          user: res.user,
          token: res.token,
          message: res.message,
        }));

        // Store user data locally using AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(res.user));

        Alert.alert("Login", "Login successful!");

        // Optionally, navigate to another screen
        router.replace({ pathname: "/(auth)/mfa", params: { email: emailRef.current } });
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
            icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
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
          <Typo size={15}>Don't have an account?</Typo>
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});

export default Login;
