import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Typo from "../Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionListType, TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import Loading from "../Loading";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import Constants from 'expo-constants';

const API_URL = `${Constants.expoConfig?.extra?.REACT_APP_API}:3002/expense/expenses/user/`;

const TransactionList = ({ title, emptyListMessage }: TransactionListType) => {
  const router = useRouter();
  const [data, setData] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (!userId || !token) {
          throw new Error("User not authenticated");
        }

        const response = await fetch(`${API_URL}${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (item: TransactionType) => {
    console.log(item);
  };

  return (
    <View style={styles.container} testID="transactionListContainer">
      {title && <Typo fontWeight="500" size={20} testID="transactionListTitle">{title}</Typo>}

      <View style={styles.list} testID="transactionList">
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <View testID={`transactionItem-${item.ExpenseID}`}><Text>HIII</Text></View>
          )}
          estimatedItemSize={60}
        />
      </View>

      {!loading && data.length === 0 && (
        <Typo size={15} color={colors.neutral400} style={{ textAlign: "center", marginTop: spacingY._15 }} testID="emptyListMessage">
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }} testID="loadingIndicator">
          <Loading />
        </View>
      )}

      {error && <Text style={styles.errorText} testID="errorText">{error}</Text>}
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: { gap: spacingY._17 },
  list: { minHeight: 3 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  categoryDes: { flex: 1, gap: 2.5 },
  amountDate: { alignItems: "flex-end", gap: 3 },
  errorText: { color: colors.rose, textAlign: "center", marginTop: 10 },
});
