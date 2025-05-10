import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const demoChats = [
  { id: 'chat1', name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', last: 'Hey there!' },
  { id: 'chat2', name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', last: "Let's catch up." },
  { id: 'group1', name: 'Crypto Group', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', last: 'New event soon!' },
];

export default function MessagesScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={demoChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => router.push({ pathname: '/chat', params: { id: item.id, name: item.name, avatar: item.avatar } })}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.last}>{item.last}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={Colors.dark.icon} />
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
    paddingTop: 48,
    paddingHorizontal: 0,
  },
  header: {
    color: Colors.dark.tint,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    marginLeft: 18,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#23243a',
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 16,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  last: {
    color: Colors.dark.text,
    fontSize: 15,
    marginTop: 2,
  },
}); 