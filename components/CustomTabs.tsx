import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { colors, spacingY } from "@/constants/theme";

function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabbarIcons: any = {
    home: (isFocused: boolean) => (
      <Icons.House
        size={verticalScale(26)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    bets: (isFocused: boolean) => (
      <Icons.ArrowsLeftRight
        size={verticalScale(26)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    winners: (isFocused: boolean) => (
      <Icons.Trophy
        size={verticalScale(26)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocused: boolean) => (
      <Icons.User
        size={verticalScale(26)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    help: (isFocused: boolean) => (
      <Icons.Question
        size={verticalScale(26)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            testID={`tab-${route.name}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            <View style={styles.iconWithLabel}>
              {tabbarIcons[route.name]?.(isFocused)}
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.primary : colors.neutral400 },
                ]}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(60),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  tabbarItem: {
    marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  iconWithLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: scale(10),
    marginTop: verticalScale(2),
    fontWeight: "500",
  },
});

export default CustomTabs;
