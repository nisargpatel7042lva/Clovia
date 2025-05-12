import { Colors } from '@/constants/Colors';
import { db } from '@/lib/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChatScreen() {
  const { name, avatar, id } = useLocalSearchParams<{ name: string; avatar: string; id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'chats', id as string, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [id]);

  const handleSend = async () => {
    if (!input.trim() || !id) return;
    await addDoc(collection(db, 'chats', id as string, 'messages'), {
      text: input,
      fromMe: true, // You can replace with userId logic
      createdAt: serverTimestamp(),
    });
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={{ padding: 18, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.fromMe ? styles.bubbleMe : styles.bubbleOther]}>
            <Text style={[styles.messageText, !item.fromMe && { color: '#fff' }]}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor={Colors.dark.icon}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={22} color={Colors.dark.tint} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: Colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: '#23243a',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  name: {
    color: Colors.dark.tint,
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  bubbleMe: {
    backgroundColor: Colors.dark.tint,
    alignSelf: 'flex-end',
  },
  bubbleOther: {
    backgroundColor: '#aba0f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: Colors.dark.background,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: '#23243a',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  input: {
    flex: 1,
    backgroundColor: '#23243a',
    color: Colors.dark.text,
    borderRadius: 18,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    padding: 8,
  },
}); 