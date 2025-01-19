import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native'; // Import LottieView
import { database } from '../firebaseConfig'; // Import Firebase database
import { ref, set, onValue } from 'firebase/database'; // Import Firebase functions

const { width } = Dimensions.get('window'); // Get screen width

const DashboardScreen = ({ navigation }) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false); // State for notifications pop-up
  const [irrigating, setIrrigating] = useState(false); // State for irrigation pop-up

  // State for Firebase data
  const [temperature, setTemperature] = useState('Loading...');
  const [airHumidity, setAirHumidity] = useState('Loading...');
  const [soilMoisture, setSoilMoisture] = useState('Loading...');
  const [waterLevel, setWaterLevel] = useState('Loading...');

  // State for status (buzzer and pump)
  const [buzzerStatus, setBuzzerStatus] = useState('OFF');
  const [pumpStatus, setPumpStatus] = useState('OFF');

  // State for notifications
  const [notifications, setNotifications] = useState([
    // Fake notifications
    { id: '1', message: 'Soil moisture is below the threshold (40%).', time: '10:00 AM' },
    { id: '2', message: 'Water level is low (20%).', time: '09:30 AM' },
    { id: '3', message: 'Temperature is above the threshold (30°C).', time: '09:00 AM' },
  ]);

  // Fetch real-time data from Firebase
  useEffect(() => {
    const sensorRef = ref(database, 'sensorData'); // Path to sensor data
    const statusRef = ref(database, 'status'); // Path to status data

    // Fetch sensor data
    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(`${data.temperature}°C`); // Update temperature
        setAirHumidity(`${data.humidity}%`); // Update air humidity
        setSoilMoisture(`${data.soilMoisture}%`); // Update soil moisture
        setWaterLevel(`${data.waterLevel}%`); // Update water level
      }
    });

    // Fetch status data and add notifications
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Check if buzzer status changed
        if (data.buzzer !== buzzerStatus) {
          setBuzzerStatus(data.buzzer);
          addNotification(`Buzzer turned ${data.buzzer}`);
        }

        // Check if pump status changed
        if (data.pump !== pumpStatus) {
          setPumpStatus(data.pump);
          addNotification(`Pump turned ${data.pump}`);
        }
      }
    });
  }, [buzzerStatus, pumpStatus]);

  // Add a new notification
  const addNotification = (message) => {
    const newNotification = {
      id: Math.random().toString(), // Generate a unique ID
      message,
      time: new Date().toLocaleTimeString(), // Add the current time
    };
    setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
  };

  // Handle Activate Irrigation button press
  const handleActivateIrrigation = () => {
    set(ref(database, 'status/pump'), 'ON') // Turn pump ON
      .then(() => {
        setIrrigating(true); // Show irrigation pop-up
        setTimeout(() => {
          setIrrigating(false); // Hide irrigation pop-up after 3 seconds
        }, 3000);
        Alert.alert('Success', 'Irrigation activated!');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to activate irrigation. Please try again.');
        console.error('Error activating irrigation:', error);
      });
  };

  // Handle Stop Irrigation button press
  const handleStopIrrigation = () => {
    set(ref(database, 'status/pump'), 'OFF') // Turn pump OFF
      .then(() => {
        Alert.alert('Success', 'Irrigation stopped!');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to stop irrigation. Please try again.');
        console.error('Error stopping irrigation:', error);
      });
  };

  // Handle Buzzer Toggle
  const toggleBuzzer = () => {
    const newStatus = buzzerStatus === 'ON' ? 'OFF' : 'ON';
    set(ref(database, 'status/buzzer'), newStatus)
      .then(() => {
        Alert.alert('Success', `Buzzer turned ${newStatus}`);
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to toggle buzzer. Please try again.');
        console.error('Error toggling buzzer:', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Header with Settings, Notifications, and Profile Icons */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GreenGuard</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog" size={24} color="#4CAF50" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNotificationsVisible(true)}>
            <Icon name="bell" size={24} color="#4CAF50" style={styles.icon} />
          </TouchableOpacity>
          {/* Add Profile Icon */}
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="user" size={24} color="#4CAF50" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Indicators Grid */}
      <View style={styles.grid}>
        {/* Temperature Card */}
        <View style={styles.card}>
          <Icon name="thermometer" size={30} color="#4CAF50" style={styles.cardIcon} />
          <Text style={styles.label}>Temperature</Text>
          <Text style={styles.value}>{temperature}</Text>
        </View>

        {/* Air Humidity Card */}
        <View style={styles.card}>
          <Icon name="tint" size={30} color="#4CAF50" style={styles.cardIcon} />
          <Text style={styles.label}>Air Humidity</Text>
          <Text style={styles.value}>{airHumidity}</Text>
        </View>

        {/* Soil Moisture Card */}
        <View style={styles.card}>
          <Icon name="leaf" size={30} color="#4CAF50" style={styles.cardIcon} />
          <Text style={styles.label}>Soil Moisture</Text>
          <Text style={styles.value}>{soilMoisture}</Text>
        </View>

        {/* Water Level Card */}
        <View style={styles.card}>
          <Icon name="tint" size={30} color="#4CAF50" style={styles.cardIcon} />
          <Text style={styles.label}>Water Level</Text>
          <Text style={styles.value}>{waterLevel}</Text>
        </View>
      </View>

      {/* Buzzer Control */}
      <View style={styles.controlContainer}>
        <Icon name="bell" size={24} color="#4CAF50" style={styles.controlIcon} />
        <Text style={styles.controlLabel}>Buzzer: {buzzerStatus}</Text>
        <TouchableOpacity
          style={[styles.controlButton, buzzerStatus === 'ON' ? styles.controlButtonOn : styles.controlButtonOff]}
          onPress={toggleBuzzer}
        >
          <Text style={styles.controlButtonText}>{buzzerStatus === 'ON' ? 'Turn Off' : 'Turn On'}</Text>
        </TouchableOpacity>
      </View>

      {/* Irrigation Buttons */}
      <View style={styles.buttonContainer}>
        {/* Activate Irrigation Button */}
        <TouchableOpacity style={styles.button} onPress={handleActivateIrrigation}>
          <Icon name="tint" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Activate Irrigation</Text>
        </TouchableOpacity>

        {/* Stop Irrigation Button */}
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStopIrrigation}
        >
          <Icon name="tint" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Stop Irrigation</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Popup */}
      <Modal
        visible={notificationsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.notification}>
                  <Icon name="bell" size={20} color="#4CAF50" style={styles.icon} />
                  <View>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                </View>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setNotificationsVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Irrigation Popup with Lottie Animation */}
      <Modal
        visible={irrigating}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIrrigating(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Lottie Animation */}
            <LottieView
              source={require('../assets/irrigation-animation.json')} // Path to your animation file
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.modalText}>Irrigating Now...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: width * 0.45,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  controlIcon: {
    marginRight: 10,
  },
  controlLabel: {
    fontSize: 16,
    color: '#333',
  },
  controlButton: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  controlButtonOn: {
    backgroundColor: '#FF4444', // Red for ON state
  },
  controlButtonOff: {
    backgroundColor: '#4CAF50', // Green for OFF state
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15, // Add margin between buttons
  },
  stopButton: {
    backgroundColor: '#FF4444', // Red color for Stop button
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animation: {
    width: 150,
    height: 150,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
});

export default DashboardScreen;