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

const ExpensesSection = () => {
  // const userId = 1;
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState("0.00");
  const [pieData, setPieData] = useState([]);
  const userState = useSelector((state) => state.user); // Assume user is a JSON string
  const userId = userState.user.id

  console.log("User Data:", userState); 
  console.log("User Data:1111111111111", userState.user);
  console.log("User Data:1111111111112222221", userState.user.id); 

  // try {
  //   const parsedUser = JSON.parse(userState); // Parse JSON string if needed
  //   console.log("Parsed User Token:", parsedUser?.token); // Access parsed token
  // } catch (error) {
  //   console.error("Error parsing JSON:", error); // Handle any parsing errors
  // }
  

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.194:3002/expense/expenses/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userState?.token}`, // Replace with actual token
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Fetched Data:", data);

        if (data.categorizedExpenses) {
          let total = 0;
          const colors = [
            "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFA8",
            "#FFD700", "#FF4500", "#00CED1", "#8A2BE2", "#DC143C", "#20B2AA"
          ];

          const formattedExpenses = data.categorizedExpenses.map((category, index) => {
            const categoryTotal = parseFloat(category.debitTotal);
            total += categoryTotal;
            return {
              id: category.categoryName,
              name: category.categoryName,
              amount: category.debitTotal,
              percentage: categoryTotal,
              color: colors[index % colors.length], // Assign a unique color
            };
          });

          setExpenses(formattedExpenses);
          setTotalExpense(total.toFixed(2));

          // Prepare pie chart data
          const pieChartData = formattedExpenses.map((exp) => ({
            value: parseFloat(exp.percentage),
            color: exp.color,
          }));
          setPieData(pieChartData);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [userId]);

  const data = [{ name: "Add Item" }, ...expenses];

  const renderExpenseItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={() => {}} key="add-item">
          <View style={styles.addItemBtn}>
            <Feather name="plus" size={22} color="#ccc" />
          </View>
        </TouchableOpacity>
      );
    }

    const amountParts = item.amount?.split(".") || ["0", "00"];

    return (
      <View
        style={[
          styles.expenseBlock,
          { backgroundColor: item.color }, // Assign color dynamically
        ]}
        key={index.toString()}
      >
        <Text style={styles.expenseBlockTxt1}>{item.name}</Text>
        <Text style={styles.expenseBlockTxt2}>
          ${amountParts[0]}.
          <Text style={styles.expenseBlockTxt2Span}>{amountParts[1]}</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.expenseHeaderText}>
            My <Text style={{ fontWeight: "700" }}>Expenses</Text>
          </Text>
          <Text style={styles.expenseAmountText}>
            ${totalExpense.split(".")[0]}.
            <Text style={styles.expenseAmountCentsText}>
              {totalExpense.split(".")[1]}
            </Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
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
                <Text style={styles.centerLabelText}>
                  ${totalExpense} {/* Show total expense */}
                </Text>
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.expenseListWrapper}>
        <FlatList
          data={data}
          renderItem={renderExpenseItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default ExpensesSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
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
    fontSize: 18,
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
    color: "white",
  },
  expenseBlockTxt2: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  expenseBlockTxt2Span: {
    fontSize: 12,
    fontWeight: "400",
    color: "white",
  },
});
