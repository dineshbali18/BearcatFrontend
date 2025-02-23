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
import ManageSavingGoals from "../savingGoals/ManageSavingGoals"; // Import the ManageSavingGoals component

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

const API_URL = "http://192.168.1.194:3002/expense/expenses/user/1";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZGluZXNoYmFsaTQ1QGdtYWlsLmNvbSIsImlhdCI6MTc0MDMwOTY5NywiZXhwIjoxNzQwMzI3Njk3fQ.Cz9nPhtbHUzfPE5MB_mHBARiXq9WucdMEB1Uv_6CNxo"

const IncomeBlock = () => {
  const [incomeList, setIncomeList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Expense | null>(null);
  const [showManageGoalModal, setShowManageGoalModal] = useState(false); // New state for showing ManageSavingGoals

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      const data = await response.json();
      if (data?.categorizedExpenses) {
        const credits = data.categorizedExpenses.flatMap((category: any) =>
          category.expenses.filter((expense: Expense) => expense.TransactionType === "Credit")
        );
        setIncomeList(credits);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      Alert.alert("Error", "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem: ListRenderItem<Expense> = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.incomeName}>{item.CategoryName}</Text>
          <TouchableOpacity onPress={() => {
            setSelectedIncome(item);
            setModalVisible(true);
          }}>
            <Feather name="more-horizontal" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.amountText}>
          ${parseFloat(item.Amount).toFixed(2)}
        </Text>
        <Text style={styles.description}>{item.Description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        My <Text style={styles.boldText}>Income</Text>
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.white} />
      ) : incomeList.length > 0 ? (
        <FlatList data={incomeList} renderItem={renderItem} horizontal showsHorizontalScrollIndicator={false} />
      ) : (
        <Text style={styles.noIncomeText}>No credit transactions found.</Text>
      )}

      {/* Modal for transaction details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedIncome && (
              <>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <Text style={styles.modalText}>Category: {selectedIncome.CategoryName}</Text>
                <Text style={styles.modalText}>Amount: ${parseFloat(selectedIncome.Amount).toFixed(2)}</Text>
                <Text style={styles.modalText}>Description: {selectedIncome.Description}</Text>
                <Text style={styles.modalText}>Date: {selectedIncome.Date}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                {/* Add to Saving Goal Button */}
                <TouchableOpacity style={styles.addButton} onPress={() => setShowManageGoalModal(true)}>
                  <Text style={styles.buttonText}>Add to Savings Goal</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ManageSavingGoals Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showManageGoalModal}
        onRequestClose={() => setShowManageGoalModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ManageSavingGoals />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowManageGoalModal(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IncomeBlock;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10 },
  headerText: { color: Colors.white, fontSize: 16, marginBottom: 20 },
  boldText: { fontWeight: "700" },
  card: {
    backgroundColor: Colors.grey,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    width: 180,
    gap: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  incomeName: { color: Colors.white, fontSize: 16, fontWeight: "600" },
  amountText: { color: Colors.white, fontSize: 18, fontWeight: "600" },
  description: { color: Colors.white, fontSize: 14, marginTop: 5 },
  noIncomeText: { color: Colors.white, fontSize: 14, textAlign: "center", marginTop: 20 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
