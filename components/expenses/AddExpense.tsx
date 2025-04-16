import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';

const AddExpenseModal = ({ visible, onClose, onExpenseAdded }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.id;

  useEffect(() => {
    if (visible) fetchCategories();
  }, [visible]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/category`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userState?.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddExpense = async () => {
    if (!amount || !selectedCategory || !description || !date) {
      alert("Please fill all fields!");
      return;
    }

    const expenseData = {
      userID: userId,
      Amount: parseFloat(amount),
      CategoryID: parseInt(selectedCategory),
      TransactionType: transactionType,
      Description: description,
      Date: date,
    };

    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/expense/create/expenses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userState?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      console.log("RESSSS", await response.json());

      if (response.ok) {
        alert("Expense added successfully!");
        onClose();
      } else {
        alert("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer} testID="expenseModalContainer">
        <View style={styles.modalContent} testID="expenseModalContent">
          <TouchableOpacity style={styles.closeButton} onPress={onClose} testID="closeExpenseModal">
            <Text style={styles.closeButtonText}>❌</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Add Expense</Text>

          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            testID="expenseAmountInput"
          />

          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.input}
            testID="expenseCategoryPicker"
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            testID="expenseDescriptionInput"
          />

          <TextInput
            style={styles.input}
            placeholder="Transaction Type"
            value={transactionType}
            onChangeText={setTransactionType}
            testID="expenseTransactionTypeInput"
          />

          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            testID="expenseDateInput"
          />

        <TouchableOpacity
          onPress={handleAddExpense}
          style={styles.submitButton}
          testID="addExpenseSubmitButton"
          accessible={true}
  accessibilityLabel="addExpenseSubmitButton"
        >
          <Text style={styles.submitButtonText}>ADD EXPENSE</Text>
        </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default AddExpenseModal;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: 300, padding: 20, backgroundColor: "white", borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  closeButton: { alignSelf: "flex-end" },
  closeButtonText: { fontSize: 18 },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  
});
