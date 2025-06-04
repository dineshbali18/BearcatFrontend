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
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getPaginatedLotteries } from "../../helper/Winners"; // ✅ Helper
import { useSelector, UseSelector } from "react-redux";

const iconMap = {
  1: "🐯 Tiger",
  3: "🦁 Lion",
  2: "🦄 Unicorn",
  [-1]: "⏳ Pending",
};

const Winners = () => {
  const router = useRouter();
  const [lotteries, setLotteries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const token = useSelector((state)=>state.user.token)
  const LIMIT = 20;

  const fetchLotteries = async (nextPage = 1) => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const data = await getPaginatedLotteries(nextPage, LIMIT,token);
      // //console.log("DDDDD",data)
      if (data.length < LIMIT) setHasMore(false);

      const formatted = data.map((item, index) => ({
        lotteryId: item.id, // consistent numbering
        iconName: iconMap[item.winner] || "Unknown",
        result: item.winner === -1 ? "pending" : "won",
        placedAt: item.happened_at,
      }));

      setLotteries((prev) => [...prev, ...formatted]);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to fetch winners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotteries(1);
  }, []);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <Typo size={20} fontWeight="700" style={styles.headerText}>
            Winners
          </Typo>
        </View>

        <FlatList
          data={lotteries}
          keyExtractor={(item, index) => `lottery-${index}`}
          contentContainerStyle={styles.listContainer}
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchLotteries(page + 1)}
          ListFooterComponent={
            loading ? <ActivityIndicator color="#fff" /> : null
          }
          renderItem={({ item }) => (
            <View style={[styles.betCard, styles[item.result]]}>
              <View style={styles.rowBetween}>
                <View style={styles.leftSection}>
                  <Text style={styles.lottery}>#{item.lotteryId}</Text>
                  <Text style={styles.info}>{item.iconName}</Text>
                </View>
                <View style={styles.rightSection}>
                  <Text style={[styles.result, styles[`${item.result}Text`]]}>
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
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Winners;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._20,
    paddingTop: spacingY._10,
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
    fontWeight: "600",
    marginBottom: 2,
  },
  timestamp: {
    color: "#b2bec3",
    fontSize: 12,
    marginTop: 4,
  },
  won: {
    borderLeftColor: "#00b894",
    borderLeftWidth: 4,
  },
  pending: {
    borderLeftColor: "#f9ca24",
    borderLeftWidth: 4,
  },
  wonText: { color: "#00b894" },
  pendingText: { color: "#f9ca24" },
});
