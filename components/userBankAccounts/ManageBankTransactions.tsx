import React, { useState, useEffect } from "react";
import { 
  FlatList, StyleSheet, Text, TextInput, 
  TouchableOpacity, View, ScrollView, SafeAreaView, Alert 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";

const key = "gdpteam3bearcatfinanceapp00000000";


const ManageBankTransactions = ({ savings,fetchSaving,onClose,setSavings }) => {
  console.log("999999",savings[0].AccountNumber)
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ amount: "", type: "", products: [] });
  const [productForms, setProductForms] = useState([{ name: "", price: "" }]);
  const userData = useSelector((state)=>state.user)

  const token = "YOUR_AUTH_TOKEN"; // Replace with actual token

  const decryptPayload = (encryptedPayload) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPayload, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const encryptData = (data) => {
    try {
      console.log("FFFFF");
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key);
      const encryptedStr = encrypted.toString();
      console.log("ZZZZZ", encryptedStr);
      return encryptedStr;
    } catch (err) {
      console.error("🔥 Encryption failed:", err);
      Alert.alert("Encryption error", err.message || "Unknown error");
      return null;
    }
  };
  

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
      console.log("DDDD",data)
      if (data.encryptedData) {
        const decryptedTransactions = decryptPayload(data.encryptedData);
        console.log("DDDDDDDDDDDD",decryptPayload)
        setTransactions(decryptedTransactions);
      } else {
        Alert.alert("Error", "No payload found in response");
      }
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
      userID: userData?.user?.id,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      Products: validProducts,
    };
  console.log("EEEE",transactionData)
  // console.log("AAA")
  //   const encryptedPayload = encryptData(transactionData);
  //   console.log("EEEEEEEE",encryptedPayload)
  
    try {
      const response = await fetch(
        `${Constants.expoConfig?.extra?.REACT_APP_API}:3001/bank/addTransaction?userID=${userData?.user?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionData), // 🔐 Encrypted data
        }
      );
  
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
    <SafeAreaView style={styles.safeContainer} testID="manageBankTransactionsScreen">
      <View style={styles.container}>
        <View style={styles.header} testID="transactionsHeader">
          <Text style={styles.headerText}>💰 Manage Bank Transactions</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon} testID="closeManageTransaction">
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {!showForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)} testID="showTransactionForm">
            <Text style={styles.addButtonText}>➕ New Transaction</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" testID="transactionForm">
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={newTransaction.amount}
              onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
              testID="amountInput"
            />

            <Picker
              selectedValue={newTransaction.type}
              style={styles.picker}
              onValueChange={(itemValue) => setNewTransaction({ ...newTransaction, type: itemValue })}
              testID="typePicker"
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Deposit" value="deposit" />
              <Picker.Item label="Withdrawal" value="withdrawal" />
            </Picker>

            {productForms.map((product, index) => (
              <View key={index} style={styles.productForm} testID={`productForm-${index}`}>
                <TextInput
                  style={styles.input}
                  placeholder="Product Name"
                  value={product.name}
                  onChangeText={(text) => updateProduct(index, "name", text)}
                  testID={`productName-${index}`}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Product Price"
                  keyboardType="numeric"
                  value={product.price}
                  onChangeText={(text) => updateProduct(index, "price", text)}
                  testID={`productPrice-${index}`}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addProductForm} testID="addProductButton">
              <Text style={styles.addButtonText}>➕ Add Another Product</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={addTransaction} testID="submitTransaction">
              <Text style={styles.addButtonText}>✅ Add Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)} testID="cancelTransaction">
              <Text style={styles.cancelButtonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <Text style={styles.transactionHeader}>Transactions</Text>
        <ScrollView testID="transactionList">
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.TransactionID.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionCard} testID={`transactionCard-${item.TransactionID}`}>
                <Text style={styles.transactionText}>{item.type} - ${item.amount}</Text>
                {item.Products && item.Products.length > 0 && (
                  <View style={styles.productList}>
                    {item.Products.map((product, index) => (
                      <Text key={index} style={styles.productDetail} testID={`product-${item.TransactionID}-${index}`}>📦 {product.name}: ${product.price}</Text>
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
