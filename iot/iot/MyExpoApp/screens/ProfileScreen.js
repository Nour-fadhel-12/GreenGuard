import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import profilePicture from '../assets/profile.jpg'; // Adjust the path as needed

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Fetch the current user's email and name when the component loads
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || ''); // Set the email
      setName(user.displayName || ''); // Set the name (if available)
    }
  }, []);

  const handleSave = () => {
    // Save profile logic here
    Alert.alert('Success', 'Profile saved successfully!');
  };

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('Login'); // Redirect to the Login Screen
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Header with Sign Out Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Icon name="sign-out" size={24} color="#4CAF50" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
      <Image
  source={profilePicture} // Use the local image
  style={styles.profilePicture}
/>
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="pencil" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Name Field */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

      {/* Email Field (Read-Only) */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          editable={false} // Make the email field read-only
          style={[styles.input, { color: '#666' }]} // Gray text for read-only
          placeholderTextColor="#999"
        />
      </View>

      {/* Phone Field */}
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          placeholderTextColor="#999"
          keyboardType="phone-pad"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  icon: {
    marginLeft: 15,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75, // Makes the image circular
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
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
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;