import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ExpenseType } from "@/types";
import { PieChart } from "react-native-gifted-charts";

const SavingGoals = () => {
  const [savings, setSavings] = useState<ExpenseType[]>([
    { id: "1", name: "Car Fund", amount: "2500.00", totalAmount: "5000.00", percentage: "50" },
    { id: "2", name: "Vacation", amount: "1500.00", totalAmount: "3000.00", percentage: "50" },
    { id: "3", name: "Emergency Fund", amount: "1000.00", totalAmount: "2000.00", percentage: "50" },
  ]);

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

  const renderGoalItem = ({ item }: { item: ExpenseType }) => (
    <View style={styles.goalCard}>
      {/* Goal Header */}
      <View style={styles.goalHeader}>
        <Text style={styles.savingName}>{item.name}</Text>
        <TouchableOpacity onPress={() => {}}>
          <Feather name="more-vertical" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarWrapper}>
        <View style={{ ...styles.progressBar, width: `${item.percentage}%` }} />
      </View>

      {/* Goal Details */}
      <View style={styles.goalDetails}>
        <Text style={styles.percentageText}>{item.percentage}%</Text>
        <Text style={styles.savingAmount}>${item.amount} / ${item.totalAmount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Total Savings</Text>
        <TouchableOpacity onPress={() => {}}>
          <Feather name="more-vertical" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Total Savings Amount */}
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

      {/* Current Goals */}
      <Text style={styles.sectionHeader}>Current Goals</Text>
      <FlatList
        data={currentGoals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />

      {/* Completed Goals */}
      <Text style={styles.sectionHeader}>Completed Goals</Text>
      <FlatList
        data={completedGoals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );
};

export default SavingGoals;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.dark,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  /* Goal Card */
  goalCard: {
    backgroundColor: "#2C2C2E", // Grey background
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 180,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  savingName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  /* Progress Bar */
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

  /* Goal Details */
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

  /* Manage Button */
  addButton: {
    marginTop: 15,
    backgroundColor: Colors.blue,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
