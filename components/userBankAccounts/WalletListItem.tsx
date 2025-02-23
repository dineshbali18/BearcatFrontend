import { StyleSheet, ScrollView, View, TouchableOpacity, Modal, Button } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { colors, spacingY, radius } from "@/constants/theme";
import Typo from "../Typo";
import { format } from "date-fns"; // For better date formatting
import { FontAwesome } from '@expo/vector-icons'; // For iconography

const API_BASE_URL = "http://192.168.1.194:3002";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZGluZXNoYmFsaTQ1QGdtYWlsLmNvbSIsImlhdCI6MTc0MDMwOTY5NywiZXhwIjoxNzQwMzI3Njk3fQ.Cz9nPhtbHUzfPE5MB_mHBARiXq9WucdMEB1Uv_6CNxo";

const WalletListItem = () => {
  const [userAccounts, setUserAccounts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/userBankAccount/`, {
          headers: { Authorization: AUTH_TOKEN },
        });

        console.log("Fetched Accounts:1111", response.data.length); // ✅ Debugging step
        setUserAccounts(response.data); // ✅ Correct state update
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };

    fetchUserAccounts();
  }, []); // ✅ Ensures API is called only once

  const handleThreeDotsClick = (account) => {
    setSelectedAccount(account);
    setModalVisible(true); // Show modal when three dots are clicked
  };

  const handleModalClose = () => {
    setModalVisible(false); // Close modal
    setSelectedAccount(null); // Reset selected account
  };

  return (
    <ScrollView style={styles.container}>
      {userAccounts.length > 0 ? (
        userAccounts.map((account) => {
          const maskedAccountNumber = `****${account.AccountNumber.slice(-4)}`;
          const formattedDate = account.updatedAt
            ? format(new Date(account.updatedAt), "MMM dd, yyyy hh:mm a")
            : "N/A";

          return (
            <View key={account.AccountID || account.AccountNumber} style={styles.accountItem}>
              {/* Account Info Section */}
              <View style={styles.row}>
                <FontAwesome name="bank" size={24} color={colors.primary} style={styles.icon} />
                <View style={styles.bankInfo}>
                  <Typo size={18} weight="bold">{account.BankName || "Unknown Bank"}</Typo>
                  <Typo size={14} color={colors.neutral400}>{maskedAccountNumber}</Typo>
                </View>
                {/* Three dots icon for CRUD actions */}
                <TouchableOpacity onPress={() => handleThreeDotsClick(account)}>
                  <FontAwesome name="ellipsis-v" size={20} color={colors.neutral500} />
                </TouchableOpacity>
              </View>

              {/* Last Updated Section */}
              <View style={styles.lastUpdated}>
                <Typo size={12} color={colors.neutral500}>Last Updated: {formattedDate}</Typo>
              </View>
            </View>
          );
        })
      ) : (
        <Typo size={14} color={colors.neutral500}>No accounts found.</Typo> // Display a message if no accounts exist
      )}

      {/* Modal for CRUD actions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Typo size={18} weight="bold">Manage Account</Typo>
            <Typo size={14} color={colors.neutral400}>
              Bank: {selectedAccount?.BankName || "Unknown Bank"}
            </Typo>
            <Typo size={14} color={colors.neutral400}>
              Account: {selectedAccount?.AccountNumber}
            </Typo>

            {/* CRUD Options */}
            <Button title="Edit" onPress={() => { /* Handle Edit */ }} color={colors.primary} />
            <Button title="Delete" onPress={() => { /* Handle Delete */ }} color={colors.danger} />
            <Button title="Cancel" onPress={handleModalClose} color={colors.neutral500} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    padding: spacingY.md,
    backgroundColor: colors.background, // Set background color for better contrast
  },
  accountItem: {
    backgroundColor: colors.neutral900,
    padding: spacingY.md,
    marginBottom: spacingY.sm,
    borderRadius: radius.md,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: spacingY.md, // Add horizontal margins to give more space around the card
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY.sm, // Ensure there's space below the icon/text row
  },
  icon: {
    marginRight: spacingY.sm, // Space between the icon and bank name
  },
  bankInfo: {
    flex: 1, // Ensures that text takes the available space
    justifyContent: "center",
  },
  lastUpdated: {
    marginTop: spacingY.sm,
    paddingLeft: spacingY.md,
    paddingRight: spacingY.md,
    marginBottom: spacingY.sm, // Add space after last updated text
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay background
  },
  modalContainer: {
    backgroundColor: colors.primary, // Violet background for popup
    padding: spacingY.md,
    borderRadius: radius.md,
    width: "80%",
    alignItems: "center",
  },
});
