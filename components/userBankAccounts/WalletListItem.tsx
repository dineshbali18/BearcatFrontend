import { StyleSheet, FlatList, View, TouchableOpacity, Modal, Button } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { colors, spacingY, radius } from "@/constants/theme";
import Typo from "../Typo";
import { format } from "date-fns"; // For better date formatting
import { FontAwesome } from '@expo/vector-icons'; // For iconography
import { useSelector } from "react-redux";

const API_BASE_URL = "http://18.117.93.67:3002";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZGluZXNoYmFsaTQ1QGdtYWlsLmNvbSIsImlhdCI6MTc0MDMyNzc0OCwiZXhwIjoxNzQwMzQ1NzQ4fQ.JctxMVd1_q38AZ-jXxurQexFHb756YToxHrswYDQgPU";

const WalletListItem = () => {
  const [userAccounts, setUserAccounts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userState = useSelector((state) => state.user); // Assume user is a JSON string
  const userId = userState.user.id
  

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/userBankAccount/`, {
          headers: { Authorization: `Bearer ${userState?.token}` },
        });
        setUserAccounts(response.data);
      } catch (error) {
        console.error("Error fetching user accounts:", error);
        setError("Failed to fetch accounts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAccounts();
  });

  const handleThreeDotsClick = (account) => {
    setSelectedAccount(account);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedAccount(null);
  };

  // Helper function to format account number (e.g., XXXX XXXX XXXX 1234)
  const formatCardNumber = (number) => {
    if (!number) return "XXXX XXXX XXXX XXXX";
    return number.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const renderItem = ({ item }) => {
    const formattedDate = item.updatedAt
      ? format(new Date(item.updatedAt), "MMM dd, yyyy hh:mm a")
      : "N/A";

    return (
      <View style={styles.cardContainer}>
        {/* ATM Card Design */}
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <FontAwesome name="bank" size={30} color={colors.white} style={styles.cardIcon} />
            <View style={styles.cardInfo}>
              <Typo size={20} weight="bold" color={colors.white}>{item.BankName || "Unknown Bank"}</Typo>
              <Typo size={16} color={colors.white}>{formatCardNumber(item.AccountNumber)}</Typo>
            </View>
            <TouchableOpacity onPress={() => handleThreeDotsClick(item)}>
              <FontAwesome name="ellipsis-v" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Typo size={14} color={colors.white} style={styles.cardLabel}>Card Number</Typo>
              <Typo size={16} color={colors.white}>{item.UserName || "XXXX XXXX XXXX XXXX"}</Typo>
            </View>
            <View style={styles.cardRow}>
              <Typo size={14} color={colors.white} style={styles.cardLabel}>Expires</Typo>
              <Typo size={16} color={colors.white}>{item.ExpirationDate || "XX/XX"}</Typo>
            </View>
            <View style={styles.cardRow}>
              <Typo size={14} color={colors.white} style={styles.cardLabel}>CVV</Typo>
              <Typo size={16} color={colors.white}>XXX</Typo>
            </View>
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <Typo size={12} color={colors.white}>Last Updated: {formattedDate}</Typo>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Typo size={14} color={colors.neutral500}>Loading...</Typo>
      ) : error ? (
        <Typo size={14} color={colors.danger}>{error}</Typo>
      ) : userAccounts.length > 0 ? (
        <FlatList
          data={userAccounts}
          renderItem={renderItem}
          keyExtractor={(item) => item.AccountID?.toString() || item.AccountNumber}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Typo size={14} color={colors.neutral500}>No accounts found.</Typo>
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
              Account: {formatCardNumber(selectedAccount?.AccountNumber)}
            </Typo>

            {/* CRUD Options */}
            <Button title="Edit" onPress={() => { /* Handle Edit */ }} color={colors.primary} />
            <Button title="Delete" onPress={() => { /* Handle Delete */ }} color={colors.danger} />
            <Button title="Cancel" onPress={handleModalClose} color={colors.neutral500} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacingY.md,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacingY.md,
  },
  cardContainer: {
    marginBottom: spacingY.md,
    marginHorizontal: spacingY.md,
  },
  card: {
    backgroundColor: "#A833FF", // Dark background for card
    padding: spacingY._20, // Increased padding for spaciousness
    borderRadius: radius._10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.neutral300,
    margin: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY.sm,
  },
  cardIcon: {
    marginRight: spacingY._20,
  },
  cardInfo: {
    flex: 1,
  },
  cardBody: {
    marginBottom: spacingY.sm,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacingY.sm,
  },
  cardLabel: {
    opacity: 0.8,
  },
  cardFooter: {
    marginTop: spacingY.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: spacingY.md,
    borderRadius: radius.md,
    width: "80%",
    alignItems: "center",
  },
});
