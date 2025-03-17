import React from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Colors from "@/constants/Colors";
import { IncomeType } from "@/types";
import {
  DollarIcon,
  WalletAddMoneyIcon,
  WalletCardIcon,
} from "@/constants/Icons";
import { Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';

const UserSavingGoals = ({ incomeList }: { incomeList: IncomeType[] }) => {
  const renderItem: ListRenderItem<IncomeType> = ({ item }) => {
    console.log("Itemmmmmm:::", item);
    
    // Select the correct icon source based on item name
    let iconSource = DollarIcon;
    if (item.name === "Freelancing") {
      iconSource = WalletCardIcon;
    } else if (item.name === "Interest") {
      iconSource = WalletAddMoneyIcon;
    }

    // Split the amount for formatting
    const amount = item.amount.split(".");

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <Image
              source={iconSource}
              style={{ width: 22, height: 22, tintColor: Colors.white }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Feather name="more-horizontal" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.amountText}>
          ${amount[0]}.
          <Text style={styles.centsText}>{amount[1]}</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>
        My <Text style={styles.boldText}>Saving Goals</Text>
      </Text> */}
      {/* <FlatList
        data={incomeList}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      /> */}
    </View>
  );
};

export default UserSavingGoals;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  headerText: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "700",
  },
  card: {
    backgroundColor: Colors.grey,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    width: 150,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: {
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 50,
    padding: 5,
    alignSelf: "flex-start",
  },
  amountText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  centsText: {
    fontSize: 12,
    fontWeight: "400",
  },
});
