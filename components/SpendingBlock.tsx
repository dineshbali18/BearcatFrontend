import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SpendingType, BudgetType } from "@/types";
import Colors from "@/constants/Colors";
import {
  AirbnbIcon,
  AmazonIcon,
  DollarIcon,
  FigmaIcon,
  NetflixIcon,
  ShoopingCartIcon,
  SpotifyIcon,
} from "@/constants/Icons";
import { Feather } from "@expo/vector-icons";

const dummyBudgets: BudgetType[] = [
  { id: "1", name: "Entertainment" },
  { id: "2", name: "Groceries" },
  { id: "3", name: "Utilities" },
];

const SpendingBlock = ({ spendingList }: { spendingList: SpendingType[] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetType | null>(null);
  const [selectedSpending, setSelectedSpending] = useState<SpendingType | null>(null);

  const handleMenuClick = (spending: SpendingType) => {
    setSelectedSpending(spending);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (!selectedBudget || !selectedSpending) {
      Alert.alert("Error", "Please select a budget.");
      return;
    }

    Alert.alert("Success", `Added ${selectedSpending.amount} to ${selectedBudget.name}!`);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBudget(null);
    setSelectedSpending(null);
  };

  return (
    <View style={styles.spendingSectionWrapper}>
      <Text style={styles.sectionTitle}>
        July <Text style={{ fontWeight: "700" }}>Spending</Text>
      </Text>
      {spendingList.map((item) => {
        let iconSource = DollarIcon;
        if (item.name === "AirBnB Rent") {
          iconSource = AirbnbIcon;
        } else if (item.name === "Netflix") {
          iconSource = NetflixIcon;
        } else if (item.name === "Spotify") {
          iconSource = SpotifyIcon;
        } else if (item.name === "Amazon") {
          iconSource = AmazonIcon;
        } else if (item.name === "Figma") {
          iconSource = FigmaIcon;
        } else if (item.name === "Online Shopping") {
          iconSource = ShoopingCartIcon;
        }

        return (
          <View style={styles.spendingWrapper} key={item.id}>
            <View style={styles.iconWrapper}>
              <Image source={iconSource} style={styles.icon} resizeMode="contain" />
            </View>
            <View style={styles.textWrapper}>
              <View style={{ gap: 5 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={{ color: Colors.white }}>{item.date}</Text>
              </View>
              <View style={styles.rightWrapper}>
                <Text style={styles.itemName}>${item.amount}</Text>
                <TouchableOpacity onPress={() => handleMenuClick(item)}>
                  <Feather name="more-horizontal" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeIcon} onPress={handleCloseModal}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select a Budget</Text>
            {dummyBudgets.map((budget) => (
              <TouchableOpacity
                key={budget.id}
                style={[styles.budgetItem, selectedBudget?.id === budget.id && styles.selectedBudget]}
                onPress={() => setSelectedBudget(budget)}
              >
                <Text style={styles.budgetText}>{budget.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SpendingBlock;

const styles = StyleSheet.create({
  spendingSectionWrapper: { marginVertical: 20, alignItems: "flex-start" },
  sectionTitle: { color: Colors.white, fontSize: 16, marginBottom: 20 },
  spendingWrapper: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  iconWrapper: { backgroundColor: Colors.grey, padding: 15, borderRadius: 50, marginRight: 10 },
  icon: { width: 22, height: 22, tintColor: Colors.white },
  textWrapper: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rightWrapper: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemName: { color: Colors.white, fontSize: 16, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: Colors.white, padding: 20, borderRadius: 10, width: "80%", alignItems: "center", position: "relative" },
  closeIcon: { position: "absolute", top: 10, right: 10, padding: 5 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  budgetItem: { padding: 10, backgroundColor: "#222", marginVertical: 5, borderRadius: 5, width: "100%", alignItems: "center" },
  selectedBudget: { backgroundColor: Colors.secondary },
  budgetText: { color: Colors.white, fontSize: 16 },
  confirmButton: { marginTop: 10, padding: 10, backgroundColor: Colors.blue, borderRadius: 5, width: "100%", alignItems: "center" },
  confirmButtonText: { color: Colors.white, fontSize: 16 },
});
