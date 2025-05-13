import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../context/UserContext';
import { PremiumText } from './_layout';

export const options = {
  
  headerShown: false,
};

export default function SettingsScreen() {
  const router = useRouter();
  const { profilePic, setProfilePic } = useUser();

  const handleChangeProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PremiumText style={styles.headerTitle}>Settings</PremiumText>
      </View>
      <View style={styles.section}>
        <PremiumText style={styles.sectionTitle}>Account</PremiumText>
        <TouchableOpacity style={styles.item} onPress={handleChangeProfilePic}>
          <Image source={{ uri: profilePic }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 14 }} />
          <PremiumText style={styles.itemText}>Change Profile Picture</PremiumText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/edit-profile')}>
          <Ionicons name="person-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <PremiumText style={styles.itemText}>Edit Profile</PremiumText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/wallet-details')}>
          <Ionicons name="wallet-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <PremiumText style={styles.itemText}>Wallet Details</PremiumText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/activity')}>
          <Ionicons name="pulse-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <PremiumText style={styles.itemText}>Activity</PremiumText>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <PremiumText style={styles.sectionTitle}>Preferences</PremiumText>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="notifications-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <PremiumText style={styles.itemText}>Notifications</PremiumText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push({ pathname: '/privacy' })}>
          <Ionicons name="lock-closed-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <PremiumText style={styles.itemText}>Privacy</PremiumText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logged out', 'You have been logged out.') }>
        <Ionicons name="log-out-outline" size={22} color={Colors.dark.background} style={styles.itemIcon} />
        <PremiumText style={styles.logoutText}>Log Out</PremiumText>
      </TouchableOpacity>
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: Colors.dark.icon,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#23243a',
  },
  itemIcon: {
    marginRight: 14,
  },
  itemText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
}); 