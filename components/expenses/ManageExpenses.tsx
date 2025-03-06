import React, { useEffect, useState } from "react";
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

const ManageExpenses = ({ cred, setCred, expenses, setExpenses, onClose }) => {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" });
  
  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    const newEntry = {
      id: Math.random().toString(),
      name: newExpense.name,
      amount: newExpense.amount,
    };
    setExpenses([...expenses, newEntry]);
    setNewExpense({ name: "", amount: "" });
    setSelectedExpense(null);
  };

  const updateExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;

    const updatedExpenses = expenses.map((expense) =>
      expense.id === selectedExpense
        ? { ...expense, name: newExpense.name, amount: newExpense.amount }
        : expense
    );
    setExpenses(updatedExpenses);
    setNewExpense({ name: "", amount: "" });
    setSelectedExpense(null);
  };

  const deleteExpense = (id: string) => {
    console.log("IDDD",id)
    const deletedExpenses=expenses.filter((expense) => expense.ExpenseID !== Number(id));
    setExpenses(deletedExpenses);
  };

  useEffect(()=>{
    console.log("QQQQQ111111111111",cred)
  })

  React.useEffect(() => {
    if (selectedExpense && selectedExpense !== "new") {
      const expense = expenses.find((e) => e.id === selectedExpense);
      if (expense) {
        setNewExpense({ name: expense.name, amount: expense.amount });
      }
    } else {
      setNewExpense({ name: "", amount: "" });
    }
  }, [selectedExpense]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>💸 Manage Expenses</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Picker
          selectedValue={selectedExpense}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedExpense(itemValue)}
        >
          <Picker.Item label="🔽 Select an existing expense" value={null} color="black" />
          {expenses.map((expense) => (
            <Picker.Item key={expense.id} label={expense.CategoryName.concat(" - "+expense.Description)} value={expense.ExpenseID} color="black" />
          ))}
          <Picker.Item label="➕ Add New Expense" value="new" color="red" />
        </Picker>

        {(selectedExpense === "new" || selectedExpense) && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="📌 Expense Name"
              placeholderTextColor="gray"
              value={newExpense.name}
              onChangeText={(text) => setNewExpense({ ...newExpense, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="💰 Amount Spent"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={selectedExpense === "new" ? addExpense : updateExpense}
            >
              <Text style={styles.addButtonText}>
                {selectedExpense === "new" ? "✅ Add Expense" : "🔄 Update Expense"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>My Expenses</Text>

        <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>Debits</Text>
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseCard}>
              <Text style={styles.expenseText}>💳 {item.CategoryName} - {item.Description}: ${item.Amount}</Text>
              <TouchableOpacity onPress={() => deleteExpense(item.ExpenseID)} style={styles.deleteButton}>
                <Feather name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
        <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>Credits</Text>
        <FlatList
          data={cred}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseCard}>
              <Text style={styles.expenseText}>💳 {item.Description} - {item.CategoryName}: ${item.Amount}</Text>
              <TouchableOpacity onPress={() => deleteExpense(item.ExpenseID)} style={styles.deleteButton}>
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

export default ManageExpenses;

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
    backgroundColor: "#E53935",
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
  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
    borderRadius: 12,
  },
  expenseText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    margin: 20,
  },
});
