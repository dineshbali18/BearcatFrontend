import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const MfaRegister = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const tempUser = useSelector((state) => state.tempUser);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOtpAndRegisterUser = async () => {
    // Null safety check
    if (
      !tempUser?.username ||
      !tempUser?.email ||
      !tempUser?.password ||
      !tempUser?.phoneNum
    ) {
      Alert.alert("Missing Info", "User registration info is incomplete. Please try again.");
      return;
    }

    if (!otp || otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter a 6-digit OTP code");
      return;
    }

    setLoading(true);

    const retry = async (fn, label) => {
      let attempt = 0;
      let lastError = null;
      while (attempt < 3) {
        const result = await fn();
        if (result.success) return { success: true };
        lastError = result.error;
        attempt++;
      }
      return { success: false, error: `${label} failed: ${lastError || "Unknown error"}` };
    };

    const registerUser = async () => {
      try {
        const res = await fetch("http://api.jack-pick.online:3000/v1/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: tempUser?.username ?? "",
            email: tempUser?.email ?? "",
            password: tempUser?.password ?? "",
            phone_number: tempUser?.phoneNum ?? "",
            Otp: otp ?? "",
          }),
        });
        const isSuccess = res.status >= 200 && res.status < 300;
        const result = isSuccess ? {} : await res.json();

        return {
          success: isSuccess,
          error: result?.error || (!isSuccess && "Registration failed"),
        };
      } catch {
        return { success: false, error: "Network error" };
      }
    };

    const registerResult = await retry(registerUser, "Registration");
    setLoading(false);

    if (!registerResult.success) {
      Alert.alert("❌ Error", registerResult.error);
      return;
    }

    Alert.alert("✅ Success", "Account created successfully!");
    router.replace("../(auth)/login");
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    if (!tempUser?.email) {
      Alert.alert("Missing Info", "Email not found. Please restart registration.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await fetch("http://api.otp.jack-pick.online:3001/api/user/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempUser.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setCountdown(60);
        Alert.alert("Success", "New OTP sent to your email");
      } else {
        Alert.alert("Error", data.error || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!tempUser?.email) return null; // Prevent rendering if no email

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} onPress={() => router.back()} />

        <Animated.View entering={FadeInDown.duration(600)} style={styles.headingWrapper}>
          <Text style={styles.gradientHeader}>Verify</Text>
          <Text style={styles.gradientHeader}>Your Email</Text>
        </Animated.View>

        <View style={styles.form}>
          <Text style={styles.subtitleText}>
            We've sent a 6-digit code to {tempUser?.email}
          </Text>

          <Animated.View entering={FadeInDown.delay(100)}>
            <Input
              icon={<Icons.Key size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Button
              testID="verifyButton"
              loading={loading}
              disabled={otp.length !== 6 || loading}
              onPress={handleVerifyOtpAndRegisterUser}
              style={styles.buttonStyle}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </Button>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.resendContainer}>
            {countdown > 0 ? (
              <Text style={styles.resendText}>Resend code in {countdown}s</Text>
            ) : (
              <Pressable onPress={handleResendOtp} disabled={resendLoading}>
                {resendLoading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text style={styles.resendLinkText}>Resend OTP</Text>
                )}
              </Pressable>
            )}
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default MfaRegister;

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
    marginBottom: spacingY._20,
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
  resendContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  resendText: {
    color: colors.neutral300,
    fontFamily: "JosefinSans-Regular",
  },
  resendLinkText: {
    color: "#FF8DF4",
    fontFamily: "JosefinSans-SemiBold",
    textDecorationLine: "underline",
  },
});

// import {
//   Alert,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   ActivityIndicator
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import ScreenWrapper from "../../components/ScreenWrapper";
// import { StatusBar } from "expo-status-bar";
// import { useRouter } from "expo-router";
// import BackButton from "@/components/BackButton";
// import Input from "@/components/Input";
// import Button from "@/components/Button";
// import { verticalScale } from "@/utils/styling";
// import { colors, spacingX, spacingY } from "@/constants/theme";
// import * as Icons from "phosphor-react-native";
// import Animated, { FadeInDown } from "react-native-reanimated";
// import { useDispatch, useSelector } from "react-redux";

// const { width, height } = Dimensions.get("window");

// const MfaRegister = () => {
//   const router = useRouter();
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [countdown, setCountdown] = useState(60);
//   const [resendLoading, setResendLoading] = useState(false);
//   const tempUser = useSelector((state) => state.tempUser);

//   // Countdown timer for resend OTP
//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   const handleVerifyOtpAndRegisterUser = async () => {
//     if (!otp || otp.length !== 6) {
//       Alert.alert("Invalid OTP", "Please enter a 6-digit OTP code");
//       return;
//     }
  
//     setLoading(true);
  
//     // Reusable retry helper
//     const retry = async (fn, label) => {
//       let attempt = 0;
//       let lastError = null;
//       while (attempt < 3) {
//         const result = await fn();
//         if (result.success) return { success: true };
//         lastError = result.error;
//         attempt++;
//       }
//       return { success: false, error: `${label} failed: ${lastError || "Unknown error"}` };
//     };
  

//     const registerUser = async () => {
//       try {
//         const res = await fetch("http://api.jack-pick.online:3000/v1/user/register", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: tempUser.username,
//             email: tempUser.email,
//             password: tempUser.password,
//             phone_number: tempUser.phoneNum,
//             Otp: otp,
//           }),
//         });
//         const isSuccess = res.status >= 200 && res.status < 300;

//         const result = isSuccess ? {} : await res.json();

//         return {
//           success: isSuccess,
//           error: result?.error || (!isSuccess && "Registration failed"),
//         };
//       } catch {
//         return { success: false, error: "Network error" };
//       }
//     };
  
//     const registerResult = await retry(registerUser, "Registration");
  
//     setLoading(false);
  
//     if (!registerResult.success) {
//       Alert.alert("❌ Error", registerResult.error);
//       return;
//     }
  
//     Alert.alert("✅ Success", "Account created successfully!");
//     router.replace("../(auth)/login");
//   };
  

//   const handleResendOtp = async () => {
//     if (countdown > 0) return;

//     setResendLoading(true);
//     try {
//       const response = await fetch("http://api.otp.jack-pick.online:3001/api/user/sendotp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: tempUser.email }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setCountdown(60);
//         Alert.alert("Success", "New OTP sent to your email");
//       } else {
//         Alert.alert("Error", data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Network error. Please try again.");
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <ScreenWrapper>
//       <StatusBar style="light" />
//       <View style={styles.container}>
//         <BackButton iconSize={28} onPress={() => router.back()} />

//         <Animated.View entering={FadeInDown.duration(600)} style={styles.headingWrapper}>
//           <Text style={styles.gradientHeader}>Verify</Text>
//           <Text style={styles.gradientHeader}>Your Email</Text>
//         </Animated.View>

//         <View style={styles.form}>
//           <Text style={styles.subtitleText}>
//             We've sent a 6-digit code to {tempUser?.email || "your email"}
//           </Text>

//           <Animated.View entering={FadeInDown.delay(100)}>
//             <Input
//               icon={<Icons.Key size={verticalScale(26)} color={colors.neutral300} weight="fill" />}
//               placeholder="Enter OTP"
//               keyboardType="number-pad"
//               maxLength={6}
//               value={otp}
//               onChangeText={setOtp}
//             />
//           </Animated.View>

//           <Animated.View entering={FadeInDown.delay(200)}>
//             <Button 
//               testID="verifyButton" 
//               loading={loading} 
//               onPress={handleVerifyOtpAndRegisterUser}
//               style={styles.buttonStyle}
//             >
//               <Text style={styles.buttonText}>Verify</Text>
//             </Button>
//           </Animated.View>

//           <Animated.View entering={FadeInDown.delay(300)} style={styles.resendContainer}>
//             {countdown > 0 ? (
//               <Text style={styles.resendText}>
//                 Resend code in {countdown}s
//               </Text>
//             ) : (
//               <Pressable 
//                 onPress={handleResendOtp}
//                 disabled={resendLoading}
//               >
//                 {resendLoading ? (
//                   <ActivityIndicator color={colors.primary} />
//                 ) : (
//                   <Text style={styles.resendLinkText}>Resend OTP</Text>
//                 )}
//               </Pressable>
//             )}
//           </Animated.View>
//         </View>
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default MfaRegister;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     gap: spacingY._30,
//     paddingHorizontal: spacingX._20,
//   },
//   headingWrapper: {
//     gap: 4,
//     marginTop: spacingY._20,
//   },
//   gradientHeader: {
//     fontSize: 32,
//     fontWeight: "900",
//     fontFamily: "Poppins",
//     letterSpacing: 1,
//     color: "#FF8DF4",
//     textShadowColor: "#FEC8FF",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 5,
//   },
//   subtitleText: {
//     color: "#D4C2FF",
//     fontSize: 15,
//     fontFamily: "JosefinSans-SemiBold",
//     marginBottom: spacingY._20,
//   },
//   form: {
//     gap: spacingY._20,
//   },
//   buttonStyle: {
//     backgroundColor: "#A259FF",
//     paddingVertical: 14,
//     borderRadius: 30,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "800",
//     letterSpacing: 0.5,
//     fontFamily: "Poppins",
//   },
//   resendContainer: {
//     alignItems: "center",
//     marginTop: spacingY._10,
//   },
//   resendText: {
//     color: colors.neutral300,
//     fontFamily: "JosefinSans-Regular",
//   },
//   resendLinkText: {
//     color: "#FF8DF4",
//     fontFamily: "JosefinSans-SemiBold",
//     textDecorationLine: "underline",
//   },
// });