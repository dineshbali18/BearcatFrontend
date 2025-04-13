import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Header from "@/components/Header1";
import { LineChart, BarChart } from "react-native-chart-kit";
import Constants from "expo-constants";
import { useSelector } from "react-redux";

const { width: screenWidth } = Dimensions.get("window");

const Analytics = ({ route }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [budgetsData, setBudgetsData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  const [selectedDescriptions, setSelectedDescriptions] = useState({});
  const userData = useSelector((state) => state?.user);
  const userId = userData?.user?.id;

  const processChartData = (data) => {
    if (!Array.isArray(data)) return [0];
    return data.map(value => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setLoading(true);
        try {
          const [financialRes, budgetsRes, savingsRes] = await Promise.all([
            fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/financial/user/${userId}`).then((res) => res.json()),
            fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/financial/user/budgets/${userId}`).then((res) => res.json()),
            fetch(`${Constants.expoConfig?.extra?.REACT_APP_API}:3002/financial/user/savinggoal/${userId}`).then((res) => res.json()),
          ]);

          if (isActive) {
            setFinancialData(financialRes);
            setBudgetsData(budgetsRes);
            setSavingsData(savingsRes);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [userId])
  );

  const generateDescription = (data, title, period) => {
    const processedData = processChartData(data);
    if (!processedData || processedData.length === 0 || processedData.every(val => val === 0)) {
      return `No data available for ${title} in this period.`;
    }

    const max = Math.max(...processedData);
    const min = Math.min(...processedData);
    const avg = processedData.reduce((a, b) => a + b, 0) / processedData.length;
    const sum = processedData.reduce((a, b) => a + b, 0);
    const trend = processedData[0] < processedData[processedData.length - 1] ? "increasing" : "decreasing";

    const periodText = {
      weekly: "this week",
      monthly: "this month",
      yearly: "this year",
    }[period] || "the selected period";

    return `${title} Summary:

• During ${periodText}, the highest recorded amount was $${max}, showing a peak in your financial trend.
• The lowest amount observed was $${min}, indicating potential areas of underperformance or savings.
• The average value over this period was $${avg.toFixed(2)}, providing a consistent view of your financial behavior.
• In total, you've moved $${sum.toFixed(2)} through this category in ${periodText}.
• The overall trend appears to be ${trend}, suggesting a ${trend === "increasing" ? "growth" : "reduction"} pattern over time.
• This summary gives you a deeper insight into how your finances are evolving in ${periodText}.`;
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientTo: "#08130D",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
  };

  const renderChart = (data, labels, title, isLineChart = false, id, period) => {
    const processedData = processChartData(data);
    
    const chartProps = {
      data: { labels, datasets: [{ data: processedData }] },
      width: screenWidth - 40,
      height: 220,
      yAxisLabel: "$",
      chartConfig,
      style: styles.chartStyle,
    };

    const description = selectedDescriptions[id];

    return (
      <TouchableOpacity
        onPress={() => {
          const desc = generateDescription(processedData, title, period);
          setSelectedDescriptions((prev) => ({ ...prev, [id]: desc }));
        }}
      >
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {isLineChart ? (
            <LineChart {...chartProps} bezier />
          ) : (
            <BarChart {...chartProps} />
          )}
          {description && <Text style={styles.descriptionText}>{description}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const getWeeklyLabels = () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const getMonthlyLabels = () => [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const renderBudgetCharts = () => {
    if (!budgetsData?.Budgets) return [];

    return budgetsData.Budgets.map((budget, index) => {
      const period = ["weekly", "monthly", "yearly"][activeIndex];
      let data = [], labels = [];

      if (period === "weekly") {
        data = budget.weekly || [];
        labels = getWeeklyLabels();
      } else if (period === "monthly") {
        const monthly = budget.monthly || {};
        data = Object.values(monthly);
        labels = data.map((_, index) => `Week ${index + 1}`);
      } else {
        data = budget.yearly || [];
        labels = getMonthlyLabels();
      }

      return renderChart(
        data,
        labels,
        `Budget ${index + 1} (Target: $${budget.budgetTargetamount || 0})`,
        activeIndex === 0,
        `budget-${index}`,
        period
      );
    });
  };

  const renderSavingsCharts = () => {
    if (!savingsData?.Budgets) return [];

    return savingsData.Budgets.map((savings, index) => {
      const period = ["weekly", "monthly", "yearly"][activeIndex];
      let data = [], labels = [];

      if (period === "weekly") {
        data = savings.weekly || [];
        labels = getWeeklyLabels();
      } else if (period === "monthly") {
        const monthly = savings.monthly || {};
        data = Object.values(monthly);
        labels = data.map((_, index) => `Week ${index + 1}`);
      } else {
        data = savings.yearly || [];
        labels = getMonthlyLabels();
      }

      return renderChart(
        data,
        labels,
        `Savings Goal ${index + 1}`,
        activeIndex === 0,
        `savings-${index}`,
        period
      );
    });
  };

  const renderExpensesChart = () => {
    if (!financialData) return [];

    const period = ["weekly", "monthly", "yearly"][activeIndex];
    let data = [], labels = [];

    try {
      if (period === "weekly") {
        const breakdown = financialData.weeklyExpenseBreakdown || {};
        const latestWeek = Object.keys(breakdown).pop();
        const weekData = breakdown[latestWeek] || {};
        data = Object.values(weekData);
        labels = getWeeklyLabels();
      } else if (period === "yearly") {
        const currentYear = new Date().getFullYear().toString();
        data = Object.values(financialData.yearlyExpenseBreakdown?.[currentYear] || {});
        labels = getMonthlyLabels();
      } else {
        const breakdown = financialData.monthlyExpenseBreakdown || {};
        const weeklyArrays = Object.values(breakdown);
        data = weeklyArrays.flat().map(val => Number(val) || 0);
        labels = data.map((_, index) => `Week ${index + 1}`);
      }
    } catch (error) {
      console.error("Error processing expense data:", error);
      data = [0];
    }

    return [
      renderChart(
        data,
        labels,
        "Expenses Breakdown",
        activeIndex === 0,
        `expenses-${activeIndex}`,
        period
      ),
    ];
  };

  const renderIncomeChart = () => {
    if (!financialData) return [];

    const period = ["weekly", "monthly", "yearly"][activeIndex];
    let data = [], labels = [];

    try {
      if (period === "weekly") {
        const breakdown = financialData.weeklyIncomeBreakdown || {};
        const latestWeek = Object.keys(breakdown).pop();
        const weekData = breakdown[latestWeek] || {};
        data = Object.values(weekData);
        labels = getWeeklyLabels();
      } else if (period === "yearly") {
        const currentYear = new Date().getFullYear().toString();
        data = Object.values(financialData.yearlyIncomeBreakdown?.[currentYear] || {});
        labels = getMonthlyLabels();
      } else {
        const breakdown = financialData.monthlyIncomeBreakdown || {};
        const weeklyArrays = Object.values(breakdown);
        data = weeklyArrays.flat().map(val => Number(val) || 0);
        labels = data.map((_, index) => `Week ${index + 1}`);
      }
    } catch (error) {
      console.error("Error processing income data:", error);
      data = [0];
    }

    return [
      renderChart(
        data,
        labels,
        "Income Breakdown",
        activeIndex === 0,
        `income-${activeIndex}`,
        period
      ),
    ];
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Statistics" />
        <SegmentedControl
          values={["Weekly", "Monthly", "Yearly"]}
          selectedIndex={activeIndex}
          onChange={(event) =>
            setActiveIndex(event.nativeEvent.selectedSegmentIndex)
          }
          style={styles.segmentedControl}
        />
        <ScrollView>
          <Text style={styles.text}>Expenses:</Text>
          <FlatList
            data={renderExpensesChart()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `expense-${index}`}
            renderItem={({ item }) => item}
          />

          <Text style={styles.text}>Income:</Text>
          <FlatList
            data={renderIncomeChart()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `income-${index}`}
            renderItem={({ item }) => item}
          />

          <Text style={styles.text}>Budgets:</Text>
          <FlatList
            data={renderBudgetCharts()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `budget-${index}`}
            renderItem={({ item }) => item}
          />

          <Text style={styles.text}>Savings Goals:</Text>
          <FlatList
            data={renderSavingsCharts()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `savings-${index}`}
            renderItem={({ item }) => item}
            contentContainerStyle={{ marginBottom: 100 }}
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
  descriptionText: {
    marginTop: spacingY._10,
    color: colors.neutral100,
    fontSize: 14,
    backgroundColor: colors.neutral800,
    padding: 12,
    borderRadius: 10,
    textAlign: "left",
    lineHeight: 20,
  },
});

export default Analytics;
