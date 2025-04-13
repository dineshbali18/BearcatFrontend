import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import Constants from 'expo-constants';

interface Expense {
  ExpenseID: number;
  CategoryID: number;
  CategoryName: string;
  Amount: string;
  Description: string;
  TransactionType: string;
  Merchandise: string;
  Date: string;
}

interface Budget {
  BudgetID: number;
  BudgetName: string;
}

const API_BASE_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002`;

const SpendingBlock = ({ spendingList }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpending, setSelectedSpending] = useState<Expense | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.id;
  const token = userState?.token;

  useEffect(() => {
    console.log("My Spending ---- ", spendingList);
  }, [spendingList]);

  const fetchBudgets = async () => {
    setIsLoadingBudgets(true);
    try {
      const response = await fetch(`${API_BASE_URL}/budget/user/${userId}/budgets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      Alert.alert("Error", "Failed to load budgets.");
    } finally {
      setIsLoadingBudgets(false);
    }
  };

  const handleAddToBudget = async () => {
    if (!selectedSpending || !selectedBudget) {
      Alert.alert("Error", "Please select a budget.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/expense/expenses/${selectedSpending.ExpenseID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ BudgetID: selectedBudget }),
      });

      if (!response.ok) throw new Error("Failed to update expense.");

      Alert.alert("Success", "Expense added to budget successfully.");
      setModalVisible(false);
      setSelectedBudget(null);
    } catch (error) {
      console.error("Error updating expense:", error);
      Alert.alert("Error", "Failed to add expense to budget.");
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (expense: Expense) => {
    setSelectedSpending(expense);
    setModalVisible(true);
    fetchBudgets();
  };

  // Function to group spending by date
  const groupSpendingByDate = (spendingList: Expense[]) => {
    const grouped: { [key: string]: Expense[] } = {};

    spendingList.forEach((item: Expense) => {
      const date = item.Date.split("T")[0]; // Use the date part (YYYY-MM-DD)
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    return grouped;
  };

  const groupedSpending = groupSpendingByDate(spendingList);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        My <Text style={styles.boldText}>Spending</Text>
      </Text>

      {Object.keys(groupedSpending).length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {Object.keys(groupedSpending).map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              {groupedSpending[date].map((item: Expense) => (
                <TouchableOpacity
                  key={item.ExpenseID}
                  style={styles.card}
                  onPress={() => openModal(item)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.expenseName}>{item.CategoryName}</Text>
                    <Feather name="more-horizontal" size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.amountText}>${parseFloat(item.Amount).toFixed(2)}</Text>
                  <Text style={styles.description}>{item.Description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noSpendingText}>No debit transactions found.</Text>
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedSpending && (
              <>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <Text style={styles.modalText}>Category: {selectedSpending.CategoryName}</Text>
                <Text style={styles.modalText}>Amount: ${parseFloat(selectedSpending.Amount).toFixed(2)}</Text>
                <Text style={styles.modalText}>Description: {selectedSpending.Description}</Text>

                <Text style={styles.modalTitle}>Select a Budget</Text>
                {isLoadingBudgets ? (
                  <ActivityIndicator size="small" color={Colors.blue} />
                ) : (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedBudget}
                      onValueChange={(itemValue) => setSelectedBudget(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select a Budget" value={null} />
                      {budgets.map((budget) => (
                        <Picker.Item key={budget.BudgetID} label={budget.BudgetName} value={budget.BudgetID} />
                      ))}
                    </Picker>
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddToBudget} disabled={isSaving}>
                    <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Add to Budget"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SpendingBlock;

const styles = StyleSheet.create({
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)", // Semi-transparent background
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white", // Dark background for modal (adjust as needed)
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10, // Shadow effect for Android
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black", // White text color
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "black", // White text color
    marginBottom: 5,
    textAlign: "center",
  },
  pickerContainer: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "black", // Ensures a black border
    backgroundColor: "white", // Keeps a clean white background
    marginVertical: 10,
    overflow: "hidden", // Prevents overflow issues
  },
  
  picker: {
    width: "100%",
    color: "black", // Ensures text is visible
    paddingHorizontal: 10, // Adds spacing
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#4CAF50", // Green color for the add button
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#D32F2F", // Red color for the close button
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFFFFF", // White text for buttons
    fontSize: 16,
    fontWeight: "bold",
  },
  card: { 
    backgroundColor: Colors.card, 
    padding: 15, 
    borderRadius: 12, 
    marginVertical: 8, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 6 
  },
  container: {
    padding: 15,
    backgroundColor: Colors.background,
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 15,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.primary,
  },
  noSpendingText: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 16,
    marginTop: 20,
  },
  cardContainer: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  card: {
    padding: 18,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  amountText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f1c40f",
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: Colors.white,
    fontStyle: "italic",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateText: {
    fontSize: 13,
    color: "#ecf0f1",
  },
});
