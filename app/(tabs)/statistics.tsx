import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Header from "@/components/Header1";
import {
  LineChart,
  BarChart,
  ProgressChart,
} from "react-native-chart-kit";
import Constants from 'expo-constants';
const { width: screenWidth } = Dimensions.get("window");

const Analytics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState(1100);
  const [expenses, setExpenses] = useState(0);
  const [savings, setSavings] = useState(500);

  // Deduct expense from budget and add to savings
  const addExpense = (amount) => {
    setExpenses(expenses + amount);
    setBudgetAmount(budgetAmount - amount);
  };

  const addToSavings = (amount) => {
    setSavings(savings + amount);
  };

  // Expenses Data
  const lineChartData = [100, 200, 300, 450, 600,100, 200, 300, 450, 600, expenses];
  const expenseLineChartData = [100, 200, 300, 450, 600,700, expenses];
  const SavingGoalLineChartData = [100, 200, 300, expenses];
  const barChartData = [200, 300, 150, 400, 250];
  const budgetBarData = [(budgetAmount / 1100) * 100, 80, 60, 40, 20];
  const savingsGoalData = [savings / 1000];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientTo: "#08130D",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
  };

  const chartData = [
    {
      title: "Income vs Expenses",
      component: (
        <LineChart
          data={{ labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [{ data: expenseLineChartData }] }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ),
    },
    {
      title: "Category-wise Expenses",
      component: (
        <BarChart
          data={{ labels: ["Food", "Rent", "Travel", "Entertainment", "Savings"], datasets: [{ data: barChartData }] }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          style={styles.chartStyle}
        />
      ),
    },
  ];

  const budgetData = [
    {
      title: "Income vs Expenses",
      component: (
        <LineChart
          data={{ labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","July","Aug","Sep","Oct","Nov","Dec"], datasets: [{ data: lineChartData }] }}
          width={screenWidth - 10}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ),
    },
    {
      title: "Income vs Expenses",
      component: (
        <LineChart
          data={{ labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ data: lineChartData }] }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ),
    },
    {
      title: "Income vs Expenses",
      component: (
        <LineChart
          data={{ labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ data: lineChartData }] }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ),
    },
  ] 

  const savingGoalData = [
    {
      title: "Income vs Expenses",
      component: (
        <LineChart
          data={{ labels: ["Week1","Week2","Week3","Week4"], datasets: [{ data: SavingGoalLineChartData }] }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ),
    },
    {
      title: "Income vs Expenses",
      component: (
        <LineChart
          data={{ labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ data: lineChartData }] }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ),
    },
    {
      title: "Income vs Expenses",
      component: (
        <LineChart
          data={{ labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ data: lineChartData }] }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          formatYLabel={(label) => parseInt(label)}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      ),
    },
  ] 


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
          data={chartData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              {item.component}
            </View>
          )}
        />
        <Text style={styles.text}>Budgets:</Text>
        <FlatList
          data={budgetData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              {item.component}
            </View>
          )}
        />
        <Text style={styles.text}>Savings:</Text>
        <FlatList
          data={savingGoalData}
          horizontal
          style={{marginBottom: 100}}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              {item.component}
            </View>
          )}
        />
        </ScrollView>
        {/* <View style={styles.lowerSection}>

        </View> */}
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
    color: 'white',
    fontWeight: 600,
  },
  lowerSection: {
    marginTop: 50,
  }

});

export default Analytics;
