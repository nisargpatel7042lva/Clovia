import { Colors } from '@/constants/Colors';
import { db } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MessagesScreen() {
  const router = useRouter();
  const [chats, setChats] = React.useState<any[]>([]);
  React.useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('lastMessageAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={chats}
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