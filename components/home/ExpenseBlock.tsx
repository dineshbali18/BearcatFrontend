import React, { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ExpenseType } from "@/types";
import Colors from "@/constants/Colors";
import ExpenseScreen from "../expenses/ExpenseCard";
import BudgetScreen from "../budget/BudgetCard";
import SavingScreen from "../savingGoals/SavingGoalCard";
import IncomeBlock from "@/components/expenses/IncomeBlock";
import SpendingBlock from "@/components/expenses/SpendingBlock";
import incomeList from "@/data/income.json";
import spendingList from "@/data/spending.json";
import UserBudgets from "@/components/UserBudgets"
import UserSavingGoals from "@/components/savingGoals/UserSavingGoals"
import { useSelector } from "react-redux";

// Correctly referencing the components
const ExpensesComponent = () => <ExpenseScreen />;
const SavingGoalComponent = () => <SavingScreen />;
const BudgetComponent = () => <BudgetScreen />;

interface ExpenseBlockProps {
  expenseList: ExpenseType[];
}

const ExpenseBlock = ({ expenseList }: ExpenseBlockProps) => {
  const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);

  const [selectedScreen, setSelectedScreen] = useState("")

  const handleItemPress = (name: string) => {
    console.log("Tapped on:", name);
    

    if (name === "Expenses") {
      setSelectedComponent(<ExpensesComponent />);
      setSelectedScreen("Expenses")
    } else if (name === "Saving Goal") {
      setSelectedComponent(<SavingGoalComponent />);
      setSelectedScreen("Saving Goal")
    } else if (name === "Budgets") {
      setSelectedComponent(<BudgetComponent />);
      setSelectedScreen("Budgets")
    } else {
      setSelectedScreen("")
      setSelectedComponent(null);
    }
  };

  const renderItem: ListRenderItem<ExpenseType> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleItemPress(item.name)} key={item.id}>
        <View
          style={[
            styles.expenseBlock,
            {
              backgroundColor:
                item.name === "Food"
                  ? Colors.blue
                  : item.name === "Saving"
                  ? Colors.white
                  : Colors.tintColor,
            },
          ]}
        >
          <Text
            style={[
              styles.expenseBlockTxt1,
              {
                color:
                  item.name === "Food" || item.name === "Saving"
                    ? Colors.black
                    : Colors.white,
              },
            ]}
          >
            {item.name}
          </Text>
          <View style={styles.expenseBlock3View}>
            <Text
              style={[
                styles.expenseBlockTxt1,
                {
                  color:
                    item.name === "Food" || item.name === "Saving"
                      ? Colors.black
                      : Colors.white,
                },
              ]}
            >
              {item.percentage || "0"}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Horizontal scrolling expense items  -- for menu buttons..... */}
      <FlatList
        data={expenseList}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        style={styles.horizontalListContainer}
      />

      {/* Display the selected component */}
      {selectedComponent !== null && (
        <View style={styles.detailWrapper}>{selectedComponent}</View>
      )}
      
      {/* Vertical stacking of IncomeBlock and SpendingBlock */}
      {selectedComponent !== null && selectedScreen === "Expenses"?
      <View style={styles.verticalComponents}>
        <IncomeBlock incomeList={incomeList} />
        <SpendingBlock spendingList={spendingList} />
      </View>:<></>
      }

      {selectedComponent !== null && selectedScreen === "Budgets"?
      <View style={styles.verticalComponents}>
        <UserBudgets incomeList={incomeList} />
      </View>:<></>
      }

      {selectedComponent !== null && selectedScreen === "Saving Goal"?
      <View style={styles.verticalComponents}>
        <UserSavingGoals incomeList={incomeList} />
        {/* <SpendingBlock spendingList={spendingList} /> */}
      </View>:<></>
      }
    </View>
  );
};

export default ExpenseBlock;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  horizontalListContainer: {
    marginBottom: 10,
  },
  expenseBlock: {
    backgroundColor: Colors.tintColor,
    width: 100,
    padding: 15,
    borderRadius: 15,
    marginRight: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expenseBlockTxt1: {
    fontSize: 14,
  },
  expenseBlock3View: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 10,
  },
  detailWrapper: {
    marginTop: 20,
  },
  verticalComponents: {
    flexDirection: "column",
    gap: 10,
  },
});
