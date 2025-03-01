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
  const userState = useSelector((state) => state.user); // Assume user is a JSON string
  const userId = userState.user.id
  

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
        console.log("DATA:::::", data);

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

  const completedGoals = savings.filter((goal) => parseInt(goal.percentage) === 100);
  const currentGoals = savings.filter((goal) => parseInt(goal.percentage) < 100);

  // Calculate total savings and goal
  const totalAmount = savings.reduce((acc, goal) => acc + parseFloat(goal.amount), 0).toFixed(2);
  const totalAmountSpent = savings.reduce((acc, goal) => acc + parseFloat(goal.amountSpent), 0).toFixed(2);
  const percentageSpent = ((parseFloat(totalAmountSpent) / parseFloat(totalAmount)) * 100).toFixed(0);

  const pieData = [
    { value: parseFloat(totalAmountSpent), color: Colors.blue },
    { value: parseFloat(totalAmount) - parseFloat(totalAmountSpent), color: Colors.white },
  ];

  // Render each budget item
  const renderGoalItem = ({ item }) => (
    <TouchableOpacity onPress={() => setExpandedGoal(item)}>
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

  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.white} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Total Budgets Active</Text>
        <TouchableOpacity onPress={() => setManageModalVisible(true)}>
          <Feather name="more-vertical" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.expenseAmountText}>
        ${totalAmountSpent} / ${totalAmount}
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
              <Text style={styles.centerLabelText}>{percentageSpent}%</Text>
            </View>
          )}
        />
      </View>

      <ScrollView>
        <Text style={styles.sectionHeader}>Current Budgets</Text>
        <FlatList
          data={currentGoals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <Text style={styles.sectionHeader}>Completed Budgets</Text>
        <FlatList
          data={completedGoals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </ScrollView>

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
});
