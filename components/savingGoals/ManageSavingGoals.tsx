import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";

const ManageSavingGoals = ({ savings, setSavings, onClose, fetchSaving }: any) => {

  console.log("SSSAAAAAA", savings)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ name: "", amount: "", totalAmount: "" });
  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.id;
  const token = userState?.token;

  const addGoal = async () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.totalAmount) return;

    console.log("AMAMAM", newGoal.amount)

    const newEntry = {
      id: Number(Math.random() * 10),
      name: newGoal.name,
      amount: newGoal.amount,
      totalAmount: newGoal.totalAmount,
      percentage: ((parseFloat(newGoal.amount) / parseFloat(newGoal.totalAmount)) * 100).toFixed(0),
    };

    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/savingGoal`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserID: userId,
          GoalName: newGoal.name,
          TargetAmount: parseFloat(newGoal.totalAmount),
          CurrentAmount: newGoal.amount,
          Deadline: "2024-12-31",
        }),
      });

      console.log("RESS::::", response)

      if (!response.ok) {
        throw new Error("Failed to add savings goal");
      }

      await fetchSaving();

      setNewGoal({ name: "", amount: "", totalAmount: "" });
      setSelectedGoal(null);
    } catch (error) {
      console.error("Error adding savings goal:", error);
    }
  };

  const updateGoal = async () => {
    if (!selectedGoal || !newGoal.name || !newGoal.amount || !newGoal.totalAmount) return;
    console.log("SSSSSEEEE", selectedGoal)
    console.log("000000", newGoal)
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/savingGoal/${selectedGoal}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          GoalName: newGoal.name,
          TargetAmount: parseFloat(newGoal.totalAmount),
          CurrentAmount: parseFloat(newGoal.amount),
        }),
      });

      console.log("qqqqqq", response)

      if (!response.ok) throw new Error("Failed to update savings goal");

      await fetchSaving();

      setNewGoal({ name: "", amount: "", totalAmount: "" });
      setSelectedGoal(null);
    } catch (error) {
      console.error("Error updating savings goal:", error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      console.log("ISDDDDDD", id)
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/savingGoal/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete savings goal");

      await fetchSaving();
    } catch (error) {
      console.error("Error deleting savings goal:", error);
    }
  };

  React.useEffect(() => {
    if (selectedGoal && selectedGoal !== "new") {
      const goal = savings.find((g) => g.id === selectedGoal);
      if (goal) {
        console.log("AAAA", goal)
        setNewGoal({
          name: goal.name,
          amount: String(goal.amount),
          totalAmount: goal.totalAmount,
        });
      }
    } else {
      setNewGoal({ name: "", amount: "", totalAmount: "" });
    }
  }, [selectedGoal]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>💰 Manage Savings Goals</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Picker
          selectedValue={selectedGoal}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGoal(itemValue)}
        >
          <Picker.Item label="🔽 Select an existing goal" value={null} color="black" />
          {savings.map((goal) => (
            <Picker.Item key={goal.id} label={goal.name} value={goal.id} color="black" />
          ))}
          <Picker.Item label="➕ Add New Goal" value="new" color="green" />
        </Picker>

        {(selectedGoal === "new" || selectedGoal) && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="🏆 Goal Name"
              placeholderTextColor="gray"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="💵 Current Saved Amount"
              placeholderTextColor="gray"
              value={newGoal.amount}
              onChangeText={(text) => setNewGoal({ ...newGoal, amount: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="🎯 Total Savings Goal"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={newGoal.totalAmount}
              onChangeText={(text) => setNewGoal({ ...newGoal, totalAmount: text })}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={selectedGoal === "new" ? addGoal : updateGoal}
            >
              <Text style={styles.addButtonText}>
                {selectedGoal === "new" ? "✅ Add Goal" : "🔄 Update Goal"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>My Current Goals</Text>

        <FlatList
          data={savings}
          keyExtractor={(item) => item.GoalID}
          renderItem={({ item }) => (
            <View style={styles.goalCard}>
              <Text style={styles.goalText}>
                🎯 {item.name}: ${item.amount} / ${item.totalAmount} ({item.percentage}%)
              </Text>
              <TouchableOpacity onPress={() => deleteGoal(item.id)} style={styles.deleteButton}>
                <Feather name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default ManageSavingGoals;

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
    borderWidth: 7,
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
  },
  picker: {
    margin: 20,
  },
});
