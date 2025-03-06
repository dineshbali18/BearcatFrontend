// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Modal
// } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import Colors from "@/constants/Colors";
// import { PieChart } from "react-native-gifted-charts";
// import { useSelector } from "react-redux";
// import AddExpenseModal from "./AddExpense";
// import { Picker } from "@react-native-picker/picker";
// import ManageExpenses from "./ManageExpenses";

// // Define types
// interface Expense {
//   ExpenseID: number;
//   CategoryID: number;
//   CategoryName: string;
//   Amount: string;
//   Description: string;
//   TransactionType: string;
//   Merchandise: string;
//   Date: string;
// }

// interface ExpenseSectionProps{
//   expen: Expense;
//   spendingList: [];
//   setSpendingList: Object;
// }

// const ExpensesSection = () => {


//   const [formattedSpendingList, setFormattedSpendingList] = useState<Expense[]>([]);
  
//   const [totalExpense, setTotalExpense] = useState("0.00");
//   const [pieData, setPieData] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isManageModalVisible, setManageModalVisible] = useState(false);
//   const userState = useSelector((state) => state.user);
//   const userId = userState?.user?.id;


//   useEffect(()=>{
//     console.log("In Expenses section",expen)
//   })


//   useEffect(() => {
//     if (expen) {
//       console.log("In Expenses section", expen);
//     } else {
//       console.log("expen is undefined or null");
//     }
//   }, [expen]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <View style={styles.headerLeft}>
//           <Text style={styles.expenseHeaderText}>My <Text style={{ fontWeight: "700" }}>{expen}</Text></Text>
//           <Text style={styles.expenseAmountText}>${totalExpense}</Text>
//         </View>
//         <PieChart
//           data={pieData}
//           donut
//           showGradient
//           sectionAutoFocus
//           focusOnPress
//           semiCircle
//           radius={70}
//           innerRadius={55}
//           innerCircleColor={Colors.black}
//           centerLabelComponent={() => (
//             <View style={styles.centerLabel}>
//               <Text style={styles.centerLabelText}>${totalExpense}</Text>
//             </View>
//           )}
//         />
//         <View style={styles.header}>
//             <TouchableOpacity onPress={() => setManageModalVisible(true)}>
//               <Feather name="more-vertical" size={24} color={Colors.white} />
//             </TouchableOpacity>
//         </View>
//       </View>

//       <FlatList
//         data={[{ name: "Add Item" }, ...expenses]}
//         renderItem={({ item, index }) => (
//           index === 0 ? (
//             <TouchableOpacity onPress={() => setModalVisible(true)}>
//               <View style={styles.addItemBtn}>
//                 <Feather name="plus" size={22} color="#ccc" />
//               </View>
//             </TouchableOpacity>
//           ) : (
//             <View style={[styles.expenseBlock, { backgroundColor: item.color }]}>  
//               <Text style={styles.expenseBlockTxt1}>{item.name}</Text>
//               <Text style={styles.expenseBlockTxt2}>${item.amount}</Text>
//             </View>
//           )
//         )}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//       />
//       <Modal visible={isManageModalVisible} animationType="slide">
//         <ManageExpenses spendingList={spendingList} formattedExpenses={formattedSpendingList} setSpendingList={setSpendingList} onClose={() => setManageModalVisible(false)} />
//       </Modal>
//       <AddExpenseModal visible={modalVisible} onClose={() => setModalVisible(false)} />
//     </View>
//   );
// };

// export default ExpensesSection;

// const styles = StyleSheet.create({
//   container: { paddingHorizontal: 10 },
//   headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   headerLeft: { marginRight: 10 },
//   expenseHeaderText: { color: Colors.white, fontSize: 16 },
//   expenseAmountText: { color: Colors.white, fontSize: 36, fontWeight: "700" },
//   centerLabel: { justifyContent: "center", alignItems: "center" },
//   centerLabelText: { fontSize: 18, color: "white", fontWeight: "bold" },
//   addItemBtn: { marginTop:35,borderWidth: 2, borderColor: "#666", borderStyle: "dashed", borderRadius: 10, padding: 20, justifyContent: "center", alignItems: "center", marginRight: 20 },
//   expenseBlock: { marginTop:25,width: 100, padding: 15, borderRadius: 15, marginRight: 20 },
//   expenseBlockTxt1: { fontSize: 14, color: "white" },
//   expenseBlockTxt2: { fontSize: 16, fontWeight: "600", color: "white" },
// });
