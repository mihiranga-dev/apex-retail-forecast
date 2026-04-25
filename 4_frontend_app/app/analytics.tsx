import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useLocalSearchParams } from "expo-router"; // Hooks into the parameters we sent

// A hardcoded array representing 52 weeks of baseline data (roughly around $20k - $28k)
const YEARLY_HISTORY = [
  21000, 21500, 22100, 21800, 23000, 24500, 23800, 22900, 23400, 24100, 25000,
  25500, 26000, 25800, 24900, 24000, 23500, 24200, 25100, 26200, 27000, 27500,
  28100, 27900, 26800, 25900, 25200, 24800, 25500, 26100, 27200, 28500, 29000,
  28800, 27900, 27000, 26500, 27100, 28000, 28500, 29200, 29800, 30500, 31000,
  30200, 29500, 28900, 28500, 29100, 30000, 31500, 32000, 33000,
];

export default function AnalyticsScreen() {
  // Catch the parameters sent from the home screen
  const params = useLocalSearchParams();

  // Default to Week 42 and $0 if nothing was passed (e.g., if they click History before predicting)
  const targetWeek = params.week ? parseInt(params.week as string) : 42;
  const predictedSales = params.prediction
    ? parseFloat(params.prediction as string)
    : null;

  // --- DYNAMIC DATA LOGIC ---
  // Grab the 4 weeks immediately preceding the target week
  const startWeek = Math.max(1, targetWeek - 4);

  const dynamicLabels = [];
  const dynamicData = [];

  // 1. Fill in the historical facts
  for (let i = startWeek; i < targetWeek; i++) {
    dynamicLabels.push(`Wk ${i}`);
    dynamicData.push(YEARLY_HISTORY[i - 1]); // Array is 0-indexed, weeks are 1-indexed
  }

  // 2. Append the AI Prediction at the end
  dynamicLabels.push(`Wk ${targetWeek}`);
  // If they have a real prediction, show it. Otherwise, use the baseline array.
  dynamicData.push(
    predictedSales ? predictedSales : YEARLY_HISTORY[targetWeek - 1],
  );

  const chartData = {
    labels: dynamicLabels,
    datasets: [
      {
        data: dynamicData,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance Analytics</Text>
        <Text style={styles.subtitle}>Historical data vs AI Forecasting</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sales Trend Analysis</Text>

        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={240}
          yAxisLabel="$"
          yAxisSuffix="k"
          formatYLabel={(value) => (parseInt(value) / 1000).toFixed(1)}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#059669",
            },
          }}
          bezier
          style={{
            marginVertical: 15,
            borderRadius: 16,
          }}
        />

        <Text style={styles.insightText}>
          <Text style={{ fontWeight: "bold" }}>AI Insight: </Text>
          {predictedSales
            ? `The model has generated a forecast of $${predictedSales.toLocaleString()} for Week ${targetWeek} based on current inputs.`
            : `Please run a forecast on the home screen to see predicted insights for Week ${targetWeek}.`}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E5E7EB",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 4,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 10,
  },
  insightText: {
    marginTop: 15,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 10,
  },
});
