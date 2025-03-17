import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Header from "@/components/Header1";
import { LineChart, BarChart } from "react-native-chart-kit";
import Constants from 'expo-constants';
const { width: screenWidth } = Dimensions.get("window");

const Analytics = ({ route }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [budgetsData, setBudgetsData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  const userId = 1; // Assuming userId is passed via route params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [financialRes, budgetsRes, savingsRes] = await Promise.all([
          fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/financial/user/${userId}`).then((res) => res.json()),
          fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/financial/user/budgets/${userId}`).then((res) => res.json()),
          fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/financial/user/savinggoal/${userId}`).then((res) => res.json()),
        ]);

        setFinancialData(financialRes);
        setBudgetsData(budgetsRes);
        setSavingsData(savingsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientTo: "#08130D",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
  };

  const renderChart = (data, labels, title, isLineChart = false) => {
    const chartProps = {
      data: { labels, datasets: [{ data }] },
      width: screenWidth - 40,
      height: 220,
      yAxisLabel: "$",
      chartConfig,
      style: styles.chartStyle,
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {isLineChart ? (
          <LineChart {...chartProps} bezier />
        ) : (
          <BarChart {...chartProps} />
        )}
      </View>
    );
  };

  const getWeeklyLabels = () => {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  };

  const getMonthlyData = (yearlyData) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months.map((month, index) => {
      const monthKey = `${index + 1}`.padStart(2, "0"); // Convert to "01", "02", etc.
      return yearlyData[monthKey] || 0; // Return 0 if no data for the month
    });
  };

  const renderBudgetCharts = () => {
    if (!budgetsData || !budgetsData.Budgets) return null;

    return budgetsData.Budgets.map((budget, index) => {
      const selectedPeriod = activeIndex === 0 ? "weekly" : activeIndex === 1 ? "monthly" : "yearly";
      let data, labels;

      if (selectedPeriod === "weekly") {
        data = budget.weekly;
        labels = getWeeklyLabels();
      } else if (selectedPeriod === "yearly") {
        // Use last year's data for yearly reports
        const lastYearData = financialData?.yearlyBreakdown?.["2024"] || {};
        data = getMonthlyData(lastYearData);
        labels = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
      } else {
        data = budget.monthly;
        labels = data.map((_, i) => `Week ${i + 1}`);
      }

      return renderChart(
        data,
        labels,
        `Budget ${index + 1}`,
        activeIndex === 0 // Line chart for weekly, bar chart for others
      );
    });
  };

  const renderSavingsCharts = () => {
    if (!savingsData || !savingsData.Budgets) return null;

    return savingsData.Budgets.map((savings, index) => {
      const selectedPeriod = activeIndex === 0 ? "weekly" : activeIndex === 1 ? "monthly" : "yearly";
      let data, labels;

      if (selectedPeriod === "weekly") {
        data = savings.weekly;
        labels = getWeeklyLabels();
      } else if (selectedPeriod === "yearly") {
        // Use last year's data for yearly reports
        const lastYearData = financialData?.yearlyBreakdown?.["2024"] || {};
        data = getMonthlyData(lastYearData);
        labels = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
      } else {
        data = savings.monthly;
        labels = data.map((_, i) => `Week ${i + 1}`);
      }

      return renderChart(
        data,
        labels,
        `Savings Goal ${index + 1}`,
        activeIndex === 0 // Line chart for weekly, bar chart for others
      );
    });
  };

  const renderExpensesChart = () => {
    if (!financialData) return null;

    const selectedPeriod = activeIndex === 0 ? "weekly" : activeIndex === 1 ? "monthly" : "yearly";
    let data, labels;

    if (selectedPeriod === "weekly") {
      const breakdown = financialData.weeklyBreakdown;
      const latestWeek = Object.keys(breakdown).pop(); // Get the latest week
      const weekData = breakdown[latestWeek];
      data = Object.values(weekData);
      labels = getWeeklyLabels();
    } else if (selectedPeriod === "yearly") {
      // Use last year's data for yearly reports
      const lastYearData = financialData.yearlyBreakdown?.["2024"] || {};
      data = getMonthlyData(lastYearData);
      labels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
    } else {
      const breakdown = financialData.monthlyBreakdown;
      labels = Object.keys(breakdown);
      data = Object.values(breakdown).map((period) =>
        Object.values(period).reduce((a, b) => a + b, 0)
      );
    }

    return renderChart(
      data,
      labels,
      "Expenses Breakdown",
      activeIndex === 0 // Line chart for weekly, bar chart for others
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Statistics" />
        <SegmentedControl
          values={["Weekly", "Monthly", "Yearly"]}
          selectedIndex={activeIndex}
          onChange={(event) => setActiveIndex(event.nativeEvent.selectedSegmentIndex)}
          style={styles.segmentedControl}
        />
        <ScrollView>
          <Text style={styles.text}>Expenses:</Text>
          <FlatList
            data={[renderExpensesChart()]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => item}
          />

          <Text style={styles.text}>Budgets:</Text>
          <FlatList
            data={renderBudgetCharts()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => item}
          />

          <Text style={styles.text}>Savings Goals:</Text>
          <FlatList
            data={renderSavingsCharts()}
            style={{ marginBottom: 100 }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => item}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacingX._20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.neutral900,
    marginVertical: spacingY._10,
  },
  segmentedControl: {
    marginBottom: spacingY._20,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth - 40,
    paddingHorizontal: 10,
  },
  text: {
    color: "white",
    fontWeight: "600",
    marginVertical: spacingY._10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Analytics;