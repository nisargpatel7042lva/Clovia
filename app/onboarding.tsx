import { Colors } from '@/constants/Colors';
import { db } from '@/lib/firebase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PremiumText } from './_layout';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadProfilePhoto = async (uri: string, username: string) => {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_photos/${username}_${Date.now()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleContinue = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !contact.trim() || !age.trim() || !photo) {
      Alert.alert('Please fill all fields and select a profile photo.');
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
      Alert.alert('Username must be at least 3 characters and contain only letters, numbers, or underscores.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      Alert.alert('Please enter a valid email address.');
      return;
    }
    if (!/^\d{10,}$/.test(contact)) {
      Alert.alert('Please enter a valid contact number.');
      return;
    }
    if (isNaN(Number(age)) || Number(age) < 13) {
      Alert.alert('Please enter a valid age (13 or older).');
      return;
    }
    setLoading(true);
    try {
      // Upload photo
      const photoURL = await uploadProfilePhoto(photo, username);
      // Save user data
      await addDoc(collection(db, 'users'), {
        name,
        username,
        email,
        contact,
        age: Number(age),
        photoURL,
        createdAt: serverTimestamp(),
      });
      setLoading(false);
      router.replace('/feed');
    } catch (e) {
      setLoading(false);
      console.log('Profile save error:', e);
      Alert.alert('Failed to save profile', e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <PremiumText style={styles.title}>Set up your profile</PremiumText>
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={{ color: Colors.dark.tint, fontSize: 32 }}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={Colors.dark.icon}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={Colors.dark.icon}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.dark.icon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        placeholderTextColor={Colors.dark.icon}
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor={Colors.dark.icon}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={loading}>
        {loading ? <ActivityIndicator color={Colors.dark.background} /> : <PremiumText style={styles.continueBtnText}>Continue</PremiumText>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: Colors.dark.tint,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.icon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.tint,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    fontSize: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.dark.icon,
  },
  continueBtn: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 10,
  },
  continueBtnText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.1,
  },
}); 