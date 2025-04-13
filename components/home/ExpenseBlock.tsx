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
import Constants from 'expo-constants';

// // Correctly referencing the components
const ExpensesComponent = () => <ExpenseScreen />;
const SavingGoalComponent = () => <SavingScreen />;
const BudgetComponent = () => <BudgetScreen />;

interface ExpenseBlockProps {
  expenseList: ExpenseType[];
}

// Define types
interface Expense {
  ExpenseID: number;
  CategoryID: number;
  CategoryName: string;
  Amount: string;
  Description: string;
  TransactionType: string;
  Merchandise: string;
  Date: string;
}

const ExpenseBlock = ({ expenseList }: ExpenseBlockProps) => {
  console.log("MENU",expenseList)

  const [allExpenses,setAllExpenses] = useState([])

  const [expenses, setExpenses] = useState([]);
  const [incomeList,setIncomeList] = useState([]);
  const [spendingList,setSpendingList] = useState([]);
  const [totalExpenseAmt,setTotalExpenseAmt] = useState("");

  const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);

  const [selectedScreen, setSelectedScreen] = useState("")

  const userState = useSelector((state) => state?.user);
  const userId = userState?.user?.id;

  useEffect(() => {
    console.log("FETCH EXPENSES.....")

    fetchExpenses();
  }, []);
  
  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `${Constants.expoConfig?.extra?.REACT_APP_API}:3002/expense/expenses/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userState?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data?.categorizedExpenses) {
        const expenses = data.categorizedExpenses.flatMap((category: any) =>
          category.expenses);
        const debits = data.categorizedExpenses.flatMap((category: any) =>
          category.expenses.filter((expense: Expense) => 
            expense.TransactionType && (expense.TransactionType.toLowerCase() === "debit" || expense.TransactionType.toLowerCase() === "withdrawal")
          ));
        
        


console.log(expenses); 


        console.log("EEEEEEEEE",expenses)

        setAllExpenses(expenses)

        console.log("DEBITS:::::",debits)
        debits.sort((a,b)=> new Date(b.Date).getTime() - new Date(a.Date).getTime())
        setSpendingList(debits);
        console.log("AAAAAQQQQQ:::SPENDING",spendingList)
      }

      if (data?.categorizedExpenses) {
        const credits = data.categorizedExpenses.flatMap((category: any) =>
          category.expenses.filter((expense: Expense) => expense.TransactionType && (expense.TransactionType.toLowerCase() === "credit" || expense.TransactionType.toLowerCase()=="deposit"))
        );
        console.log("credits:::::",credits)
        credits.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        setIncomeList(credits);
        console.log("AAAAAQQQQQ:::INCOME",incomeList)
      }

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
            amount: Number(category.debitTotal)+Number(category.creditTotal),
            color: colors[index % colors.length],
          };
        });

        console.log("FORMAATTED",formattedExpenses)

        setExpenses(formattedExpenses);
        setTotalExpenseAmt(total.toFixed(2));
        // setPieData(formattedExpenses.map(exp => ({ value: parseFloat(exp.amount), color: exp.color })));
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };


  useEffect(()=>{
    console.log("CHANGES IN SPENDING BLOCK.........")
    console.log(spendingList)
    // setSpendingList([])
  },[spendingList])

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
      {/* {selectedComponent !== null && (
        <View style={styles.detailWrapper}>{selectedComponent}</View>
      )} */}
      
      {/* Vertical stacking of IncomeBlock and SpendingBlock */}
      {selectedComponent !== null && selectedScreen === "Expenses"?
      <View style={styles.verticalComponents}>
        <ExpenseScreen allExpenses={allExpenses} expen={expenses} spendingList={spendingList} setSpendingList={setSpendingList} total={totalExpenseAmt} incomeList={incomeList} setIncomeList={setIncomeList} fetchExpenses={fetchExpenses}/>
        <IncomeBlock incomeList={incomeList} />
        <SpendingBlock spendingList={spendingList} />
      </View>:<></>
      }

      {selectedComponent !== null && selectedScreen === "Budgets"?
      <View style={styles.verticalComponents}>
        <BudgetScreen expenses={allExpenses} setExpenses={setAllExpenses} fetchExpenses={fetchExpenses}/>
        <UserBudgets incomeList={incomeList} />
      </View>:<></>
      }

      {selectedComponent !== null && selectedScreen === "Saving Goal"?
      <View style={styles.verticalComponents}>
        <SavingScreen expenses={allExpenses} setExpenses={setAllExpenses} fetchExpenses={fetchExpenses}/>
        <UserSavingGoals incomeList={incomeList}/>
        {/* <SpendingBlock spendingList={spendingList} /> */}
      </View>:<></>
      }
    </View>
  );
}
// };

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
    height: 60, // Added height
    padding: 10,
    borderRadius: 15,
    marginRight: 20,
    justifyContent: "center", // Center text vertically
    alignItems: "center",     // Center text horizontally
  },
  expenseBlockTxt1: {
    fontSize: 15,
    textAlign: "center",
    flexWrap: "wrap",
    fontWeight: 700,
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
