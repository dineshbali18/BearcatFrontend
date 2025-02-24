import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import ManageSavingGoals from "./ManageSavingGoals";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = "http://18.117.93.67:3002/savingGoal/user/1"; // Replace 1 with dynamic user ID
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZGluZXNoYmFsaTQ1QGdtYWlsLmNvbSIsImlhdCI6MTc0MDMwOTY5NywiZXhwIjoxNzQwMzI3Njk3fQ.Cz9nPhtbHUzfPE5MB_mHBARiXq9WucdMEB1Uv_6CNxo"

const SavingGoals = () => {
  const [savings, setSavings] = useState([]);
  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const userState = useSelector((state) => state.user); // Assume user is a JSON string
  const userId = userState.user.id

  useEffect(() => {
    const fetchSavingGoals = async () => {
      try {
        const response = await axios.get(`http://18.117.93.67:3002/savingGoal/user/${userId}`, {
          headers: { Authorization: `Bearer ${userState?.token}` },
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

    fetchSavingGoals();
  }, []);

  const completedGoals = savings.filter((goal) => parseInt(goal.percentage) === 100);
  const currentGoals = savings.filter((goal) => parseInt(goal.percentage) < 100);

  const totalSavings = savings.reduce((acc, goal) => acc + parseFloat(goal.amount), 0).toFixed(2);
  const goalAmount = 10000; // You can dynamically change this value as needed
  const percentage = ((parseFloat(totalSavings) / goalAmount) * 100).toFixed(0);

  const pieData = savings.map((goal) => [
    { value: parseFloat(goal.percentage), color: Colors.blue }, // Display the percentage in blue
    { value: 100 - parseFloat(goal.percentage), color: Colors.white }, // Remaining percentage in white
  ]).flat();
  
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
      <FlatList data={currentGoals} renderItem={({ item }) => <GoalItem item={item} />} keyExtractor={(item) => item.id} horizontal />
      <Text style={styles.sectionHeader}>Completed Goals</Text>
      <FlatList data={completedGoals} renderItem={({ item }) => <GoalItem item={item} />} keyExtractor={(item) => item.id} horizontal />
      <Modal visible={isManageModalVisible} animationType="slide">
        <ManageSavingGoals savings={savings} setSavings={setSavings} onClose={() => setManageModalVisible(false)} />
      </Modal>
    </View>
  );
};

const GoalItem = ({ item }) => (
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
);

const styles = StyleSheet.create({
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
