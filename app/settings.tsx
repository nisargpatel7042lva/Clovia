import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color={Colors.dark.tint} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/edit-profile')}>
          <Ionicons name="person-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <Text style={styles.itemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/wallet-details')}>
          <Ionicons name="wallet-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <Text style={styles.itemText}>Wallet Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/activity')}>
          <Ionicons name="pulse-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <Text style={styles.itemText}>Activity</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="notifications-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <Text style={styles.itemText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="lock-closed-outline" size={22} color={Colors.dark.tint} style={styles.itemIcon} />
          <Text style={styles.itemText}>Privacy</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logged out', 'You have been logged out.') }>
        <Ionicons name="log-out-outline" size={22} color={Colors.dark.background} style={styles.itemIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
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
  backBtn: {
    marginRight: 12,
    padding: 4,
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