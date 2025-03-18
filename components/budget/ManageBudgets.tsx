import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageBudgets = ({ onClose }: any) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ name: "", amount: "", totalAmount: "" });
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token from AsyncStorage
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  // Fetch budgets from API
  useEffect(() => {
    if (!token) return;

    const fetchBudgets = async () => {
      try {
        const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/budgets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSavings(data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [token]);

  // Add a new budget
  const addGoal = async () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.totalAmount) return;

    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BudgetName: newGoal.name,
          UserID: 1, // Replace with actual user ID
          Amount: parseFloat(newGoal.amount),
          StartDate: new Date().toISOString().split("T")[0], // Current date
          EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0], // One month from now
        }),
      });

      if (response.ok) {
        const newBudget = await response.json();
        setSavings([...savings, newBudget]);
        setNewGoal({ name: "", amount: "", totalAmount: "" });
        setSelectedGoal(null);
      }
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  // Update an existing budget
  const updateGoal = async () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.totalAmount || !selectedGoal) return;

    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/budgets/${selectedGoal}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: newGoal.name,
          amount: parseFloat(newGoal.amount),
          startDate: new Date().toISOString().split("T")[0], // Current date
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0], // One month from now
        }),
      });

      if (response.ok) {
        const updatedBudget = await response.json();
        const updatedSavings = savings.map((goal) =>
          goal.id === selectedGoal ? updatedBudget : goal
        );
        setSavings(updatedSavings);
        setNewGoal({ name: "", amount: "", totalAmount: "" });
        setSelectedGoal(null);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  // Delete a budget
  const deleteGoal = async (id: string) => {
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/budgets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavings(savings.filter((goal) => goal.id !== id));
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  // Set form data when a budget is selected
  useEffect(() => {
    if (selectedGoal && selectedGoal !== "new") {
      const goal = savings.find((g) => g.id === selectedGoal);
      if (goal) {
        setNewGoal({
          name: goal.category || goal.BudgetName,
          amount: goal.amount.toString(),
          totalAmount: goal.totalAmount?.toString() || goal.Amount.toString(),
        });
      }
    } else {
      setNewGoal({ name: "", amount: "", totalAmount: "" });
    }
  }, [selectedGoal]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>💰 Manage Budgets</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Picker
          selectedValue={selectedGoal}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGoal(itemValue)}
        >
          <Picker.Item label="🔽 Select an existing budget" value={null} color="black" />
          {savings.map((goal) => (
            <Picker.Item key={goal.id} label={goal.category || goal.BudgetName} value={goal.id} color="black" />
          ))}
          <Picker.Item label="➕ Add New Budget" value="new" color="green" />
        </Picker>

        {(selectedGoal === "new" || selectedGoal) && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="🏆 Budget Name"
              placeholderTextColor="gray"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="💵 Current Saved Amount"
              placeholderTextColor="gray"
              keyboardType="numeric"
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

        <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>My Current Budgets</Text>

        <FlatList
          data={savings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.goalCard}>
              <Text style={styles.goalText}>
                🎯 {item.category || item.BudgetName}: ${item.amount} / ${item.totalAmount || item.Amount}
              </Text>
              <TouchableOpacity onPress={() => deleteGoal(item.id)} style={styles.deleteButton}>
                <Feather name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
    </View>
  );
};

export default ManageBudgets;

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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});