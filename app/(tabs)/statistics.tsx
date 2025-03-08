import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Header from "@/components/Header1";
import {
  LineChart,
  BarChart,
  ProgressChart,
} from "react-native-chart-kit";

const { width: screenWidth } = Dimensions.get("window");

const Analytics = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Generate random values for charts
  const generateRandomData = (length) => {
    return Array.from({ length }, () => Math.random() * 100);
  };

  // Expenses Bar Chart Data
  const expensesBarData = generateRandomData(5);
  const budgetBarData = generateRandomData(5);
  const savingsGoalData = [0.7, 0.5, 0.9]; // Example progress values

  // Bezier Line Chart Data
  const lineChartData = generateRandomData(6);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Statistics" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => setActiveIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />

          {/* Line Chart */}
          <Text style={styles.sectionTitle}>Income vs Expenses</Text>
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [{ data: lineChartData }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
          />

          {/* Budget Bar Chart */}
          <Text style={styles.sectionTitle}>Budget Allocation</Text>
          <BarChart
            data={{
              labels: ["Food", "Rent", "Travel", "Entertainment", "Savings"],
              datasets: [{ data: budgetBarData }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            style={styles.chartStyle}
          />

          {/* Savings Goal Progress Chart */}
          <Text style={styles.sectionTitle}>Savings Goal Progress</Text>
          <ProgressChart
            data={{ data: savingsGoalData }}
            width={screenWidth - 40}
            height={200}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            style={styles.chartStyle}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientTo: "#08130D",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacingX._20 },
  scrollContainer: { gap: spacingY._20, paddingBottom: 100 },
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
});

export default Analytics;