import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const trending = [
  { id: '1', topic: '#Solana' },
  { id: '2', topic: '#Crypto' },
  { id: '3', topic: '#Web3' },
  { id: '4', topic: '#DeFi' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor={Colors.dark.icon}
        value={query}
        onChangeText={setQuery}
      />
      <Text style={styles.sectionTitle}>Trending</Text>
      <FlatList
        data={trending}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trendCard}>
            <Text style={styles.trendText}>{item.topic}</Text>
          </TouchableOpacity>
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
  input: {
    backgroundColor: '#23243a',
    color: Colors.dark.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    color: Colors.dark.tint,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  trendCard: {
    backgroundColor: '#23243a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  trendText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
}); 