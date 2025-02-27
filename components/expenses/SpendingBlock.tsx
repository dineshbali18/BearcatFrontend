import React, { useState, useEffect } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

// Define types
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

const API_BASE_URL = "http://18.117.93.67:3002";

const SpendingBlock = () => {
  const [spendingList, setSpendingList] = useState<Expense[]>([]);
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
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expense/expenses/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data?.categorizedExpenses) {
        const debits = data.categorizedExpenses.flatMap((category: any) =>
          category.expenses.filter((expense: Expense) => expense.TransactionType === "Debit")
        );
        setSpendingList(debits);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      Alert.alert("Error", "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

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
      if (Array.isArray(data)) {
        setBudgets(data);
      } else {
        setBudgets([]);
      }
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

  const renderItem: ListRenderItem<Expense> = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.expenseName}>{item.CategoryName}</Text>
          <TouchableOpacity onPress={() => openModal(item)}>
            <Feather name="more-horizontal" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.amountText}>${parseFloat(item.Amount).toFixed(2)}</Text>
        <Text style={styles.description}>{item.Description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        My <Text style={styles.boldText}>Spending</Text>
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.black} />
      ) : spendingList.length > 0 ? (
        <FlatList data={spendingList} renderItem={renderItem} showsHorizontalScrollIndicator={false} />
      ) : (
        <Text style={styles.noSpendingText}>No debit transactions found.</Text>
      )}

      {/* Modal for transaction details */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedSpending && (
              <>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <Text style={styles.modalText}>Category: {selectedSpending.CategoryName}</Text>
                <Text style={styles.modalText}>Amount: ${parseFloat(selectedSpending.Amount).toFixed(2)}</Text>
                <Text style={styles.modalText}>Description: {selectedSpending.Description}</Text>
                <Text style={styles.modalText}>Date: {selectedSpending.Date}</Text>

                {/* Budgets Picker */}
                <Text style={styles.modalTitle}>Select a Budget</Text>
                {isLoadingBudgets ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
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
                )}

                <TouchableOpacity style={styles.addButton} onPress={handleAddToBudget} disabled={isSaving}>
                  <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Add to Budget"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
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
  container: { padding: 15, backgroundColor: Colors.background, flex: 1 },
  headerText: { fontSize: 18, fontWeight: "bold", color: Colors.white, marginBottom: 10 },
  boldText: { fontWeight: "bold", color: Colors.primary },
  noSpendingText: { textAlign: "center", color: Colors.white, fontSize: 16, marginTop: 20 },
  
  card: { 
    backgroundColor: Colors.card, 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 5 
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  expenseName: { fontSize: 16, fontWeight: "bold", color: Colors.white },
  amountText: { fontSize: 18, fontWeight: "bold", color: Colors.primary, marginVertical: 5 },
  description: { fontSize: 14, color: Colors.white, fontStyle: "italic" },

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "85%", backgroundColor: Colors.white, padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: Colors.black, marginBottom: 10 },
  modalText: { fontSize: 16, color: Colors.black, marginBottom: 5 },
  picker: { width: "100%", backgroundColor: Colors.lightGray, borderRadius: 8, marginBottom: 15 },
  
  addButton: { backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
  closeButton: { backgroundColor: Colors.gray, paddingVertical: 10, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },
});

