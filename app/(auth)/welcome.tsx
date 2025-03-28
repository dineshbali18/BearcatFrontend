import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import Button from "@/components/Button";

const WelcomePage = () => {
  const router = useRouter();
  
  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Login & Image */}
        <View>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")} style={styles.loginButton}>
            <Text style={[styles.signInText, { fontWeight: "500" }]}>Sign in</Text>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(500)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Text style={[styles.footerText, { fontSize: 30, fontWeight: "800" }]}>
              Always take control
            </Text>
            <Text style={[styles.footerText, { fontSize: 30, fontWeight: "800" }]}>
              of your finances
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(100).springify().damping(12)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Text style={[styles.footerText, { fontSize: 17, color: colors.textLighter }]}>
              Finances must be arranged to set a better
            </Text>
            <Text style={[styles.footerText, { fontSize: 17, color: colors.textLighter }]}>
              lifestyle in future
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(200).springify().damping(12)}
            style={styles.buttonContainer}
          >
            <Button onPress={() => router.push("/(auth)/register")}>
              <Text style={[styles.buttonText, { fontSize: 22, fontWeight: "600" }]}>
                Get Started
              </Text>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  signInText: {
    color: colors.text,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  footerText: {
    color: colors.text,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
  buttonText: {
    color: colors.neutral900,
  },
});

export default WelcomePage;
