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

        // Retrieve userId and token from AsyncStorage
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
    console.log(item)
    // router.push({
    //   pathname: "/(modals)/transactionModal",
    //   params: {
    //     id: item.ExpenseID,
    //     amount: item.Amount.toString(),
    //     category: item.CategoryID,
    //     date: new Date(item.Date).toISOString(),
    //     description: item.Description || "",
    //     uid: item.UserID,
    //   },
    // });
  };

  return (
    <View style={styles.container}>
      {title && <Typo fontWeight="500" size={20}>{title}</Typo>}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            // <TransactionItem handleClick={handleClick} item={item} index={index} />
            <><Text>HIII</Text></>
          )}
          estimatedItemSize={60}
        />
      </View>

      {!loading && data.length === 0 && (
        <Typo size={15} color={colors.neutral400} style={{ textAlign: "center", marginTop: spacingY._15 }}>
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// const TransactionItem = ({ item, index, handleClick }: { item: TransactionType; index: number; handleClick: (item: TransactionType) => void }) => {
//   const date = new Date(item.Date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

//   return (
//     <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(14)}>
//       <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
//         <View style={styles.categoryDes}>
//           <Typo size={17}>{`Category: ${item.CategoryID}`}</Typo>
//           <Typo size={12} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
//             {item.Description || "No description"}
//           </Typo>
//         </View>
//         <View style={styles.amountDate}>
//           <Typo fontWeight="500" color={colors.rose}>{`- $${item.Amount}`}</Typo>
//           <Typo size={13} color={colors.neutral400}>{date}</Typo>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

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
