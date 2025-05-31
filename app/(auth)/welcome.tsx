import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import AnimatedText from "react-native-reanimated";
import { BlurView } from "expo-blur";

import {
  FadeInDown,
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const WelcomePage = () => {
  const router = useRouter();
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const coinPositions = [20, 100, 180, 250, 330, 420];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackgroundImage(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper style={styles.screen}>
      <StatusBar style="light" />

      {/* Gradient Background */}
      <LinearGradient
        colors={["#1a002b", "#0f001f", "#000000"]}
        style={styles.gradientOverlay}
      />

      {/* Coin Rain Animation */}
      {coinPositions.map((left, index) => (
        <LottieView
          key={index}
          source={require("../../assets/lottie/coin_loop.json")}
          autoPlay
          loop
          style={[
            styles.coinAnimation,
            {
              left,
              width: 60,
              height: height,
              opacity: 0.8 - index * 0.1,
              top: -index * 20,
            },
          ]}
        />
      ))}

      {/* Background Image Fade-in */}
      {showBackgroundImage && (
        <Animated.Image
          source={require("../../images/w.png")}
          style={[
            styles.backgroundImage,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              }),
            },
          ]}
          resizeMode="cover"
        />
      )} 

      {/* Title Section */}
      
      <View style={styles.titleContainer}>
        <AnimatedText.Text
          entering={FadeInDown.duration(500)}
          style={styles.welcomeLabel}
        >
          💫 Welcome to
        </AnimatedText.Text>

        <AnimatedText.Text
          entering={FadeInDown.duration(800).delay(200).springify()}
          style={styles.brandName}
        >
          Jack Pick
        </AnimatedText.Text>

        <AnimatedText.Text
          entering={FadeInDown.duration(800).delay(400)}
          style={styles.subtitle}
        >
          Spin big. Win bigger.
        </AnimatedText.Text>
      </View>

      {/* CTA Gradient Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#A259FF", "#FF6EC7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.getStartedButton}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
      onPress={() => router.push("/(auth)/login")}
      activeOpacity={0.9}
      style={styles.signInWrapper}
    >
      <LinearGradient
        colors={["#A259FF", "#FF6EC7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.signInButton}
      >
        <Text style={styles.signInText}>Sign In</Text>
      </LinearGradient>
    </TouchableOpacity>

    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0015",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 60,
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    width,
    height,
    top: 0,
    left: 0,
    zIndex: -2,
  },
  backgroundImage: {
    position: "absolute",
    width,
    height,
    top: 0,
    left: 0,
    zIndex: -1,
  },
  coinAnimation: {
    position: "absolute",
    zIndex: 0,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: height * 0.63,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.25)",  // translucent behind text
    borderRadius: 20,
    paddingVertical: 8,
  },
  
  welcomeLabel: {
    color: "#FFD56B", // golden amber
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "#FCE68C",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontFamily: "JosefinSans-SemiBold",
    marginBottom: 4,
    letterSpacing: 1,
  },
  
  brandName: {
    color: "#FF8DF4",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 2,
    fontFamily: "Poppins",
    textAlign: "center",
    marginBottom: 6,
  },
  
  subtitle: {
    color: "#D4C2FF", // soft violet-silver
    fontSize: 15,
    fontWeight: "500",
    textShadowColor: "#CBAEFF",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: "JosefinSans-SemiBold",
    textAlign: "center",
  },
  
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 25,
    marginBottom: 40,
    alignItems: "center",
  },
  getStartedButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#A259FF",
    shadowColor: "#FFB6C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  signInWrapper: {
    position: "absolute",
    top: 45,
    right: 30,
  },
  
  signInButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#A259FF",
    shadowColor: "#FFB6C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  
  signInText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  
});

export default WelcomePage;
