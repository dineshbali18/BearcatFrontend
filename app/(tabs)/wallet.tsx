import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Button } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { WalletType } from "@/types";
import Loading from "@/components/Loading";
import WalletListItem from "@/components/userBankAccounts/WalletListItem";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';


const API_BASE_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002`;

const Wallet = () => {
  const router = useRouter();
  // const { data: wallets, loading, error, refetch } = useFetchData<WalletType>("wallets");

  const userData = useSelector((state)=>state.user)

  const [isModalVisible, setModalVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [check,setCheck] = useState(0);

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bankDetails`);
      console.log("AAAAAA123",response.data)
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleAddBankAccount = async () => {
    if (!selectedBank || !accountNumber) return;

    console.log("SSSS1111",selectedBank)

    const newAccount = {
      UserID: userData?.user?.id, // Replace with dynamic user ID
      bankName: selectedBank?.BankName,
      AccountNumber: accountNumber,
      BankID: selectedBank?.BankID,
    };

    try {
      await axios.post(`${API_BASE_URL}/userBankAccount/`, newAccount);
      setModalVisible(false);
      setAccountNumber("");
      setSelectedBank(null);
      setCheck(1);
      // refetch(); // Refresh wallet list
    } catch (error) {
      console.error("Error adding bank account:", error);
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight="500">User Bank Accounts</Typo>
            <TouchableOpacity onPress={() => { setModalVisible(true); fetchBanks(); }}>
              <Icons.PlusCircle weight="fill" color={colors.primary} size={verticalScale(33)} />
            </TouchableOpacity>
          </View>

          {/* {loading && <Loading />} */}
          {/* <FlatList
            data={wallets}
            renderItem={({ item, index }) => <WalletListItem item={item} index={index} />}
            contentContainerStyle={styles.listStyle}
          /> */}
          <WalletListItem check={check}/>
        </View>
      </View>

      {/* Modal for Adding Bank Account */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bank Account</Text>

            {/* Bank Selection Dropdown */}
            <Text style={styles.label}>Select Bank:</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedBank(value)}
              items={banks.map((bank) => ({
                label: bank.BankName,
                value: bank
              }))}
              placeholder={{ label: "Select a bank...", value: null }}
              style={pickerStyles}
            />

            <Text style={styles.label}>Account Number:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter account number" 
              keyboardType="numeric" 
              value={accountNumber} 
              onChangeText={setAccountNumber} 
            />

            <View style={styles.buttonRow}>
              <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Add Account" onPress={handleAddBankAccount} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  flexRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacingY._10 },
  wallets: { flex: 1, backgroundColor: colors.neutral900, borderTopRightRadius: radius._30, borderTopLeftRadius: radius._30, padding: spacingX._20, paddingTop: spacingX._25 },
  listStyle: { paddingVertical: spacingY._25, paddingTop: spacingY._15 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: colors.white, padding: spacingX._15, borderRadius: radius._12, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: spacingY._10 },
  label: { fontSize: 14, marginTop: spacingY._5 },
  input: { borderWidth: 1, borderColor: colors.neutral500, padding: spacingX._10, borderRadius: radius._10, marginTop: spacingY._5 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacingY._10 },
});

// Custom styling for dropdown
const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderRadius: radius._10,
    color: colors.black,
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderRadius: radius._10,
    color: colors.black,
    paddingRight: 30,
  },
};
