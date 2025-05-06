import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import WalletListItem from "@/components/userBankAccounts/WalletListItem";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { useSelector } from "react-redux";
import Constants from "expo-constants";

const API_BASE_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002`;

const Wallet = () => {
  const router = useRouter();
  const userData = useSelector((state) => state.user);

  const [isModalVisible, setModalVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [check, setCheck] = useState(0);
  const [supportMessage, setSupportMessage] = useState("");

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bankDetails`);
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleAddBankAccount = async () => {
    if (!selectedBank || !accountNumber) return;

    const newAccount = {
      UserID: userData?.user?.id,
      bankName: selectedBank?.BankName,
      AccountNumber: accountNumber,
      BankID: selectedBank?.BankID,
    };

    try {
      await axios.post(`${API_BASE_URL}/userBankAccount/`, newAccount);
      setModalVisible(false);
      setAccountNumber("");
      setSelectedBank(null);
      setCheck((prev) => prev + 1); // To refresh WalletListItem
    } catch (error) {
      console.error("Error adding bank account:", error);
    }
  };

  const handleSendSupport = async () => {
    if (!supportMessage.trim()) {
      alert("Please enter a message.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/support/message`, {
        userId: userData?.user?.id,
        message: supportMessage,
      });
      alert("Message sent to admin.");
      setSupportMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Support Section */}
          <View style={styles.supportContainer}>
            <Typo size={18} fontWeight="600" style={{ color: "#fff", marginBottom: 10 }}>
              Contact Support
            </Typo>
            <TextInput
              style={styles.supportInput}
              placeholder="Enter your message..."
              placeholderTextColor="#ccc"
              multiline
              value={supportMessage}
              onChangeText={setSupportMessage}
              numberOfLines={5}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendSupport}>
              <Text style={styles.sendButtonText}>Send to Admin</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Add Bank Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bank Account</Text>

            <Text style={styles.label}>Select Bank:</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedBank(value)}
              items={banks.map((bank) => ({
                label: bank.BankName,
                value: bank,
              }))}
              placeholder={{ label: "Select a bank...", value: null }}
              style={pickerStyles}
            />

            <Text style={styles.label}>Account Number:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account number"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />

            <View style={styles.buttonRow}>
              <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Add Account" onPress={handleAddBankAccount} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: spacingX._20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._20,
  },
  supportContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: radius._12,
    padding: spacingX._15,
    marginTop: spacingY._30,
  },
  supportInput: {
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: radius._10,
    color: "#fff",
    padding: spacingX._15,
    marginBottom: spacingY._10,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius._10,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: spacingX._20,
    borderRadius: radius._12,
    width: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacingY._15,
  },
  label: { fontSize: 14, marginTop: spacingY._10 },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral500,
    padding: spacingX._10,
    borderRadius: radius._10,
    marginTop: spacingY._5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacingY._20,
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderRadius: radius._10,
    color: colors.black,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderRadius: radius._10,
    color: colors.black,
    paddingRight: 30,
  },
};
