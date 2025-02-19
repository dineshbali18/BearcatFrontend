import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ExpenseType } from "@/types";
import { PieChart } from "react-native-gifted-charts";

const ExpensesSection = () => {
  // Default expense list data
  const expenseList: ExpenseType[] = [
    { id: "1", name: "Food", amount: "250.00", percentage: "30" },
    { id: "2", name: "Electronics", amount: "500.00", percentage: "35" },
    { id: "3", name: "Clothing", amount: "725.00", percentage: "35" },
  ];

  // Default PieChart data
  const pieData: any[] = [
    { value: 30, color: Colors.blue },
    { value: 35, color: Colors.white },
    { value: 35, color: Colors.tintColor },
  ];

  const totalExpense = "1475.00";
  const percentage = "47%";

  // Prepend a static "Add Item" object to the expense list
  const data = [{ name: "Add Item" }, ...expenseList];

  const renderExpenseItem = ({
    item,
    index,
  }: {
    item: Partial<ExpenseType>;
    index: number;
  }) => {
    // Render the "Add Item" button for the first item
    if (index === 0) {
      return (
        <TouchableOpacity onPress={() => {}} key="add-item">
          <View style={styles.addItemBtn}>
            <Feather name="plus" size={22} color="#ccc" />
          </View>
        </TouchableOpacity>
      );
    }

    // Split the amount into whole and cents parts
    const amountParts = item.amount?.split(".") || ["0", "00"];

    // Set colors based on the expense type
    let bgColor = Colors.tintColor;
    let textColor = Colors.white;
    if (item.name === "Food") {
      bgColor = Colors.blue;
      textColor = Colors.black;
    } else if (item.name === "Electronics") {
      bgColor = Colors.white;
      textColor = Colors.black;
    }

    return (
      <View
        style={[styles.expenseBlock, { backgroundColor: bgColor }]}
        key={index.toString()}
      >
        <Text style={[styles.expenseBlockTxt1, { color: textColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.expenseBlockTxt2, { color: textColor }]}>
          ${amountParts[0]}.
          <Text style={styles.expenseBlockTxt2Span}>{amountParts[1]}</Text>
        </Text>
        {/* <View style={styles.expenseBlock3View}>
          <Text style={[styles.expenseBlockTxt1, { color: textColor }]}>
            {item.percentage}%
          </Text>
        </View> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Expense Information and PieChart */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.expenseHeaderText}>
            Total <Text style={{ fontWeight: "700" }}>Accumulated Budget </Text>
          </Text>
          <Text style={styles.expenseAmountText}>
            ${totalExpense.split(".")[0]}.
            <Text style={styles.expenseAmountCentsText}>
              {totalExpense.split(".")[1]}
            </Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
        </View>
      </View>

      {/* Horizontal List of Expense Items */}
      {/* <View style={styles.expenseListWrapper}>
        <FlatList
          data={data}
          renderItem={renderExpenseItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
        />
      </View> */}
    </View>
  );
};

export default ExpensesSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    marginRight: 10,
  },
  expenseHeaderText: {
    color: Colors.white,
    fontSize: 16,
  },
  expenseAmountText: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: "700",
  },
  expenseAmountCentsText: {
    fontSize: 22,
    fontWeight: "400",
  },
  headerRight: {
    paddingVertical: 20,
    alignItems: "center",
  },
  centerLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  expenseListWrapper: {
    paddingVertical: 20,
  },
  addItemBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 10,
    marginRight: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseBlock: {
    width: 100,
    padding: 15,
    borderRadius: 15,
    marginRight: 20,
  },
  expenseBlockTxt1: {
    fontSize: 14,
  },
  expenseBlockTxt2: {
    fontSize: 16,
    fontWeight: "600",
  },
  expenseBlockTxt2Span: {
    fontSize: 12,
    fontWeight: "400",
  },
  expenseBlock3View: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 10,
  },
});
