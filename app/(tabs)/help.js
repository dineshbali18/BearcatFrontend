import React, { useEffect, useState } from "react";
import { Linking, TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { useSelector } from 'react-redux';
const SupportScreen = () => {
  const [telegramLink, setTelegramLink] = useState('');

  const token = useSelector((state)=>state.user.token)

  useEffect(() => {
    fetchTelegramLink();
  }, []);

  const fetchTelegramLink = async () => {
    try {
      // const response = await fetch("http://api.jack-pick.online:3000/v1/user/telegram"); // Replace with your actual API base
      const response = await fetch("http://api.jack-pick.online:3000/v1/user/telegram", {
        method: "GET",
        headers: {
          "Authorization": `${token}`, // replace with your actual token
          "Accept": "application/json",
        },
      });
      const data = await response.json();

      if (data.telegram_link && data.telegram_link.startsWith("telegram:")) {
        const username = data.telegram_link.split(":")[1].trim();
        setTelegramLink(`https://t.me/${username}`);
      } else {
        throw new Error("Invalid format");
      }
    } catch (error) {
      console.error("Failed to load Telegram link", error);
      Alert.alert("Error", "Unable to load support link.");
    }
  };

  const openTelegramSupport = () => {
    if (telegramLink) {
      Linking.openURL(telegramLink);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Need Help?</Text>
      <Text style={styles.description}>
        Tap the button below to chat with our support team on Telegram.
      </Text>
      <Text style={styles.note}>
        ⏱️ For issues like payment failures or technical problems, our team typically responds within 2–24 hours.
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
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: "#999",
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
