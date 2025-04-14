import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import ManageBudgets from "./ManageBudgets";
import axios from "axios";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';

const API_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/user`;

const BudgetCard = ({ expenses, setExpenses, fetchExpenses }) => {
  const [budgets, setBudgets] = useState([]);
  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const [isBudgetExpenseVisible, setIsBudgetExpenseVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const userId = userState.user.id;
  const BudgetID = useRef(0);

  useEffect(() => {
    fetchExpenses();
  }, [isBudgetExpenseVisible]);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${API_URL}/${userId}/budgets`, {
        headers: { Authorization: `Bearer ${userState.token}` },
      });

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

  const budgetsArray = budgets || [];
  const completedBudgets = budgetsArray.filter((budget) => parseInt(budget.percentage) >= 100);
  const currentBudgets = budgetsArray.filter((budget) => parseInt(budget.percentage) < 100);
  const totalSpent = budgetsArray.reduce((acc, budget) => acc + parseFloat(budget.amount), 0).toFixed(2);
  const totalBudget = budgetsArray.reduce((acc, budget) => acc + (parseFloat(budget.totalAmount) || 0), 0).toFixed(2);
  const percentage = totalBudget > 0 ? ((parseFloat(totalSpent) / parseFloat(totalBudget)) * 100).toFixed(0) : "0";

  const pieData = [
    { value: Number(percentage), color: Colors.blue },
    { value: 100 - Number(percentage), color: Colors.white },
  ];

  return (
    <View style={styles.container} testID="budgetCardContainer">
      <View style={styles.header}>
        <Text style={styles.headerText}>My Total Budgets</Text>
        <TouchableOpacity testID="openManageBudgetsButton" onPress={() => setManageModalVisible(true)}>
          <Feather name="more-vertical" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.expenseAmountText}>${totalSpent} / ${totalBudget}</Text>
      <View style={styles.pieChartContainer} testID="budgetPieChart">
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
        renderItem={({ item }) => (
          <BudgetItem 
            item={item} 
            allExpenses={expenses} 
            BudgetID={BudgetID} 
            setIsBudgetExpenseVisible={setIsBudgetExpenseVisible} 
          />
        )} 
        keyExtractor={(item) => item.id} 
        horizontal 
        testID="currentBudgetsList"
      />

      <Text style={styles.sectionHeader}>Completed Budgets</Text>
      <FlatList 
        data={completedBudgets} 
        renderItem={({ item }) => (
          <BudgetItem 
            item={item} 
            allExpenses={expenses} 
            BudgetID={BudgetID} 
            setIsBudgetExpenseVisible={setIsBudgetExpenseVisible} 
          />
        )} 
        keyExtractor={(item) => item.id} 
        horizontal 
        testID="completedBudgetsList"
      />

      <Modal visible={isManageModalVisible} animationType="slide">
        <ManageBudgets 
          budgets={budgets} 
          setBudgets={setBudgets} 
          fetchBudgets={fetchBudgets} 
          onClose={() => setManageModalVisible(false)} 
        />
      </Modal>

      <Modal visible={isBudgetExpenseVisible} animationType="slide" transparent>
        <View style={styles.modalBackground} testID="budgetExpenseModalWrapper">
          <View style={styles.expensesModal} testID="budgetExpenseModal">
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsBudgetExpenseVisible(false)}
              testID="closeBudgetExpenseModal"
            >
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Expenses</Text>
            <FlatList
              data={expenses.filter(expense => expense.BudgetID === BudgetID.current)}
              renderItem={({ item }) => (
                <View style={styles.expenseItem} testID={`budgetExpenseItem-${item.ExpenseID}`}>
                  <Text style={styles.expenseDescription}>{item.Description}</Text>
                  <Text style={styles.expenseAmount}>${item.Amount}</Text>
                </View>
              )}
              keyExtractor={(item) => item.ExpenseID.toString()}
              testID="budgetExpenseList"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const BudgetItem = ({ item, allExpenses, BudgetID, setIsBudgetExpenseVisible }) => (
  <View>
    <TouchableOpacity
      testID={`budgetItem-${item.id}`}
      onPress={() => {
        BudgetID.current = Number(item.id);
        setIsBudgetExpenseVisible(true);
      }}
    >
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
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 20,
    margin: 25,
    marginTop: 55,
    borderWidth: 7
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: "black",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    margin: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  goalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
    borderRadius: 12,
  },
  goalText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  picker: {
    margin: 20
  },
  sectionHeader: {
    fontWeight: "800",
    fontSize: 20,
    margin: 20,
    color: "black"
  },
  deleteButton: {
    marginLeft: 10
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    fontSize: 16
  },
  listContainer: {
    paddingBottom: 20
  }
});

export default ManageBudgets;