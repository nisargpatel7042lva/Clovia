import { Colors } from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const options = {
  headerShown: false,
};

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <Ionicons name="lock-closed-outline" size={32} color={Colors.dark.tint} style={{ marginRight: 10 }} />
        <Text style={styles.headerTitle}>Privacy & Data</Text>
      </View>
      <Text style={styles.sectionTitle}>Your Privacy Matters</Text>
      <Text style={styles.text}>
        We believe your privacy is a fundamental right. Clovia is designed to give you full control over your data and your experience.
      </Text>
      <Text style={styles.sectionTitle}>What We Collect</Text>
      <Text style={styles.text}>
        - Only the information you choose to share (posts, profile info, wallet address).
        {'\n'}- No tracking of your private messages or financial data.
        {'\n'}- No selling of your data to third parties.
      </Text>
      <Text style={styles.sectionTitle}>Your Control</Text>
      <Text style={styles.text}>
        - You can edit or delete your posts at any time.
        {'\n'}- You control who can see your profile and posts.
        {'\n'}- You can disconnect your wallet whenever you want.
      </Text>
      <Text style={styles.sectionTitle}>Security</Text>
      <Text style={styles.text}>
        - All sensitive actions are protected with the latest security standards.
        {'\n'}- We use encryption to keep your data safe.
      </Text>
      <Text style={styles.sectionTitle}>Questions?</Text>
      <Text style={styles.text}>
        If you have any questions or concerns about your privacy, reach out to us at privacy@clovia.app.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    color: Colors.dark.tint,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  sectionTitle: {
    color: Colors.dark.tint,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
  },
  text: {
    color: Colors.dark.text,
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
}); 