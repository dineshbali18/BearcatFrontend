import { StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import CustomTabs from "@/components/CustomTabs";

const _layout = () => {
  return (
    <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="bets" />
      <Tabs.Screen name="winners" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="help" />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
