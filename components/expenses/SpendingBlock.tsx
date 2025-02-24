import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useSelector } from "react-redux";

// Define types
interface SpendingType {
  ExpenseID: number;
  CategoryID: number;
  CategoryName: string;
  Amount: string;
  Description: string;
  TransactionType: string;
  Merchandise: string;
  Date: string;
}

interface BudgetType {
  id: string;
  name: string;
}

// Dummy budgets for selection
const dummyBudgets: BudgetType[] = [
  { id: "1", name: "Entertainment" },
  { id: "2", name: "Groceries" },
  { id: "3", name: "Utilities" },
];

const SpendingBlock = ({ userId, token }: { userId: string; token: string }) => {
  const [spendingList, setSpendingList] = useState<SpendingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetType | null>(null);
  const [selectedSpending, setSelectedSpending] = useState<SpendingType | null>(null);
  const userState = useSelector((state) => state.user); // Assume user is a JSON string
  userId = userState.user.id

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      // const userId = 1;
      // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImVtYWlsIjoiZGluZXNoYmFsaTQ1QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQwMTQzMjAzLCJleHAiOjE3NDAxNjEyMDN9.kxLSzczurDWiJB55wnaE_isjuJTcWHmgYWY8APmBGm0"
      const response = await fetch(`http://18.117.93.67:3002/expense/expenses/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState?.token}`,
        },      
      });

      const data = await response.json();
      console.log("{Data}::",data)
      if (response.ok && data.categorizedExpenses) {
        // Filter only debit transactions
        const debits = data.categorizedExpenses
          .flatMap((category: any) => category.expenses)
          .filter((expense: SpendingType) => expense.TransactionType === "Debit");

        setSpendingList(debits);
      } else {
        Alert.alert("Error", "Failed to fetch expenses.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching expenses.");
      console.log("ERRR:::",error)
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (spending: SpendingType) => {
    setSelectedSpending(spending);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (!selectedBudget || !selectedSpending) {
      Alert.alert("Error", "Please select a budget.");
      return;
    }

    Alert.alert("Success", `Added ${selectedSpending.Amount} to ${selectedBudget.name}!`);
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
        February <Text style={{ fontWeight: "700" }}>Spending</Text>
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.blue} />
      ) : spendingList.length > 0 ? (
        spendingList.map((item) => (
          <View style={styles.spendingWrapper} key={item.ExpenseID}>
            <View style={styles.textWrapper}>
              <View style={{ gap: 5 }}>
                <Text style={styles.itemName}>{item.CategoryName} - {item.Description}</Text>
                <Text style={{ color: Colors.white }}>{new Date(item.Date).toDateString()}</Text>
              </View>
              <View style={styles.rightWrapper}>
                <Text style={styles.itemName}>${item.Amount}</Text>
                <TouchableOpacity onPress={() => handleMenuClick(item)}>
                  <Feather name="more-horizontal" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={{ color: Colors.white, marginTop: 10 }}>No debit transactions found.</Text>
      )}

      {/* Modal for budget selection */}
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
