import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import ManageSavingGoals from "./ManageSavingGoals";
import axios from "axios";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';

const API_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002/savingGoal/user`; // Base URL for the API

const SavingGoals = ({expenses,setExpenses}) => {

  console.log("EEEEQQQ",expenses)

  const [savings, setSavings] = useState([]);
  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const [isSavingGoalExpenseVisibel, setIsSavingGoalExpenseVisible] = useState(false);
  const userState = useSelector((state) => state.user); // Assume user is a JSON string
  const userId = userState.user.id; // Dynamic User ID
  const GoalID = useRef(0);

  useEffect(() => {
    fetchSavingGoals();
  }, [isSavingGoalExpenseVisibel]);

  const fetchSavingGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${userState.token}` },
      });

      // Process the data from API response
      const formattedData = response.data.map((goal) => ({
        id: goal.GoalID.toString(),
        name: goal.GoalName,
        amount: goal.CurrentAmount,
        totalAmount: goal.TargetAmount,
        percentage: ((parseFloat(goal.CurrentAmount) / parseFloat(goal.TargetAmount)) * 100).toFixed(0),
      }));

      setSavings(formattedData);
    } catch (error) {
      console.error("Error fetching saving goals:", error);
    }
  };

  useEffect(()=>{
    setExpenses([...expenses])
  },[])

// Ensure savings is always an array, even if it's null or undefined
const savingsArray = savings || [];

// Filter completed and current goals
const completedGoals = savingsArray.filter((goal) => parseInt(goal.percentage) >= 100);
const currentGoals = savingsArray.filter((goal) => parseInt(goal.percentage) < 100);

// Calculate totalSavings and goalAmount safely
const totalSavings = savingsArray.reduce((acc, goal) => acc + (parseFloat(goal.amount) || 0), 0).toFixed(2);
const goalAmount = savingsArray.reduce((acc, goal) => acc + (parseFloat(goal.totalAmount) || 0), 0).toFixed(2);

// Calculate percentage safely (avoid division by zero)
const percentage = goalAmount > 0 
  ? ((parseFloat(totalSavings) / parseFloat(goalAmount)) * 100).toFixed(0) 
  : "0";

// Generate pieData safely
const pieData = savingsArray.map((goal) => {
  const goalPercentage = parseFloat(goal.percentage) || 0;
  return [
    { value: goalPercentage, color: Colors.blue }, // Display the percentage in blue
    { value: 100 - goalPercentage, color: Colors.white }, // Remaining percentage in white
  ];
}).flat();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Total Savings</Text>
        <TouchableOpacity onPress={() => setManageModalVisible(true)}>
          <Feather name="more-vertical" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.expenseAmountText}>${totalSavings} / ${goalAmount}</Text>
      <View style={styles.pieChartContainer}>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          focusOnPress
          radius={70}
          innerRadius={55}
          innerCircleColor={Colors.black}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelText}>{percentage}%</Text>
            </View>
          )}
        />
      </View>
      <Text style={styles.sectionHeader}>Current Goals</Text>
      <FlatList data={currentGoals} renderItem={({ item }) => <GoalItem item={item} allExpenses={expenses} GoalID={GoalID} setIsSavingGoalExpenseVisibel={setIsSavingGoalExpenseVisible} />} keyExtractor={(item) => item.id} horizontal />
      <Text style={styles.sectionHeader}>Completed Goals</Text>
      <FlatList data={completedGoals} renderItem={({ item }) => <GoalItem item={item} allExpenses={expenses} GoalID={GoalID} setIsSavingGoalExpenseVisibel={setIsSavingGoalExpenseVisible} />} keyExtractor={(item) => item.id} horizontal />
      <Modal visible={isManageModalVisible} animationType="slide">
        <ManageSavingGoals savings={savings} setSavings={setSavings} fetchSaving={fetchSavingGoals} onClose={() => setManageModalVisible(false)} />
      </Modal>
      <Modal visible={isSavingGoalExpenseVisibel} animationType="slide" transparent>
            <View style={styles.modalBackground}>
              <View style={styles.expensesModal}>
                <TouchableOpacity style={styles.closeButton} onPress={() => {setIsSavingGoalExpenseVisible(false)}}>
                  <Feather name="x" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalHeader}>Expenses</Text>
                <FlatList
                  data={expenses.filter(expense => expense.GoalID === GoalID.current)}
                  renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                      <Text style={styles.expenseDescription}>{item.Description}</Text>
                      <Text style={styles.expenseAmount}>${item.Amount}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.ExpenseID.toString()}
                />
              </View>
            </View>
        </Modal>
    </View>
  );
};

const GoalItem = ({ item, expenses, GoalID, setIsSavingGoalExpenseVisibel }) => (
  <View>
  <TouchableOpacity onPress={() => { GoalID.current=Number(item.id); setIsSavingGoalExpenseVisibel(true); }}>
  <View style={styles.goalCard}>
    <View style={styles.goalHeader}>
      <Text style={styles.savingName}>{item.name}</Text>
    </View>
    <View style={styles.progressBarWrapper}>
      <View style={{ ...styles.progressBar, width: `${item.percentage}%` }} />
    </View>
    <View style={styles.goalDetails}>
      <Text style={styles.percentageText}>{item.percentage}%</Text>
      <Text style={styles.savingAmount}>${item.amount} / ${item.totalAmount}</Text>
    </View>
  </View>
  </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  feather:{
    color: 'white'

  },
  internalContainer:{
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expensesModal: {
    width: '80%',
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 15,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7f8c8d',
  },
  expenseDescription: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  container: { padding: 15, backgroundColor: Colors.dark, borderRadius: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerText: { color: Colors.white, fontSize: 18, fontWeight: "700" },
  expenseAmountText: { color: Colors.white, fontSize: 24, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  pieChartContainer: { alignItems: "center", marginBottom: 20 },
  centerLabel: { justifyContent: "center", alignItems: "center" },
  centerLabelText: { fontSize: 22, color: "white", fontWeight: "bold" },
  sectionHeader: { color: Colors.white, fontSize: 16, fontWeight: "700", marginTop: 20, marginBottom: 10 },
  goalCard: { backgroundColor: "#2C2C2E", padding: 15, borderRadius: 10, marginRight: 10, width: 180 },
  goalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  savingName: { color: Colors.white, fontSize: 14, fontWeight: "600" },
  progressBarWrapper: { height: 6, backgroundColor: "#555", borderRadius: 3, overflow: "hidden", marginBottom: 5 },
  progressBar: { height: "100%", borderRadius: 3, backgroundColor: Colors.blue },
  goalDetails: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  percentageText: { fontSize: 12, color: Colors.white, fontWeight: "bold" },
  savingAmount: { color: Colors.white, fontSize: 12 },
});

export default SavingGoals;
