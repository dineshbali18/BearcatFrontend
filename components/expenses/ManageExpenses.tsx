import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";

const ManageExpenses = ({ cred, setCred, expenses, setExpenses, onClose, fetchExpenses }) => {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" });
  const userState = useSelector((state) => state.user)
  const token = userState?.token;

  const updateExpense = async () => {
    if (!newExpense.name || !newExpense.amount || !selectedExpense) return;

    try {
      const response = await fetch(
        `${Constants.expoConfig?.extra?.REACT_APP_API}:3002/expense/expenses/${selectedExpense}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Description: newExpense.name,
            Amount: newExpense.amount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      await fetchExpenses();
      setNewExpense({ name: "", amount: "" });
      setSelectedExpense(null);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(
        `${Constants.expoConfig?.extra?.REACT_APP_API}:3002/expense/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      await fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  let allExpenses = [...expenses, ...cred];

  useEffect(() => {
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
    <View style={styles.container} testID="manageExpensesScreen">
      <View style={styles.internalContainer} testID="manageExpensesContainer">
        <View style={styles.header} testID="manageExpensesHeader">
          <Text style={styles.headerText}>💸 Manage Expenses</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon} testID="closeManageExpenses">
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} testID="manageExpensesScroll">
          <Picker
            selectedValue={selectedExpense}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedExpense(itemValue)}
            testID="selectExpensePicker"
          >
            <Picker.Item label="🔽 Select an existing expense" value={null} color="black" />
            {allExpenses.map((expense) => (
              <Picker.Item key={expense.id} label={expense.CategoryName.concat(" - "+expense.Description)} value={expense.ExpenseID} color="black" />
            ))}
          </Picker>

          {(selectedExpense === "new" || selectedExpense) && (
            <View style={styles.inputContainer} testID="expenseInputForm">
              <TextInput
                style={styles.input}
                placeholder="📌 Expense Name"
                placeholderTextColor="gray"
                value={newExpense.name}
                onChangeText={(text) => setNewExpense({ ...newExpense, name: text })}
                testID="expenseNameInput"
              />
              <TextInput
                style={styles.input}
                placeholder="💰 Amount Spent"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                testID="expenseAmountInput"
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={selectedExpense === "new" ? addExpense : updateExpense}
                testID="saveExpenseButton"
              >
                <Text style={styles.addButtonText}>
                  {selectedExpense === "new" ? "✅ Add Expense" : "🔄 Update Expense"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>My Expenses</Text>

          <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>Debits</Text>
          {expenses.map((item) => (
            <View key={item.ExpenseID} style={styles.expenseCard} testID={`debitExpense-${item.ExpenseID}`}>
              <Text style={styles.expenseText}>💳 {item.CategoryName} - {item.Description}: ${item.Amount}</Text>
              <TouchableOpacity onPress={() => deleteExpense(item.ExpenseID)} style={styles.deleteButton} testID={`deleteDebitExpense-${item.ExpenseID}`}>
                <Feather name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          <Text style={{ fontWeight: "800", fontSize: 20, margin: 20 }}>Credits</Text>
          {cred.map((item) => (
            <View key={item.ExpenseID} style={styles.expenseCard} testID={`creditExpense-${item.ExpenseID}`}>
              <Text style={styles.expenseText}>💳 {item.Description} - {item.CategoryName}: ${item.Amount}</Text>
              <TouchableOpacity onPress={() => deleteExpense(item.ExpenseID)} style={styles.deleteButton} testID={`deleteCreditExpense-${item.ExpenseID}`}>
                <Feather name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ManageExpenses;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  internalContainer: {
    flex: 1,
    backgroundColor: 'white',
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
