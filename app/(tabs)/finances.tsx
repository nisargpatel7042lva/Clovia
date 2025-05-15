import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PremiumText } from '../_layout';

const transactions = [
  { id: '1', type: 'Received', amount: '+2.5 SOL', date: '2024-06-01' },
  { id: '2', type: 'Sent', amount: '-1.0 SOL', date: '2024-05-30' },
];

const WALLET_ADDRESS = 'JLoZ8cWwv6hPYR1dshN61scNHwF9DAA257YtVjZfB3E';

export default function FinancesScreen() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setConnecting(true);
    setTimeout(() => {
      setWalletAddress(WALLET_ADDRESS);
      setConnecting(false);
    }, 3000);
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
        {connecting && (
          <ActivityIndicator color={Colors.dark.background} style={{ marginTop: 8 }} />
        )}
        {walletAddress && (
          <PremiumText style={{ color: Colors.dark.background, fontSize: 13, marginTop: 4 }} numberOfLines={1}>
            {walletAddress}
          </PremiumText>
        )}
      </TouchableOpacity>
      {/* Wallet ID Section removed */}
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