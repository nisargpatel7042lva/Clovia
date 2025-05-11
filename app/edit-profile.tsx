import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  // Demo initial values
  const [username, setUsername] = useState('phantomuser');
  const [name, setName] = useState('Phantom User');
  const [bio, setBio] = useState('Web3 enthusiast.');

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile has been updated.');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor={Colors.dark.icon}
        />
        <Text style={styles.label}>Profile Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Profile Name"
          placeholderTextColor={Colors.dark.icon}
        />
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={bio}
          onChangeText={setBio}
          placeholder="Bio"
          placeholderTextColor={Colors.dark.icon}
          multiline
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: Colors.dark.tint,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    color: Colors.dark.icon,
    fontSize: 15,
    marginBottom: 6,
    marginTop: 16,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#23243a',
    color: Colors.dark.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelBtn: {
    backgroundColor: Colors.dark.icon,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  cancelText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  saveText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 