import React, { useState, useEffect } from "react";
import { 
  FlatList, StyleSheet, Text, TextInput, 
  TouchableOpacity, View, ScrollView, SafeAreaView, Alert 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";

const ManageBankTransactions = ({ savings,fetchSaving,onClose,setSavings }) => {
  console.log("999999",savings[0].AccountNumber)
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ amount: "", type: "", products: [] });
  const [productForms, setProductForms] = useState([{ name: "", price: "" }]);
  const userData = useSelector((state)=>state.user)

  const token = "YOUR_AUTH_TOKEN"; // Replace with actual token

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3001/bank/transactions/${savings[0].AccountNumber}/offset/0`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const addProductForm = () => {
    setProductForms([...productForms, { name: "", price: "" }]);
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...productForms];
    updatedProducts[index][field] = value;
    setProductForms(updatedProducts);
  };

  const addTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.type) return;

    const validProducts = productForms
      .filter((p) => p.name && p.price)
      .map((p, index) => ({
        productId: index + 1,
        name: p.name,
        price: parseFloat(p.price),
      }));

    const transactionData = {
      userID: 1,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      Products: validProducts,
    };

    try {
      const response = await fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3001/bank/addTransaction?userID=${userData?.user?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      await fetchTransactions();

      setNewTransaction({ amount: "", type: "", products: [] });
      setProductForms([{ name: "", price: "" }]); 
      setShowForm(false); 
      Alert.alert("Success", "Transaction added successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>💰 Manage Bank Transactions</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {!showForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Text style={styles.addButtonText}>➕ New Transaction</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={newTransaction.amount}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
            />

            <Picker
              selectedValue={newTransaction.type}
              style={styles.picker}
              onValueChange={(itemValue) => setNewTransaction({ ...newTransaction, type: itemValue })}
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Deposit" value="deposit" />
              <Picker.Item label="Withdrawal" value="withdrawal" />
            </Picker>

            {productForms.map((product, index) => (
              <View key={index} style={styles.productForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Product Name"
                  value={product.name}
                  onChangeText={(text) => updateProduct(index, "name", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Product Price"
                  keyboardType="numeric"
                  value={product.price}
                  onChangeText={(text) => updateProduct(index, "price", text)}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addProductForm}>
              <Text style={styles.addButtonText}>➕ Add Another Product</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
              <Text style={styles.addButtonText}>✅ Add Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelButtonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

<Text style={styles.transactionHeader}>Transactions</Text>
<ScrollView>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.TransactionID.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <Text style={styles.transactionText}>{item.type} - ${item.amount}</Text>
              {item.Products && item.Products.length > 0 && (
                <View style={styles.productList}>
                  {item.Products.map((product, index) => (
                    <Text key={index} style={styles.productDetail}>📦 {product.name}: ${product.price}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
        />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ManageBankTransactions;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 10,
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
  cancelButton: {
    backgroundColor: "#FF4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    margin: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    marginHorizontal: 10,
  },
  transactionHeader: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 10,
  },
  transactionCard: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productList: {
    marginTop: 5,
    paddingLeft: 10,
  },
  productDetail: {
    fontSize: 14,
  },
});
