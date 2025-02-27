import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";
import AddExpenseModal from "./AddExpense";
import { Picker } from "@react-native-picker/picker";


const ExpensesSection = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState("0.00");
  const [pieData, setPieData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const userId = userState?.user?.id;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          `http://18.117.93.67:3002/expense/expenses/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userState?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.categorizedExpenses) {
          let total = 0;
          const colors = [
            "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFA8",
            "#FFD700", "#FF4500", "#00CED1", "#8A2BE2", "#DC143C", "#20B2AA",
            "#FFD700", "#FF4500", "#00CED1", "#8A2BE2", "#DC143C", "#20B2AA"
          ];

          const formattedExpenses = data.categorizedExpenses.map((category, index) => {
            const categoryTotal = parseFloat(category.debitTotal);
            total += categoryTotal;
            return {
              id: category.categoryName,
              name: category.categoryName,
              amount: category.debitTotal,
              color: colors[index % colors.length],
            };
          });

          setExpenses(formattedExpenses);
          setTotalExpense(total.toFixed(2));
          setPieData(formattedExpenses.map(exp => ({ value: parseFloat(exp.amount), color: exp.color })));
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
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
      </View>

      <FlatList
        data={[{ name: "Add Item" }, ...expenses]}
        renderItem={({ item, index }) => (
          index === 0 ? (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={styles.addItemBtn}>
                <Feather name="plus" size={22} color="#ccc" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.expenseBlock, { backgroundColor: item.color }]}>  
              <Text style={styles.expenseBlockTxt1}>{item.name}</Text>
              <Text style={styles.expenseBlockTxt2}>${item.amount}</Text>
            </View>
          )
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      
      <AddExpenseModal visible={modalVisible} onClose={() => setModalVisible(false)} />
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
  addItemBtn: { marginTop:35,borderWidth: 2, borderColor: "#666", borderStyle: "dashed", borderRadius: 10, padding: 20, justifyContent: "center", alignItems: "center", marginRight: 20 },
  expenseBlock: { marginTop:25,width: 100, padding: 15, borderRadius: 15, marginRight: 20 },
  expenseBlockTxt1: { fontSize: 14, color: "white" },
  expenseBlockTxt2: { fontSize: 16, fontWeight: "600", color: "white" },
});
