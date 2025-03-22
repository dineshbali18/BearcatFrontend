import React, { useState } from "react";
 import {
   FlatList,
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

 
 const ManageBudgets = ({ savings, setSavings, onClose, fetchBudgets }: any) => {

  console.log("SSSS",savings)

   const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
   const [newGoal, setNewGoal] = useState({ name: "", amount: "", totalAmount: "" });
   const userState = useSelector((state) => state.user); // Assume user is a JSON string
   const userId = userState.user.id;
   const token = userState?.token;


   const addGoal = async () => {
    if (!newGoal.name || !newGoal.amount) return;
  
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.token}`,
        },
        body: JSON.stringify({
          BudgetName: newGoal.name,
          UserID: userId, // Use the current user's ID
          Amount: newGoal.totalAmount,
          AmountSpent: newGoal.amount,
          StartDate: new Date().toISOString().split("T")[0], // Current date
          EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0], // One month from now
        }),
      });

      console.log("RRRRRR",response)
  
      if (!response.ok) {
        throw new Error("Failed to add budget");
      }
  
      await fetchBudgets();
  
      // Reset the form
      setNewGoal({ name: "", amount: "", totalAmount: "" });
      setSelectedGoal(null);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };
 
  const updateGoal = async () => {
    if (!newGoal.name || !newGoal.amount || !selectedGoal) return;
  
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/budgets/${selectedGoal}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.token}`,
        },
        body: JSON.stringify({
          BudgetName: newGoal.name,
          Amount: newGoal.totalAmount,
          AmountSpent: newGoal.amount,
          StartDate: new Date().toISOString().split("T")[0], // Current date
          EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0], // One month from now
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update budget");
      }
  
      // Update local state with the updated budget
      const updatedSavings = savings.map((goal) =>
        goal.id === selectedGoal
          ? {
              ...goal,
              name: newGoal.name,
              amount: newGoal.amount,
              totalAmount: newGoal.totalAmount,
              percentage: (parseFloat(newGoal.totalAmount)/parseFloat(newGoal.amount))*100,
            }
          : goal
      );
  
      setSavings(updatedSavings);
  
      // Reset the form
      setNewGoal({ name: "", amount: "", totalAmount: "" });
      setSelectedGoal(null);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/budget/budgets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userState.token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }
  
      // Update local state by removing the deleted budget
      setSavings(savings.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };
 
   React.useEffect(() => {
     if (selectedGoal && selectedGoal !== "new") {
       const goal = savings.find((g) => g.id === selectedGoal);
       if (goal) {
         setNewGoal({
           name: goal.name,
           amount: goal.amount,
           totalAmount: goal.amountSpent,
         });
       }
     } else {
       setNewGoal({ name: "", amount: "", totalAmount: "" });
     }
   }, [selectedGoal]);
 
   return (
     <View style={styles.container}>
       <View style={styles.header}>
         <Text style={styles.headerText}>💰 Manage Budgets</Text>
         <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
           <Feather name="x" size={24} color="black" />
         </TouchableOpacity>
       </View>
 
       <ScrollView contentContainerStyle={styles.content}>
         <Picker
           selectedValue={selectedGoal}
           style={styles.picker}
           onValueChange={(itemValue) => setSelectedGoal(itemValue)}
         >
           <Picker.Item label="🔽 Select an existing budget" value={null} color="black" />
           {savings.map((goal) => (
             <Picker.Item key={goal.id} label={goal.name} value={goal.id} color="black" />
           ))}
           <Picker.Item label="➕ Add New Budget" value="new" color="green" />
         </Picker>
 
         {(selectedGoal === "new" || selectedGoal) && (
           <View style={styles.inputContainer}>
             <TextInput
               style={styles.input}
               placeholder="🏆 Budget Name"
               placeholderTextColor="gray"
               value={newGoal.name}
               onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
             />
             <TextInput
               style={styles.input}
               placeholder="💵 Current Budget Amount"
               placeholderTextColor="gray"
               keyboardType="numeric"
               value={newGoal.totalAmount}
               onChangeText={(text) => setNewGoal({ ...newGoal, totalAmount: text })}
             />
             <TextInput
               style={styles.input}
               placeholder="🎯 Total Budget"
               placeholderTextColor="gray"
               keyboardType="numeric"
               value={newGoal.amount}
               onChangeText={(text) => setNewGoal({ ...newGoal, amount: text })}
             />
 
             <TouchableOpacity
               style={styles.addButton}
               onPress={selectedGoal === "new" ? addGoal : updateGoal}
             >
               <Text style={styles.addButtonText}>
                 {selectedGoal === "new" ? "✅ Add Goal" : "🔄 Update Goal"}
               </Text>
             </TouchableOpacity>
           </View>
         )}
 
         <Text style={{fontWeight:"800",fontSize:20,margin:20}}>My Current Budgets</Text>
 
         <FlatList
           data={savings}
           keyExtractor={(item) => item.id}
           renderItem={({ item }) => (
             <View style={styles.goalCard}>
               <Text style={styles.goalText}>
                 🎯 {item.name}: ${item.amountSpent} / ${item.amount} ({item.percentage}%)
               </Text>
               <TouchableOpacity onPress={() => deleteGoal(item.id)} style={styles.deleteButton}>
                 <Feather name="trash" size={20} color="red" />
               </TouchableOpacity>
             </View>
           )}
           contentContainerStyle={styles.listContainer}
         />
       </ScrollView>
     </View>
   );
 };
 
 export default ManageBudgets;
 
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
     borderWidth: 7
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
   },
   picker:{
     margin: 20
   }
 });