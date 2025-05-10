import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const trending = [
  { id: '1', topic: '#Solana' },
  { id: '2', topic: '#Crypto' },
  { id: '3', topic: '#Web3' },
  { id: '4', topic: '#DeFi' },
];

const demoUsers = [
  { id: 'u1', username: 'alice', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 'u2', username: 'bob', name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 'u3', username: 'carol', name: 'Carol', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 'u4', username: 'dave', name: 'Dave', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 'u5', username: 'eve', name: 'Eve', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { id: 'u6', username: 'frank', name: 'Frank', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { id: 'u7', username: 'grace', name: 'Grace', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [trendingOpen, setTrendingOpen] = useState(true);
  const router = useRouter();

  const filteredUsers = query.trim()
    ? demoUsers.filter(u => u.username.toLowerCase().includes(query.toLowerCase()))
    : demoUsers;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor={Colors.dark.icon}
        value={query}
        onChangeText={setQuery}
      />
      <Text style={styles.sectionTitle}>Users</Text>
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trendCard} onPress={() => router.push(`/user-profile?id=${item.id}&username=${item.username}&name=${encodeURIComponent(item.name)}&avatar=${encodeURIComponent(item.avatar)}`)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: item.avatar }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
              <View>
                <Text style={{ color: Colors.dark.text, fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ color: Colors.dark.icon, fontSize: 14 }}>@{item.username}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* Collapsible Trending Section */}
      <TouchableOpacity style={styles.collapseHeader} onPress={() => setTrendingOpen(o => !o)}>
        <Text style={styles.sectionTitle}>Trending</Text>
        <Ionicons name={trendingOpen ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.dark.tint} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
      {trendingOpen && (
        <FlatList
          data={trending}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trendCard}>
              <Text style={styles.trendText}>{item.topic}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 80,
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
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 2,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
}); 