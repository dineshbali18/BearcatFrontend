import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Constants from 'expo-constants';

const ManageBudgets = ({ budgets = [], setBudgets, fetchBudgets, onClose }) => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState({ 
    name: "", 
    targetAmount: "",
    spentAmount: "" 
  });

  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.id;
  const token = userState?.token;

  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const parseNumberInput = (value) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
  };

  const addBudget = async () => {
    if (!newBudget.name || !newBudget.targetAmount) return;
    try {
      const response = await fetch(`${Constants.manifest?.extra?.REACT_APP_API}:3002/budget/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BudgetName: newBudget.name,
          UserID: userId,
          Amount: parseFloat(newBudget.targetAmount) || 0,
          AmountSpent: parseFloat(newBudget.spentAmount) || 0,
          StartDate: new Date().toISOString().split("T")[0],
          EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
        }),
      });
      if (!response.ok) throw new Error("Failed to add budget");

      await fetchBudgets();
      setNewBudget({ name: "", targetAmount: "", spentAmount: "" });
      setSelectedBudget(null);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const updateBudget = async () => {
    if (!newBudget.name || !newBudget.targetAmount || !selectedBudget) return;
    try {
      const response = await fetch(`${Constants.manifest?.extra?.REACT_APP_API}:3002/budget/budgets/${selectedBudget}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BudgetName: newBudget.name,
          Amount: parseFloat(newBudget.targetAmount) || 0,
          AmountSpent: parseFloat(newBudget.spentAmount) || 0,
          StartDate: new Date().toISOString().split("T")[0],
          EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
        }),
      });
      if (!response.ok) throw new Error("Failed to update budget");

      await fetchBudgets();
      setNewBudget({ name: "", targetAmount: "", spentAmount: "" });
      setSelectedBudget(null);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const deleteBudget = async (id) => {
    try {
      const response = await fetch(`${Constants.manifest?.extra?.REACT_APP_API}:3002/budget/budgets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete budget");

      if (budgets.length > 0) {
        if (selectedBudget === id) {
          setNewBudget({ name: "", targetAmount: "", spentAmount: "" });
          setSelectedBudget(null);
        }
        const updatedBudgets = budgets.filter((budget) => budget.id !== id);
        setBudgets(updatedBudgets);
        if (updatedBudgets.length === 0) {
          setNewBudget({ name: "", targetAmount: "", spentAmount: "" });
          setSelectedBudget(null);
        }
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  React.useEffect(() => {
    if (selectedBudget && selectedBudget !== "new") {
      const budget = budgets.find((b) => b.id === selectedBudget);
      if (budget) {
        setNewBudget({
          name: budget.name,
          targetAmount: formatNumber(Number(budget.totalAmount)),
          spentAmount: formatNumber(Number(budget.amount)),
        });
      }
    } else if (selectedBudget === null) {
      setNewBudget({ name: "", targetAmount: "", spentAmount: "" });
    }
  }, [selectedBudget, budgets]);

  return (
    <View style={styles.container} testID="manageBudgetsContainer">
      <View style={styles.header} testID="manageBudgetsHeader">
        <Text style={styles.headerText}>💰 Manage Budgets</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon} testID="closeManageBudgetsButton">
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} testID="manageBudgetsScrollView">
        <Picker
          selectedValue={selectedBudget}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedBudget(itemValue)}
          testID="budgetPicker"
        >
          <Picker.Item label="🔽 Select an existing budget" value={null} color="black" />
          {budgets.map((budget) => (
            <Picker.Item key={budget.id} label={budget.name} value={budget.id} color="black" testID={`budgetPickerItem-${budget.id}`} />
          ))}
          <Picker.Item label="➕ Add New Budget" value="new" color="green" testID="budgetPickerAddNew" />
        </Picker>

        {(selectedBudget === "new" || selectedBudget) && (
          <View style={styles.inputContainer} testID="budgetFormSection">
            <TextInput
              style={styles.input}
              placeholder="🏆 Budget Name"
              placeholderTextColor="gray"
              value={newBudget.name}
              onChangeText={(text) => setNewBudget({ ...newBudget, name: text })}
              testID="budgetNameInput"
            />
            <TextInput
              style={styles.input}
              placeholder="🎯 Total Budget Amount"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={newBudget.targetAmount}
              onChangeText={(text) => setNewBudget({ ...newBudget, targetAmount: parseNumberInput(text) })}
              testID="targetAmountInput"
            />
            <TextInput
              style={styles.input}
              placeholder="💵 Amount Spent So Far"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={newBudget.spentAmount}
              onChangeText={(text) => setNewBudget({ ...newBudget, spentAmount: parseNumberInput(text) })}
              testID="spentAmountInput"
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={selectedBudget === "new" ? addBudget : updateBudget}
              testID={selectedBudget === "new" ? "addBudgetButton" : "updateBudgetButton"}
            >
              <Text style={styles.addButtonText}>
                {selectedBudget === "new" ? "✅ Add Budget" : "🔄 Update Budget"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionHeader} testID="budgetListHeader">My Current Budgets</Text>

        {budgets.length > 0 ? (
          <View style={styles.listContainer} testID="budgetList">
            {budgets.map((item) => (
              <View key={item.id} style={styles.goalCard} testID={`budgetItem-${item.id}`}>
                <Text style={styles.goalText}>
                  🎯 {item.name}: ${formatNumber(item.amount)} / ${formatNumber(item.AmountSpent || item.totalAmount)} (
                  {item.percentage ? `${item.percentage}%` : '0%'})
                </Text>
                <TouchableOpacity
                  onPress={() => deleteBudget(item.id)}
                  style={styles.deleteButton}
                  testID={`deleteBudgetButton-${item.id}`}
                >
                  <Feather name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText} testID="noBudgetsMessage">
            No budgets found. Add a new budget to get started!
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

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
    flexShrink: 1,
  },
  picker: {
    margin: 20,
  },
  sectionHeader: {
    fontWeight: "800",
    fontSize: 20,
    margin: 20,
    color: "black",
  },
  deleteButton: {
    marginLeft: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default ManageBudgets;
