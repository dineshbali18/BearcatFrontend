import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Alert,
} from "react-native";
import Colors from "@/constants/Colors";
import { IncomeType, SavingsGoalType } from "@/types";
import {
  DollarIcon,
  WalletAddMoneyIcon,
  WalletCardIcon,
} from "@/constants/Icons";
import { Feather } from "@expo/vector-icons";

const dummySavingsGoals: SavingsGoalType[] = [
  { id: "1", name: "Emergency Fund" },
  { id: "2", name: "Vacation" },
  { id: "3", name: "New Laptop" },
];

const IncomeBlock = ({ incomeList }: { incomeList: IncomeType[] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoalType | null>(null);
  const [selectedIncome, setSelectedIncome] = useState<IncomeType | null>(null);

  // Handle the three-dot menu click
  const handleMenuClick = (income: IncomeType) => {
    setSelectedIncome(income);
    setModalVisible(true);
  };

  // Simulate updating the savings goal
  const handleConfirm = () => {
    if (!selectedGoal || !selectedIncome) {
      Alert.alert("Error", "Please select a savings goal.");
      return;
    }

    Alert.alert(
      "Success",
      `Added ${selectedIncome.amount} to ${selectedGoal.name}!`
    );

    handleCloseModal();
  };

  // Handle modal close and reset selection
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedGoal(null);
    setSelectedIncome(null);
  };

  const renderItem: ListRenderItem<IncomeType> = ({ item }) => {
    let iconSource = DollarIcon;
    if (item.name === "Freelancing") {
      iconSource = WalletCardIcon;
    } else if (item.name === "Interest") {
      iconSource = WalletAddMoneyIcon;
    }

    const amount = item.amount.split(".");

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <Image
              source={iconSource}
              style={{ width: 22, height: 22, tintColor: Colors.white }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity onPress={() => handleMenuClick(item)}>
            <Feather name="more-horizontal" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.amountText}>
          ${amount[0]}.
          <Text style={styles.centsText}>{amount[1]}</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        My <Text style={styles.boldText}>Income</Text>
      </Text>
      <FlatList
        data={incomeList}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Modal for selecting savings goal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button (X) */}
            <TouchableOpacity style={styles.closeIcon} onPress={handleCloseModal}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Select a Savings Goal</Text>

            {dummySavingsGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalItem,
                  selectedGoal?.id === goal.id && styles.selectedGoal,
                ]}
                onPress={() => setSelectedGoal(goal)}
              >
                <Text style={styles.goalText}>{goal.name}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IncomeBlock;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  headerText: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "700",
  },
  card: {
    backgroundColor: Colors.grey,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    width: 150,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: {
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 50,
    padding: 5,
    alignSelf: "flex-start",
  },
  amountText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  centsText: {
    fontSize: 12,
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  goalItem: {
    padding: 10,
    backgroundColor: "#222", // Dark color
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  selectedGoal: {
    backgroundColor: Colors.secondary,
  },
  goalText: {
    color: Colors.white, // White text for contrast
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.blue,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.red,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});
