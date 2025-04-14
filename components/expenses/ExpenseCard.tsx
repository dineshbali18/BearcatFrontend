import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";
import AddExpenseModal from "./AddExpense";
import { Picker } from "@react-native-picker/picker";
import ManageExpenses from "./ManageExpenses";
import Constants from 'expo-constants';

const ExpensesSection = ({ allExpenses, expen, spendingList, setSpendingList, total, incomeList, setIncomeList, fetchExpenses }) => {
  const [expenses, setExpenses] = useState(expen);
  const [totalExpense, setTotalExpense] = useState("0.00");
  const [pieData, setPieData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.id;

  useEffect(() => {
    setExpenses(expen);
    setTotalExpense(total);
    setPieData(expen.length > 0 ? expen.map(exp => ({ value: parseFloat(exp.amount), color: exp.color })) : [
      { value: 0, color: Colors.blue },
      { value: 100, color: Colors.white },
    ]);
  }, [expen]);

  useEffect(() => {
    console.log("IN EXPENSE SPENDING LIST....", spendingList);
  }, [spendingList]);

  const fetchBankTransactions = () => {
    fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/expense/sync-transactions/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userState?.token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.text())
      .then(async (rawData) => {
        Alert.alert("Success", "Transactions fetched!");
        await fetchExpenses();
      })
      .catch(err => console.error('Error fetching transactions:', err));
  };

  return (
    <View style={styles.container} testID="expensesSection">
      <View style={styles.headerRow} testID="expensesHeader">
        <View style={styles.headerLeft}>
          <Text style={styles.expenseHeaderText}>My <Text style={{ fontWeight: "700" }}>Expenses</Text></Text>
          <Text style={styles.expenseAmountText}>${totalExpense}</Text>
        </View>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          focusOnPress
          semiCircle
          radius={70}
          innerRadius={55}
          innerCircleColor={Colors.black}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelText}>${totalExpense}</Text>
            </View>
          )}
        />
        <TouchableOpacity onPress={fetchBankTransactions} style={styles.refreshButton} testID="fetchTransactionsButton">
          <Feather name="refresh-cw" size={14} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setManageModalVisible(true)} testID="openManageExpensesModal">
            <Feather name="more-vertical" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[{ name: "Add Item" }, ...expenses]}
        renderItem={({ item, index }) => (
          index === 0 ? (
            <TouchableOpacity testID="addExpenseButton" onPress={() => setModalVisible(true)}>
              <View style={styles.addItemBtn}>
                <Feather name="plus" size={22} color="#ccc" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.expenseBlock, { backgroundColor: item.color }]} testID={`expenseItem-${item.ExpenseID}`}>
              <Text style={styles.expenseBlockTxt1}>{item.name}</Text>
              <Text style={styles.expenseBlockTxt2}>${item.amount}</Text>
            </View>
          )
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        testID="expenseList"
      />

      <Modal visible={isManageModalVisible} animationType="slide" transparent testID="manageExpensesModal">
        <ManageExpenses 
          cred={incomeList} 
          setCred={setIncomeList} 
          expenses={spendingList} 
          setExpenses={setSpendingList} 
          onClose={() => setManageModalVisible(false)} 
          fetchExpenses={fetchExpenses} 
        />
      </Modal>

      <AddExpenseModal 
        visible={modalVisible} 
        onClose={async () => { 
          setModalVisible(false);
          await fetchExpenses();
        }} 
      />
    </View>
  );
};

export default ExpensesSection;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { marginRight: 10 },
  expenseHeaderText: { color: Colors.white, fontSize: 16 },
  expenseAmountText: { color: Colors.white, fontSize: 36, fontWeight: "700" },
  centerLabel: { justifyContent: "center", alignItems: "center" },
  centerLabelText: { fontSize: 18, color: "white", fontWeight: "bold" },
  addItemBtn: { marginTop: 35, borderWidth: 2, borderColor: "#666", borderStyle: "dashed", borderRadius: 10, padding: 20, justifyContent: "center", alignItems: "center", marginRight: 20 },
  expenseBlock: { marginTop: 25, width: 100, padding: 15, borderRadius: 15, marginRight: 20 },
  expenseBlockTxt1: { fontSize: 14, color: "white" },
  expenseBlockTxt2: { fontSize: 16, fontWeight: "600", color: "white" },
});
