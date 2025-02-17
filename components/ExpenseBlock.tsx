import React, { useState } from "react";
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
import ExpenseScreen from "./ExpenseCard";
import IncomeBlock from "@/components/IncomeBlock";
import SpendingBlock from "@/components/SpendingBlock";
import incomeList from "@/data/income.json";
import spendingList from "@/data/spending.json";

// Example detail component for "Expenses"
const ExpensesComponent = () => <ExpenseScreen />;

interface ExpenseBlockProps {
  expenseList: ExpenseType[];
}

const ExpenseBlock = ({ expenseList }: ExpenseBlockProps) => {
  const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);

  // Debugging logs
  console.log("Current selectedComponent:", selectedComponent);

  const handleItemPress = (name: string) => {
    console.log("Tapped on:", name);
    
    if (name === "Expenses") {
      setSelectedComponent(<ExpensesComponent />);
    } else {
      setSelectedComponent(null); // Ensure it's set to null
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
    <View style={{ paddingVertical: 20 }}>
      {/* Expenses should scroll horizontally */}
      <View style={styles.horizontalListContainer}>
        <FlatList
          data={expenseList}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      {/* Selected component will show below other components */}
      {selectedComponent !== null && (
        <>
        <View style={styles.detailWrapper}>{selectedComponent}</View>
        <View style={styles.verticalComponents}>
        <IncomeBlock incomeList={incomeList} />
        <SpendingBlock spendingList={spendingList} />
      </View>
      </>
      )}

      {/* These components should be stacked vertically below */}
      

      
    </View>
  );
};

export default ExpenseBlock;

const styles = StyleSheet.create({
  horizontalListContainer: {
    marginBottom: 10, // Adds spacing between horizontal list and vertical components
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
  verticalComponents: {
    flexDirection: "column",
    gap: 10, // Ensures vertical spacing between IncomeBlock and SpendingBlock
  },
  detailWrapper: {
    marginTop: 20,
  },
});
