import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header1";

const { width: screenWidth } = Dimensions.get("window");

const Analytics = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Expenses data from the response
  const expenses = [
    {
      ExpenseID: 51,
      CategoryID: 14,
      CategoryName: "Savings",
      Amount: "1500.00",
      Description: "Monthly salary",
      TransactionType: "Credit",
      Merchandise: "Company Payroll",
      Date: "2025-02-20T18:51:33.000Z",
      createdAt: "2025-02-20T18:51:33.000Z",
      updatedAt: "2025-02-20T18:51:33.000Z",
    },
    {
      ExpenseID: 52,
      CategoryID: 14,
      CategoryName: "Savings",
      Amount: "200.00",
      Description: "Freelance project payment",
      TransactionType: "Credit",
      Merchandise: "Upwork",
      Date: "2025-02-20T18:51:33.000Z",
      createdAt: "2025-02-20T18:51:33.000Z",
      updatedAt: "2025-02-20T18:51:33.000Z",
    },
    // Add more expenses as needed
  ];

  // Budgets data from the response
  const budgets = [
    {
      BudgetID: 1,
      BudgetName: "Feb Budget",
      UserID: 1,
      Amount: "500.00",
      AmountSpent: "100.00",
      StartDate: "2024-02-01T00:00:00.000Z",
      EndDate: "2024-02-28T00:00:00.000Z",
      createdAt: "2025-02-23T00:06:53.000Z",
      updatedAt: "2025-02-23T00:06:53.000Z",
    },
    {
      BudgetID: 2,
      BudgetName: "Feb Budget",
      UserID: 1,
      Amount: "500.00",
      AmountSpent: "100.00",
      StartDate: "2024-02-01T00:00:00.000Z",
      EndDate: "2024-02-28T00:00:00.000Z",
      createdAt: "2025-02-23T00:06:58.000Z",
      updatedAt: "2025-02-23T00:06:58.000Z",
    },
  ];

  // Savings goals data from the response
  const savingsGoals = [
    {
      GoalID: 1,
      UserID: 1,
      GoalName: "Emergency Fund",
      TargetAmount: "5000.00",
      CurrentAmount: "1000.00",
      Deadline: "2024-12-31T00:00:00.000Z",
      createdAt: "2025-02-21T14:57:24.000Z",
      updatedAt: "2025-02-21T14:57:24.000Z",
    },
    {
      GoalID: 2,
      UserID: 1,
      GoalName: "Emergency Fund",
      TargetAmount: "5000.00",
      CurrentAmount: "0.00",
      Deadline: "2024-12-31T00:00:00.000Z",
      createdAt: "2025-02-22T14:03:57.000Z",
      updatedAt: "2025-02-22T14:03:57.000Z",
    },
    {
      GoalID: 3,
      UserID: 1,
      GoalName: "Trip to New York",
      TargetAmount: "5000.00",
      CurrentAmount: "0.00",
      Deadline: "2024-12-31T00:00:00.000Z",
      createdAt: "2025-02-23T01:26:27.000Z",
      updatedAt: "2025-02-23T01:26:27.000Z",
    },
  ];

  // Prepare data for the bar chart (expenses)
  const expensesBarData = expenses.map((expense) => ({
    value: parseFloat(expense.Amount),
    label: expense.CategoryName,
    frontColor: expense.TransactionType === "Credit" ? colors.green : colors.danger,
  }));

  // Prepare data for the pie chart (budgets)
  const budgetsPieData = budgets.map((budget) => ({
    value: parseFloat(budget.AmountSpent),
    color: colors.primary,
    label: budget.BudgetName,
  }));

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Statistics" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => setActiveIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />

          {/* Expenses Bar Chart */}
          <Text style={styles.sectionTitle}>Expenses</Text>
          <BarChart
            data={expensesBarData}
            barWidth={scale(20)}
            spacing={scale(10)}
            roundedTop
            roundedBottom
            yAxisLabelPrefix="$"
            yAxisTextStyle={{ color: colors.neutral500, fontFamily: "Inter-Medium" }}
            xAxisLabelTextStyle={{ color: colors.neutral500, fontFamily: "Inter-Medium" }}
            showVerticalLines
            verticalLinesColor={colors.neutral200}
            noOfSections={5}
          />

          {/* Budgets Pie Chart */}
          <Text style={styles.sectionTitle}>Budgets</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={budgetsPieData}
              donut
              innerRadius={50}
              showText
              textColor={colors.white}
              textSize={14}
              fontFamily="Inter-Medium"
              focusOnPress
            />
          </View>

          {/* Savings Goals Progress Bars */}
          <Text style={styles.sectionTitle}>Savings Goals</Text>
          {savingsGoals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <Typo size={16} fontWeight="500" style={styles.goalName}>
                {goal.GoalName}
              </Typo>
              <Typo size={14} color={colors.neutral500}>
                ${goal.CurrentAmount} / ${goal.TargetAmount}
              </Typo>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${(parseFloat(goal.CurrentAmount) / parseFloat(goal.TargetAmount)) * 100}%`,
                      backgroundColor: colors.green,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacingX._20 },
  scrollContainer: { gap: spacingY._20, paddingBottom: verticalScale(100) },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.neutral900,
    fontFamily: "Inter-Bold",
    marginVertical: spacingY._10,
  },
  segmentedControl: {
    marginBottom: spacingY._20,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: spacingY._10,
  },
  goalItem: {
    backgroundColor: colors.white,
    padding: spacingX._10,
    borderRadius: radius._10,
    marginBottom: spacingY._10,
  },
  goalName: {
    color: colors.neutral900,
    fontFamily: "Inter-SemiBold",
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.neutral200,
    borderRadius: radius._5,
    overflow: "hidden",
    marginTop: spacingY._5,
  },
  progress: {
    height: "100%",
  },
});

export default Analytics;