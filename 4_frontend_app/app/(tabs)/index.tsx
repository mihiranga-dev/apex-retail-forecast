import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// A mini-database of the stores and their actual square footage
const STORE_DICTIONARY = {
  "1": "151315",
  "2": "202307",
  "3": "37392",
  "4": "205863",
  "5": "34875",
  "6": "202505",
  "7": "70713",
  "8": "155078",
  "9": "125833",
  "10": "126512",
  "11": "207499",
  "12": "112238",
  "13": "219622",
  "14": "200898",
  "15": "123737",
  "16": "57197",
  "17": "93188",
  "18": "120653",
  "19": "203819",
  "20": "203742",
  "21": "140167",
  "22": "119557",
  "23": "114533",
  "24": "203819",
  "25": "128107",
  "26": "152513",
  "27": "204184",
  "28": "206302",
  "29": "93638",
  "30": "42988",
  "31": "203750",
  "32": "203007",
  "33": "39690",
  "34": "158114",
  "35": "103681",
  "36": "39910",
  "37": "39910",
  "38": "39690",
  "39": "184109",
  "40": "155083",
  "41": "196321",
  "42": "39690",
  "43": "41062",
  "44": "39910",
  "45": "118221",
};

// 81 departments found in dataset
const DEPARTMENTS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "54",
  "55",
  "56",
  "58",
  "59",
  "60",
  "65",
  "67",
  "71",
  "72",
  "74",
  "77",
  "78",
  "79",
  "80",
  "81",
  "82",
  "83",
  "85",
  "87",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
];

// 52 weeks in a year (auto-generates '1' to '52')
const WEEKS = Array.from({ length: 52 }, (_, i) => (i + 1).toString());

// Years for forecasting (added 2013 so users can predict the future!)
const YEARS = ["2010", "2011", "2012", "2013"];

export default function App() {
  const [formData, setFormData] = useState({
    Store: "1",
    Size: STORE_DICTIONARY["1"], // Auto-fills based on the default Store
    Dept: "1",
    Temperature: "42.0",
    Fuel_Price: "2.5",
    CPI: "211.0",
    Unemployment: "8.1",
    Week: "45",
    Year: "2012",
  });

  // Automatically update the Size whenever the Store changes
  const handleStoreChange = (selectedStore) => {
    setFormData({
      ...formData,
      Store: selectedStore,
      Size: STORE_DICTIONARY[selectedStore],
    });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePredict = () => {
    console.log("Payload ready for AI Engine:", formData);
    alert("Payload generated! Check terminal.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Apex Retail</Text>
        <Text style={styles.subHeader}>Demand Forecasting Engine</Text>
      </View>

      <View style={styles.formCard}>
        {/* --- DYNAMIC DROPDOWN FOR STORE SELECTION --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Store</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.Store}
              onValueChange={(itemValue) => handleStoreChange(itemValue)}
              style={styles.picker}
            >
              {/* This automatically loops through all 45 stores in the dictionary! */}
              {Object.keys(STORE_DICTIONARY).map((storeNum) => (
                <Picker.Item
                  key={storeNum}
                  label={`Store ${storeNum}`}
                  value={storeNum}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* --- READ-ONLY SIZE FIELD --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Store Size (Sq Ft) - Auto Detected</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={formData.Size}
            editable={false} // Locks the field so the user cannot ruin the data
          />
        </View>

        {/* --- DEPARTMENT DROPDOWN --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Department</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.Dept}
              onValueChange={(val) => handleChange("Dept", val)}
              style={styles.picker}
            >
              {DEPARTMENTS.map((dept) => (
                <Picker.Item
                  key={dept}
                  label={`Department ${dept}`}
                  value={dept}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* --- YEAR & WEEK DROPDOWNS --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Forecast Date</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={[styles.pickerContainer, { flex: 0.48 }]}>
              <Picker
                selectedValue={formData.Year}
                onValueChange={(val) => handleChange("Year", val)}
                style={styles.picker}
              >
                {YEARS.map((yr) => (
                  <Picker.Item key={yr} label={`Year: ${yr}`} value={yr} />
                ))}
              </Picker>
            </View>
            <View style={[styles.pickerContainer, { flex: 0.48 }]}>
              <Picker
                selectedValue={formData.Week}
                onValueChange={(val) => handleChange("Week", val)}
                style={styles.picker}
              >
                {WEEKS.map((wk) => (
                  <Picker.Item key={wk} label={`Week: ${wk}`} value={wk} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* --- STANDARD TEXT INPUTS FOR THE REST --- */}
        {[
          { key: "Temperature", label: "Temperature (°F)" },
          { key: "Fuel_Price", label: "Fuel Price ($)" },
          { key: "CPI", label: "Consumer Price Index (Score)" },
          { key: "Unemployment", label: "Unemployment Rate (%)" },
        ].map((item) => (
          <View key={item.key} style={styles.inputGroup}>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={styles.input}
              value={formData[item.key]}
              onChangeText={(text) => handleChange(item.key, text)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>Run AI Forecast</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E5E7EB",
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -1,
  },
  subHeader: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 4,
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  readOnlyInput: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
    borderColor: "#F3F4F6",
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 50,
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
