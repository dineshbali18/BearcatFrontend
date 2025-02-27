import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ManageSavingGoals = ({ savings, setSavings, onClose }: any) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ name: "", amount: "", totalAmount: "" });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.totalAmount) return;
    const newEntry = {
      id: Math.random().toString(),
      name: newGoal.name,
      amount: newGoal.amount,
      totalAmount: newGoal.totalAmount,
      percentage: ((parseFloat(newGoal.amount) / parseFloat(newGoal.totalAmount)) * 100).toFixed(0),
    };
    setSavings([...savings, newEntry]);
    setNewGoal({ name: "", amount: "", totalAmount: "" });
    setSelectedGoal(null);
  };

  const updateGoal = () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.totalAmount) return;

    const updatedSavings = savings.map((goal) =>
      goal.id === selectedGoal
        ? {
            ...goal,
            name: newGoal.name,
            amount: newGoal.amount,
            totalAmount: newGoal.totalAmount,
            percentage: ((parseFloat(newGoal.amount) / parseFloat(newGoal.totalAmount)) * 100).toFixed(0),
          }
        : goal
    );
    setSavings(updatedSavings);
    setNewGoal({ name: "", amount: "", totalAmount: "" });
    setSelectedGoal(null);
  };

  const deleteGoal = (id: string) => {
    setSavings(savings.filter((goal) => goal.id !== id));
  };

  React.useEffect(() => {
    if (selectedGoal && selectedGoal !== "new") {
      const goal = savings.find((g) => g.id === selectedGoal);
      if (goal) {
        setNewGoal({
          name: goal.name,
          amount: goal.amount,
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

      <ScrollView contentContainerStyle={styles.content}>
        <Picker
          selectedValue={selectedGoal}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGoal(itemValue)}
        >
          <Picker.Item label="🔽 Select an existing goal" value={null} color="gray" />
          {savings.map((goal) => (
            <Picker.Item key={goal.id} label={goal.name} value={goal.id} color="gray" />
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

        <FlatList
          data={savings}
          keyExtractor={(item) => item.id}
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
      </ScrollView>
    </View>
  );
};

export default ManageSavingGoals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
});
