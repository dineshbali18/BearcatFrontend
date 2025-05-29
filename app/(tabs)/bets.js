import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getUserBets } from "../../helper/Bets";
import { useSelector } from "react-redux";

// ✅ Emoji mapping
const iconMap = {
  1: "🐯 Tiger",
  3: "🦁 Lion",
  2: "🦄 Unicorn",
};

const getResult = (winner) => {
  if (winner === -1 || winner === null || winner === undefined) return "pending";
  return winner === 1 ? "won" : "lost";
};

const UserBets = () => {
  const router = useRouter();
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state)=>state.user.token)

  useEffect(() => {
    getUserBets(token)
      .then((data) => {
        const transformed = data.map((item, index) => ({
          lotteryId: item.lottery_id,
          iconName: iconMap[item.bet_placed_icon] || "Unknown",
          amount: item.amount,
          placedAt: item.lottery_happended_at,
          result: getResult(item.winner),
        }));
        setBets(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to fetch bets:", err);
        setLoading(false);
      });
  }, []);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <Typo size={20} fontWeight="700" style={styles.headerText}>
            My Bets
          </Typo>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <FlatList
            data={bets}
            keyExtractor={(item, index) => `bet-${index}`}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={[styles.betCard, styles[item.result]]}>
                <View style={styles.rowBetween}>
                  <View style={styles.leftSection}>
                    <Text style={styles.lottery}>#{item.lotteryId}</Text>
                    <Text style={styles.info}>{item.iconName}</Text>
                    <Text style={styles.info}>₹{item.amount}</Text>
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={[styles.result, styles[item.result + "Text"]]}>
                      {item.result.toUpperCase()}
                    </Text>
                    <Text style={styles.timestamp}>
                      {new Date(item.placedAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default UserBets;

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: spacingX._20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._20,
    paddingTop: spacingY._10,
  },
  backIcon: {
    marginRight: 10,
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  headerText: {
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 100,
  },
  betCard: {
    padding: spacingX._15,
    borderRadius: radius._12,
    backgroundColor: "#2d3436",
    marginBottom: spacingY._15,
  },
  lottery: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
  },
  info: {
    color: "#dfe6e9",
    fontSize: 15,
  },
  result: {
    color: "#fab1a0",
    marginTop: 4,
    fontWeight: "600",
  },
  timestamp: {
    color: "#b2bec3",
    fontSize: 12,
    marginTop: 6,
  },
  won: {
    borderLeftColor: "#00b894",
    borderLeftWidth: 4,
  },
  lost: {
    borderLeftColor: "#d63031",
    borderLeftWidth: 4,
  },
  pending: {
    borderLeftColor: "#f9ca24",
    borderLeftWidth: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    justifyContent: "flex-start",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  wonText: { color: "#00b894" },
  lostText: { color: "#d63031" },
  pendingText: { color: "#f9ca24" },
  
});