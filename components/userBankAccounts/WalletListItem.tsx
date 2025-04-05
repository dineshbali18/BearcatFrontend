import { StyleSheet, FlatList, View, TouchableOpacity, Modal, Button } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { colors, spacingY, radius } from "@/constants/theme";
import Typo from "../Typo";
import { format } from "date-fns"; // For date formatting
import { FontAwesome } from '@expo/vector-icons'; // For icons
import { useSelector } from "react-redux";
import Constants from 'expo-constants';
import ManageBankTransactions from "./ManageBankTransactions";

const API_BASE_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002`;

const WalletListItem = ({check}) => {
  const [userAccounts, setUserAccounts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userState = useSelector((state) => state.user);
  const userId = userState.user.id;

  useEffect(() => {
    fetchUserAccounts();
  }, []); // Fetch only once on mount

  

  const fetchUserAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userBankAccount`, {
        headers: { Authorization: `Bearer ${userState?.token}` },
      });
      // console.log("SSSS",response.data)
      setUserAccounts(response.data);
    } catch (error) {
      console.error("Error fetching user accounts:", error);
      setError("Failed to fetch accounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (item) => {
    setSelectedAccount(item);
    setModalVisible(true); // Open modal when card is clicked
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedAccount(null);
  };

  const formatCardNumber = (number) => {
    if (!number) return "XXXX XXXX XXXX XXXX";
    return number.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const renderItem = ({ item }) => {
    const formattedDate = item.updatedAt
      ? format(new Date(item.updatedAt), "MMM dd, yyyy hh:mm a")
      : "N/A";

    return (
      <TouchableOpacity 
        onPress={() => handleCardClick(item)}
        style={styles.cardContainer}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome name="bank" size={30} color={colors.white} style={styles.cardIcon} />
            <View style={styles.cardInfo}>
              <Typo size={20} weight="bold" color={colors.white}>{item.BankName || "Unknown Bank"}</Typo>
              <Typo size={16} color={colors.white}>{formatCardNumber(item.AccountNumber)}</Typo>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Typo size={14} color={colors.white} style={styles.cardLabel}>Card Number</Typo>
              <Typo size={16} color={colors.white}>{item.UserName || "XXXX XXXX XXXX XXXX"}</Typo>
            </View>
            <View style={styles.cardRow}>
              <Typo size={14} color={colors.white} style={styles.cardLabel}>Expires</Typo>
              <Typo size={16} color={colors.white}>{item.ExpirationDate || "XX/XX"}</Typo>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Typo size={12} color={colors.white}>Last Updated: {formattedDate}</Typo>
          </View>
        </View>
      </TouchableOpacity>
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

      {/* ManageBankTransactions Modal */}
      {modalVisible && selectedAccount && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
              <Typo size={20} color={colors.white}>X</Typo>
            </TouchableOpacity>
            <ManageBankTransactions 
              savings={Array.isArray(selectedAccount) ? selectedAccount : [selectedAccount]}
              fetchSaving={fetchUserAccounts} 
              onClose={handleModalClose} 
              setSavings={setUserAccounts}
            />
          </View>
        </View>
      )}
    </View>
  );
};

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
    backgroundColor: "#A833FF",
    padding: spacingY._20,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: colors.white,
    padding: spacingY.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
});
export default WalletListItem;
