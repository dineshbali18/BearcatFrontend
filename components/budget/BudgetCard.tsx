import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import ManageSavingGoals from "../savingGoals/ManageSavingGoals"; // CRUD Component
import { useSelector } from "react-redux";

const API_URL = "http://18.117.93.67:3002/budget/user/1/budgets"; // Replace with your actual API endpoint

const BudgetCard = () => {
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isExpensesModalVisible, setExpensesModalVisible] = useState(false);
  const userState = useSelector((state) => state.user); // Assume user is a JSON string
  const userId = userState.user.id;

  // Fetch data from API
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(
          `http://18.117.93.67:3002/budget/user/${userId}/budgets`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userState?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        // Calculate percentage for each budget
        const formattedData = data.map((item) => ({
          id: item.BudgetID,
          name: item.BudgetName,
          amount: parseFloat(item.Amount).toFixed(2),
          amountSpent: parseFloat(item.AmountSpent).toFixed(2),
          percentage: ((parseFloat(item.AmountSpent) / parseFloat(item.Amount)) * 100).toFixed(0),
        }));

        setSavings(formattedData);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const fetchExpenses = async (budgetId) => {
    // try {
    //   const response = await fetch(
    //     `http://18.117.93.67:3002/budget/${budgetId}/expenses`,
    //     {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${userState?.token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
      // const data = await response.json();
      setExpenses([{"id":1,"description":"ewRFSGFH","amount":45}])
      setExpensesModalVisible(true);
    // } catch (error) {
    //   console.error("Error fetching expenses:", error);
    // }
  };

  const completedGoals = savings.filter((goal) => parseInt(goal.percentage) === 100);
  const currentGoals = savings.filter((goal) => parseInt(goal.percentage) < 100);

  const totalAmount = savings.reduce((acc, goal) => acc + parseFloat(goal.amount), 0).toFixed(2);
  const totalAmountSpent = savings.reduce((acc, goal) => acc + parseFloat(goal.amountSpent), 0).toFixed(2);
  const percentageSpent = ((parseFloat(totalAmountSpent) / parseFloat(totalAmount)) * 100).toFixed(0);

  const pieData = [
    { value: parseFloat(totalAmountSpent), color: Colors.blue },
    { value: parseFloat(totalAmount) - parseFloat(totalAmountSpent), color: Colors.white },
  ];

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity onPress={() => fetchExpenses(item.id)}>
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.savingName}>{item.name}</Text>
        </View>
        <View style={styles.progressBarWrapper}>
          <View style={{ ...styles.progressBar, width: `${item.percentage}%` }} />
        </View>
        <View style={styles.goalDetails}>
          <Text style={styles.percentageText}>{item.percentage}%</Text>
          <Text style={styles.savingAmount}>
            ${item.amountSpent} / ${item.amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.expenseAmountText}>${totalAmountSpent} / ${totalAmount}</Text>
      <PieChart data={pieData} donut showGradient sectionAutoFocus focusOnPress radius={70} innerRadius={55} innerCircleColor={Colors.black} centerLabelComponent={() => (
        <View style={styles.centerLabel}>
          <Text style={styles.centerLabelText}>{percentageSpent}%</Text>
        </View>
      )} />

      <Text style={styles.sectionHeader}>Current Budgets</Text>
      <FlatList data={currentGoals} renderItem={renderGoalItem} keyExtractor={(item) => item.id.toString()} horizontal showsHorizontalScrollIndicator={false} />

      <Text style={styles.sectionHeader}>Completed Budgets</Text>
      <FlatList data={completedGoals} renderItem={renderGoalItem} keyExtractor={(item) => item.id.toString()} horizontal showsHorizontalScrollIndicator={false} />

      <Modal visible={isExpensesModalVisible} animationType="slide" transparent>
        <View style={styles.expensesModal}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setExpensesModalVisible(false)}>
            <Feather name="x" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Expenses</Text>
          <FlatList data={expenses} renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <Text style={styles.expenseAmount}>${item.amount}</Text>
            </View>
          )} keyExtractor={(item) => item.id.toString()} />
        </View>
      </Modal>
    </View>
  );
};

export default BudgetCard;


const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: Colors.dark, flex: 1 },
  goalCard: { backgroundColor: "#2C2C2E", padding: 15, borderRadius: 10, marginBottom: 10 },
  savingName: { color: Colors.white, fontSize: 16, fontWeight: "600" },
  progressBarWrapper: { height: 6, backgroundColor: "#555", borderRadius: 3, marginVertical: 5 },
  progressBar: { height: "100%", borderRadius: 3, backgroundColor: Colors.blue },
  savingAmount: { color: Colors.white, fontSize: 14, textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "violet", padding: 20, borderRadius: 10, width: "80%", alignItems: "center" },
  closeButton: { position: "absolute", top: 10, right: 10 },
  modalTitle: { fontSize: 20, color: "white", fontWeight: "bold", marginBottom: 10 },
  expenseItem: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingVertical: 5 },
  expenseText: { color: "white", fontSize: 16 },
  expenseAmount: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default BudgetCard;
