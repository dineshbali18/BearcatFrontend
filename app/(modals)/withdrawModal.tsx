import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getUserWithdrawRequests } from "../../helper/Bets";
import { useSelector } from "react-redux";
import { ArrowLeft } from "phosphor-react-native";

const transformStatus = (status) => {
  const normalized = status?.toUpperCase();
  if (normalized === "PENDING") return "pending";
  if (normalized === "COMPLETED" || normalized === "SUCCESS") return "won";
  return "lost";
};

const UserBets = () => {
  const router = useRouter();
  const token = useSelector((state) => state.user.token);
  const [bets, setBets] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = (initial = false) => {
    if (!hasMore && !initial) return;
    if (!initial) setLoadingMore(true);

    getUserWithdrawRequests(token, offset)
      .then((data) => {
        if (!data || data.length === 0) {
          setHasMore(false);
          setLoading(false);
          setLoadingMore(false);
          return;
        }

        const transformed = data.map((item) => ({
          name: item.name,
          upiId: item.upi_id,
          amount: item.amount,
          createdAt: item.created_at,
          status: transformStatus(item.status),
        }));

        setBets((prev) => [...prev, ...transformed]);
        setOffset((prev) => prev + data.length);
        setLoading(false);
        setLoadingMore(false);
      })
      .catch((err) => {
        // //console.log("Failed to fetch withdrawal requests:", err);
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const fetchMoreData = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchData();
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
            <ArrowLeft size={22} color="#fff" weight="bold" />
          </TouchableOpacity>
          <Typo size={20} fontWeight="700" style={styles.headerText}>
            Withdrawal Requests
          </Typo>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <FlatList
            data={bets}
            keyExtractor={(item, index) => `bet-${index}`}
            contentContainerStyle={styles.listContainer}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator color="#fff" /> : null
            }
            renderItem={({ item }) => (
              <View style={[styles.betCard, styles[item.status]]}>
                <View style={styles.rowBetween}>
                  <View style={styles.leftSection}>
                    <Text style={styles.lottery}>{item.name}</Text>
                    <Text style={styles.info}>{item.upiId}</Text>
                    <Text style={styles.info}>₹{item.amount}</Text>
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={[styles.result, styles[item.status + "Text"]]}>
                      {item.status.toUpperCase()}
                    </Text>
                    <Text style={styles.timestamp}>
                      {new Date(item.createdAt).toLocaleString()}
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
  wonText: { color: "#00b894" },
  lostText: { color: "#d63031" },
  pendingText: { color: "#f9ca24" },
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
});
