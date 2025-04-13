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
import Constants from 'expo-constants';

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

interface SavingGoal {
  GoalID: number;
  GoalName: string;
}

const API_BASE_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002`;

const IncomeBlock = ({incomeList}) => {
  // const [incomeList, setIncomeList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Expense | null>(null);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.id;
  const token = userState?.token;

  // useEffect(() => {
  //   fetchExpenses();
  // }, []);

  // const fetchExpenses = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/expense/expenses/user/${userId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();
  //     if (data?.categorizedExpenses) {
  //       const credits = data.categorizedExpenses.flatMap((category: any) =>
  //         category.expenses.filter((expense: Expense) => expense.TransactionType === "Credit")
  //       );
  //       setIncomeList(credits);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching expenses:", error);
  //     Alert.alert("Error", "Failed to load transactions.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchSavingGoals = async () => {
    setIsLoadingGoals(true);
    try {
      const response = await fetch(`${API_BASE_URL}/savingGoal/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setSavingGoals(data);
      } else {
        setSavingGoals([]);
      }
    } catch (error) {
      console.error("Error fetching saving goals:", error);
      Alert.alert("Error", "Failed to load saving goals.");
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const handleAddToSavingGoal = async () => {
    if (!selectedIncome || !selectedGoal) {
      Alert.alert("Error", "Please select a saving goal.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/expense/expenses/${selectedIncome.ExpenseID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ GoalID: selectedGoal }),
      });

      if (!response.ok) throw new Error("Failed to update expense.");

      Alert.alert("Success", "Expense added to savings goal successfully.");
      setModalVisible(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error("Error updating expense:", error);
      Alert.alert("Error", "Failed to add expense to savings goal.");
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (income: Expense) => {
    setSelectedIncome(income);
    setModalVisible(true);
    fetchSavingGoals();
  };

  const renderItem: ListRenderItem<Expense> = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.incomeName}>{item.CategoryName}</Text>
          <TouchableOpacity onPress={() => openModal(item)}>
            <Feather name="more-horizontal" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.amountText}>${parseFloat(item.Amount).toFixed(2)}</Text>
        <Text style={styles.description}>{item.Description}</Text>
        <Text style={styles.description}>{item.Date.split('T')[0]}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        My <Text style={styles.boldText}>Income </Text>
      </Text>
      {incomeList.length > 0 ? (
        <FlatList data={incomeList} renderItem={renderItem} horizontal showsHorizontalScrollIndicator={false} />
      ) : (
        <Text style={styles.noIncomeText}>No credit transactions found.</Text>
      )}

      {/* Modal for transaction details */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedIncome && (
              <>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <Text style={styles.modalText}>Category: {selectedIncome.CategoryName}</Text>
                <Text style={styles.modalText}>Amount: ${parseFloat(selectedIncome.Amount).toFixed(2)}</Text>
                <Text style={styles.modalText}>Description: {selectedIncome.Description}</Text>
                <Text style={styles.modalText}>Date: {selectedIncome.Date}</Text>

                {/* Saving Goals Picker */}
                <Text style={styles.modalTitle}>Select a Saving Goal</Text>
                {isLoadingGoals ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Picker
                    selectedValue={selectedGoal}
                    onValueChange={(itemValue) => setSelectedGoal(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a Goal" value={null} />
                    {savingGoals.map((goal) => (
                      <Picker.Item key={goal.GoalID} label={goal.GoalName} value={goal.GoalID} />
                    ))}
                  </Picker>
                )}

                <TouchableOpacity style={styles.addButton} onPress={handleAddToSavingGoal} disabled={isSaving}>
                  <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Add to Savings Goal"}</Text>
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

export default IncomeBlock;

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 10 
  },
  headerText: { 
    color: Colors.white, 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  boldText: { 
    fontWeight: "700" 
  },
  card: {
    backgroundColor: Colors.grey,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    width: 180,
    gap: 10,
  },
  cardHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  incomeName: { 
    color: Colors.white, 
    fontSize: 16, 
    fontWeight: "600" 
  },
  amountText: { 
    color: Colors.white, 
    fontSize: 18, 
    fontWeight: "600" 
  },
  description: { 
    color: Colors.white, 
    fontSize: 14, 
    marginTop: 5 
  },
  noIncomeText: { 
    color: Colors.white, 
    fontSize: 14, 
    textAlign: "center", 
    marginTop: 20 
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    elevation: 5, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.black,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 5,
    textAlign: "center",
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    color: Colors.black,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: Colors.black,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
