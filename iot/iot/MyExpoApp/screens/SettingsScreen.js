import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { database } from '../firebaseConfig'; // Import Firebase database
import { ref, set, onValue } from 'firebase/database'; // Import Firebase functions

const SettingsScreen = () => {
  // State for threshold values
  const [soilThreshold, setSoilThreshold] = useState('40');
  const [temperature, setTemperature] = useState('25');
  const [waterThreshold, setWaterThreshold] = useState('30');
  const [airHumidity, setAirHumidity] = useState('60');

  // Fetch thresholds from Firebase on component mount
  useEffect(() => {
    const controlRef = ref(database, 'control'); // Path to the control node in Firebase

    onValue(controlRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSoilThreshold(data.soilThreshold.toString()); // Update soil threshold
        setTemperature(data.temperature.toString()); // Update temperature
        setWaterThreshold(data.waterThreshold.toString()); // Update water threshold
        setAirHumidity(data.airHumidity.toString()); // Update air humidity
      }
    });
  }, []);

  // Handle Save button press
  const handleSave = () => {
    // Save thresholds to Firebase
    const controlRef = ref(database, 'control'); // Path to the control node in Firebase

    set(controlRef, {
      airHumidity: parseInt(airHumidity, 10), // Convert to number
      soilThreshold: parseInt(soilThreshold, 10), // Convert to number
      temperature: parseInt(temperature, 10), // Convert to number
      waterThreshold: parseInt(waterThreshold, 10), // Convert to number
    })
      .then(() => {
        Alert.alert('Success', 'Thresholds saved successfully!');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to save thresholds. Please try again.');
        console.error('Error saving thresholds:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Soil Humidity Threshold */}
      <View style={styles.inputContainer}>
        <Icon name="leaf" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Soil Humidity Threshold (%)"
          value={soilThreshold}
          onChangeText={setSoilThreshold}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      {/* Temperature Threshold */}
      <View style={styles.inputContainer}>
        <Icon name="thermometer" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Temperature Threshold (°C)"
          value={temperature}
          onChangeText={setTemperature}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      {/* Water Level Threshold */}
      <View style={styles.inputContainer}>
        <Icon name="tint" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Water Level Threshold (%)"
          value={waterThreshold}
          onChangeText={setWaterThreshold}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      {/* Air Humidity Threshold */}
      <View style={styles.inputContainer}>
        <Icon name="tint" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Air Humidity Threshold (%)"
          value={airHumidity}
          onChangeText={setAirHumidity}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;