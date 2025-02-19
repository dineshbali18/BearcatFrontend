import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ExpenseType } from "@/types";
import { PieChart } from "react-native-gifted-charts";
import ManageSavingGoals from "./ManageSavingGoals"; // Import CRUD component

// Dummy expenses data for each goal id
const expensesData: { [key: string]: { id: string; description: string; amount: number }[] } = {
  "1": [
    { id: "e1", description: "Fuel", amount: 50 },
    { id: "e2", description: "Maintenance", amount: 150 },
  ],
  "2": [
    { id: "e3", description: "Hotel", amount: 200 },
    { id: "e4", description: "Flight", amount: 300 },
  ],
  "3": [
    { id: "e5", description: "Medical", amount: 100 },
    { id: "e6", description: "Groceries", amount: 80 },
  ],
};

const BudgetCard = () => {
  const [savings, setSavings] = useState<ExpenseType[]>([
    { id: "1", name: "Car Fund", amount: "2500.00", totalAmount: "5000.00", percentage: "50" },
    { id: "2", name: "Vacation", amount: "1500.00", totalAmount: "3000.00", percentage: "50" },
    { id: "3", name: "Emergency Fund", amount: "1000.00", totalAmount: "2000.00", percentage: "50" },
  ]);

  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<ExpenseType | null>(null);

  const completedGoals = savings.filter((goal) => parseInt(goal.percentage) === 100);
  const currentGoals = savings.filter((goal) => parseInt(goal.percentage) < 100);

  const totalSavings = savings.reduce((acc, goal) => acc + parseFloat(goal.amount), 0).toFixed(2);
  const goalAmount = 10000; // Example goal
  const percentage = ((parseFloat(totalSavings) / goalAmount) * 100).toFixed(0);

  const pieData: any[] = [
    { value: 50, color: Colors.blue },
    { value: 30, color: Colors.white },
    { value: 20, color: Colors.tintColor },
  ];

  // Render each card in the list. (No three dots now)
  const renderGoalItem = ({ item }: { item: ExpenseType }) => (
    <TouchableOpacity onPress={() => setExpandedGoal(item)}>
      <View style={styles.goalCard}>
        {/* Goal Header */}
        <View style={styles.goalHeader}>
          <Text style={styles.savingName}>{item.name}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarWrapper}>
          <View style={{ ...styles.progressBar, width: `${item.percentage}%` }} />
        </View>

        {/* Goal Details */}
        <View style={styles.goalDetails}>
          <Text style={styles.percentageText}>{item.percentage}%</Text>
          <Text style={styles.savingAmount}>
            ${item.amount} / ${item.totalAmount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Expanded Card view for the tapped card
  const renderExpandedCard = () => {
    if (!expandedGoal) return null;
    const goalExpenses = expensesData[expandedGoal.id] || [];
    return (
      <View style={styles.expandedCardContainer}>
        <TouchableOpacity
          style={styles.closeExpandedButton}
          onPress={() => setExpandedGoal(null)}
        >
          <Feather name="x" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.expandedCard}>
          <Text style={styles.expandedCardTitle}>{expandedGoal.name}</Text>
          <Text style={styles.expandedCardDetail}>
            ${expandedGoal.amount} / ${expandedGoal.totalAmount} ({expandedGoal.percentage}%)
          </Text>
          <View style={styles.expandedProgressBarWrapper}>
            <View
              style={{
                ...styles.expandedProgressBar,
                width: `${expandedGoal.percentage}%`,
              }}
            />
          </View>
        </View>
        <View style={styles.expensesList}>
          <Text style={styles.expensesHeader}>Expenses</Text>
          {goalExpenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <Text style={styles.expenseText}>{expense.description}</Text>
              <Text style={styles.expenseText}>${expense.amount}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Total Budgets</Text>
        <TouchableOpacity onPress={() => setManageModalVisible(true)}>
          <Feather name="more-vertical" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Total Savings Amount */}
      <Text style={styles.expenseAmountText}>
        ${totalSavings} / ${goalAmount}
      </Text>
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

      {/* Expanded Card */}
      {expandedGoal && renderExpandedCard()}

      <ScrollView>
        {/* Current Goals */}
        <Text style={styles.sectionHeader}>Current Budgets</Text>
        <FlatList
          data={currentGoals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Completed Goals */}
        <Text style={styles.sectionHeader}>Completed Budgets</Text>
        <FlatList
          data={completedGoals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </ScrollView>

      {/* Manage Savings Modal */}
      <Modal visible={isManageModalVisible} animationType="slide">
        <ManageSavingGoals
          savings={savings}
          setSavings={setSavings}
          onClose={() => setManageModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default BudgetCard;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.dark,
    borderRadius: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  expenseAmountText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  pieChartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  centerLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  sectionHeader: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  horizontalList: {
    paddingBottom: 10,
  },
  /* Goal Card (normal state) */
  goalCard: {
    backgroundColor: "#2C2C2E",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 180,
  },
  goalHeader: {
    marginBottom: 5,
  },
  savingName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: "#555",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.blue,
  },
  goalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "bold",
  },
  savingAmount: {
    color: Colors.white,
    fontSize: 12,
  },
  /* Expanded Card Styles */
  expandedCardContainer: {
    backgroundColor: "#8A2BE2", // Violet background
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  closeExpandedButton: {
    alignSelf: "flex-end",
  },
  expandedCard: {
    alignItems: "center",
  },
  expandedCardTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  expandedCardDetail: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 10,
  },
  expandedProgressBarWrapper: {
    height: 8,
    backgroundColor: "#555",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    marginBottom: 15,
  },
  expandedProgressBar: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: Colors.blue,
  },
  expensesList: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  expensesHeader: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  expenseText: {
    color: Colors.white,
    fontSize: 14,
  },
});
