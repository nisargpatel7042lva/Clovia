import { Colors } from '@/constants/Colors';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useWallet } from '../context/WalletContext';

export default function WalletDetailsScreen() {
  const router = useRouter();
  const { walletAddress } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (walletAddress) {
      await Clipboard.setStringAsync(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      Alert.alert('Copied!', 'Wallet address copied to clipboard.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet Details</Text>
      </View>
      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Wallet Address</Text>
        {!walletAddress ? (
          <Text style={{ color: '#a4508b', fontSize: 16, textAlign: 'center' }}>Connect your wallet to see details.</Text>
        ) : (
          <View style={styles.walletRow}>
            <Text style={styles.walletId}>{walletAddress}</Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
              <Ionicons name={copied ? 'checkmark-done' : 'copy-outline'} size={22} color={Colors.dark.tint} />
            </TouchableOpacity>
          </View>
        )}
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
  walletCard: {
    backgroundColor: '#23243a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  walletLabel: {
    color: Colors.dark.icon,
    fontSize: 16,
    marginBottom: 8,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletId: {
    color: Colors.dark.tint,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  copyBtn: {
    padding: 6,
  },
}); 