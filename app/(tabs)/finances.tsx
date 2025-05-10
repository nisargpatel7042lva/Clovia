import { Colors } from '@/constants/Colors';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const transactions = [
  { id: '1', type: 'Received', amount: '+2.5 SOL', date: '2024-06-01' },
  { id: '2', type: 'Sent', amount: '-1.0 SOL', date: '2024-05-30' },
];

export default function FinancesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balance}>4.2 SOL</Text>
      </View>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text style={styles.transactionType}>{item.type}</Text>
            <Text style={styles.transactionAmount}>{item.amount}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
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