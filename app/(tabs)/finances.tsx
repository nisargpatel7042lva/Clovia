import { Colors } from '@/constants/Colors';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PremiumText } from '../_layout';

const transactions = [
  { id: '1', type: 'Received', amount: '+2.5 SOL', date: '2024-06-01' },
  { id: '2', type: 'Sent', amount: '-1.0 SOL', date: '2024-05-30' },
];

const WALLET_ID = '7f8a...b3c2';

export default function FinancesScreen() {
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const APP_IDENTITY = {
    name: 'Clovia',
    uri: 'clovia://', // Use your app's scheme for dev builds
    icon: 'icon.png', // Path relative to the URI
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(WALLET_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    Alert.alert('Copied!', 'Wallet ID copied to clipboard.');
  };

  const handleConnectWallet = async () => {
    setConnecting(true);
    try {
      const result = await transact(async (wallet) => {
        const auth = await wallet.authorize({
          chain: 'solana:devnet', // or 'solana:mainnet', 'mainnet-beta', etc.
          identity: APP_IDENTITY,
        });
        return auth;
      });
      setWalletAddress(result.accounts[0].address);
      Alert.alert('Wallet Connected', `Address: ${result.accounts[0].address}`);
    } catch (e) {
      Alert.alert('Connection Failed', e instanceof Error ? e.message : String(e));
    } finally {
      setConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Wallet Connect Button */}
      <TouchableOpacity
        style={{
          backgroundColor: Colors.dark.tint,
          borderRadius: 12,
          padding: 14,
          alignItems: 'center',
          marginBottom: 18,
          opacity: connecting ? 0.7 : 1,
        }}
        onPress={handleConnectWallet}
        disabled={!!walletAddress || connecting}
      >
        <PremiumText style={{ color: Colors.dark.background, fontWeight: 'bold', fontSize: 16 }}>
          {walletAddress ? 'Wallet Connected' : connecting ? 'Connecting...' : 'Connect Wallet'}
        </PremiumText>
        {walletAddress && (
          <PremiumText style={{ color: Colors.dark.background, fontSize: 13, marginTop: 4 }} numberOfLines={1}>
            {walletAddress}
          </PremiumText>
        )}
      </TouchableOpacity>
      {/* Wallet ID Section */}
      <View style={styles.walletIdRow}>
        <PremiumText style={styles.walletIdLabel}>Wallet ID:</PremiumText>
        <PremiumText style={styles.walletId}>{WALLET_ID}</PremiumText>
        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
          <Ionicons name="copy-outline" size={22} color={Colors.dark.tint} />
        </TouchableOpacity>
      </View>
      <View style={styles.balanceCard}>
        <PremiumText style={styles.balanceLabel}>Wallet Balance</PremiumText>
        <PremiumText style={styles.balance}>4.2 SOL</PremiumText>
      </View>
      <PremiumText style={styles.sectionTitle}>Recent Transactions</PremiumText>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <PremiumText style={styles.transactionType}>{item.type}</PremiumText>
            <PremiumText style={styles.transactionAmount}>{item.amount}</PremiumText>
            <PremiumText style={styles.transactionDate}>{item.date}</PremiumText>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
    paddingTop: 48,
  },
  walletIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#23243a',
    borderRadius: 12,
    padding: 12,
  },
  walletIdLabel: {
    color: Colors.dark.icon,
    fontSize: 15,
    marginRight: 8,
  },
  walletId: {
    color: Colors.dark.tint,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  copyBtn: {
    padding: 6,
  },
  balanceCard: {
    backgroundColor: '#23243a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceLabel: {
    color: Colors.dark.icon,
    fontSize: 16,
    marginBottom: 6,
  },
  balance: {
    color: Colors.dark.tint,
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.dark.tint,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: '#23243a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  transactionType: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionAmount: {
    color: Colors.dark.tint,
    fontSize: 16,
    marginTop: 2,
  },
  transactionDate: {
    color: Colors.dark.icon,
    fontSize: 13,
    marginTop: 2,
  },
}); 