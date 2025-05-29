import React from "react";
import { Linking, TouchableOpacity, Text, StyleSheet, View } from "react-native";

const SupportScreen = () => {
  const openTelegramSupport = () => {
    Linking.openURL("https://t.me/JackPickSupport");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Need Help?</Text>
      <Text style={styles.description}>
        Tap the button below to chat with our support team on Telegram.
      </Text>

      <TouchableOpacity style={styles.telegramButton} onPress={openTelegramSupport}>
        <Text style={styles.telegramButtonText}>💬 Chat on Telegram</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  telegramButton: {
    backgroundColor: "#0088cc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 40,
  },
  telegramButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
