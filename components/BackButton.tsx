import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { colors, radius } from "@/constants/theme";
import { CaretLeft } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

export interface BackButtonProps {
  style?: ViewStyle;
  iconSize?: number;
  onPress?: () => void; // ✅ allow external onPress
}

const BackButton: React.FC<BackButtonProps> = ({ style, iconSize = 26, onPress }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())} // ✅ fallback to router.back()
      style={[styles.button, style]}
    >
      <CaretLeft
        size={verticalScale(iconSize)}
        color={colors.white}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
