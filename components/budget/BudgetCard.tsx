import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import ManageBudgets from "./ManageBudgets";
import axios from "axios";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';

const API_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/user`; // Base URL for the API

const BudgetCard = ({expenses, setExpenses, fetchExpenses}) => {
  const [budgets, setBudgets] = useState([]);
  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const [isBudgetExpenseVisible, setIsBudgetExpenseVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const userId = userState.user.id;
  const BudgetID = useRef(0);

  useEffect(() => {
    fetchExpenses();
  }, [isBudgetExpenseVisible]);

  useEffect(()=>{
    fetchBudgets();
  },[])

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${API_URL}/${userId}/budgets`, {
        headers: { Authorization: `Bearer ${userState.token}` },
      });

      // Process the data from API response
      const formattedData = response.data.map((budget) => ({
        id: budget.BudgetID.toString(),
        name: budget.BudgetName,
        amount: budget.AmountSpent,
        totalAmount: budget.Amount,
        percentage: ((parseFloat(budget.AmountSpent) / parseFloat(budget.Amount)) * 100).toFixed(0),
      }));

      setBudgets(formattedData);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // Ensure budgets is always an array
  const budgetsArray = budgets || [];

  // Filter completed and current budgets
  const completedBudgets = budgetsArray.filter((budget) => parseInt(budget.percentage) >= 100);
  const currentBudgets = budgetsArray.filter((budget) => parseInt(budget.percentage) < 100);

  // Calculate totals safely
  const totalSpent = budgetsArray.reduce((acc, budget) => acc + parseFloat(budget.amount), 0).toFixed(2);
  const totalBudget = budgetsArray.reduce((acc, budget) => acc + (parseFloat(budget.totalAmount) || 0), 0).toFixed(2);

  // Calculate percentage safely
  const percentage = totalBudget > 0 
    ? ((parseFloat(totalSpent) / parseFloat(totalBudget)) * 100).toFixed(0) 
    : "0";

  // Generate pieData
  // const pieData = budgetsArray.length > 0 ? [
  //   { value: parseFloat(totalSpent), color: Colors.blue },
  //   { value: parseFloat(totalBudget) - parseFloat(totalSpent), color: Colors.white },
  // ]:[
  //       { value: 0, color: Colors.blue },  // Fallback dummy data, 0% blue
  //       { value: 100, color: Colors.white }, // Fallback dummy data, 0% white
  //   ];

const pieData = [
  { value: Number(percentage), color: Colors.blue },
  { value: 100 - Number(percentage), color: Colors.white },
];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Total Budgets</Text>
        <TouchableOpacity onPress={() => setManageModalVisible(true)}>
          <Feather name="more-vertical" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.expenseAmountText}>${totalSpent} / ${totalBudget}</Text>
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
      <Text style={styles.sectionHeader}>Current Budgets</Text>
      <FlatList 
        data={currentBudgets} 
        renderItem={({ item }) => <BudgetItem item={item} allExpenses={expenses} BudgetID={BudgetID} setIsBudgetExpenseVisible={setIsBudgetExpenseVisible} />} 
        keyExtractor={(item) => item.id} 
        horizontal 
      />
      <Text style={styles.sectionHeader}>Completed Budgets</Text>
      <FlatList 
        data={completedBudgets} 
        renderItem={({ item }) => <BudgetItem item={item} allExpenses={expenses} BudgetID={BudgetID} setIsBudgetExpenseVisible={setIsBudgetExpenseVisible} />} 
        keyExtractor={(item) => item.id} 
        horizontal 
      />
      <Modal visible={isManageModalVisible} animationType="slide">
        <ManageBudgets budgets={budgets} setBudgets={setBudgets} fetchBudgets={fetchBudgets} onClose={() => setManageModalVisible(false)} />
      </Modal>
      <Modal visible={isBudgetExpenseVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.expensesModal}>
            <TouchableOpacity style={styles.closeButton} onPress={() => {setIsBudgetExpenseVisible(false)}}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Expenses</Text>
            <FlatList
              data={expenses.filter(expense => expense.BudgetID === BudgetID.current)}
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

const BudgetItem = ({ item, allExpenses, BudgetID, setIsBudgetExpenseVisible }) => (
  <View>
    <TouchableOpacity onPress={() => { BudgetID.current = Number(item.id); setIsBudgetExpenseVisible(true); }}>
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
  feather: {
    color: 'white'
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

export default BudgetCard;