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
import Colors from "@/constants/Colors";
import { ExpenseType } from "@/types";
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

    const updatedSavings = savings.map((goal: ExpenseType) =>
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
    setSavings(savings.filter((goal: ExpenseType) => goal.id !== id));
  };

  // Load selected goal's data into the input fields if it's not the "new" option.
  React.useEffect(() => {
    if (selectedGoal && selectedGoal !== "new") {
      const goal = savings.find((g: ExpenseType) => g.id === selectedGoal);
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
      {/* Header with Close Button */}
      <View style={styles.header}>
        <Text style={styles.headerText}>💰 Manage Savings Goals</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Feather name="x" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Goal Selection Dropdown */}
        <Picker
          selectedValue={selectedGoal}
          style={styles.picker}
          dropdownIconColor={Colors.black}
          itemStyle={styles.pickerItem} // This customizes the dropdown item appearance on iOS
          onValueChange={(itemValue) => {
            setSelectedGoal(itemValue);
          }}
        >
          <Picker.Item label="🔽 Select an existing goal" value={null} color={Colors.grey} />
          {savings.map((goal: ExpenseType) => (
            <Picker.Item key={goal.id} label={goal.name} value={goal.id} color={Colors.grey} />
          ))}
          <Picker.Item label="➕ Add New Goal" value="new" color={Colors.green} />
        </Picker>

        {/* New Goal Input Fields (Only Show if 'New' is Selected or an Existing Goal is Selected) */}
        {(selectedGoal === "new" || selectedGoal) && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="🏆 Goal Name"
              placeholderTextColor={Colors.grey}
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="💵 Current Saved Amount"
              placeholderTextColor={Colors.grey}
              keyboardType="numeric"
              value={newGoal.amount}
              onChangeText={(text) => setNewGoal({ ...newGoal, amount: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="🎯 Total Savings Goal"
              placeholderTextColor={Colors.grey}
              keyboardType="numeric"
              value={newGoal.totalAmount}
              onChangeText={(text) => setNewGoal({ ...newGoal, totalAmount: text })}
            />

            {/* Add/Update Button */}
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

        {/* List of Goals with Delete Option */}
        <FlatList
          data={savings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.goalCard}>
              <Text style={styles.goalText}>
                🎯 {item.name}: ${item.amount} / ${item.totalAmount} ({item.percentage}%)
              </Text>
              <TouchableOpacity onPress={() => deleteGoal(item.id)} style={styles.deleteButton}>
                <Feather name="trash" size={20} color={Colors.red} />
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
    backgroundColor: "#1E1E1E",
    paddingTop: 50,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#222831",
    borderBottomWidth: 1,
    borderBottomColor: "#333845",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
  },
  closeIcon: {
    padding: 5,
  },
  picker: {
    backgroundColor: "#333845",
    color: Colors.white,
    borderRadius: 10,
    marginBottom: 20,
  },
  // This style will affect the dropdown items on iOS.
  pickerItem: {
    backgroundColor: "#444B5A", // Change this to your desired background color for items
    color: Colors.white,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#444B5A",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    color: Colors.white,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  goalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#333845",
    marginBottom: 10,
    borderRadius: 8,
  },
  goalText: {
    color: "#F8F8F8",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
