import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const demoMessages = [
  { id: 'm1', fromMe: false, text: 'Hey! 👋' },
  { id: 'm2', fromMe: true, text: 'Hi! How are you?' },
  { id: 'm3', fromMe: false, text: 'Doing great, you?' },
  { id: 'm4', fromMe: true, text: 'Awesome!' },
];

export default function ChatScreen() {
  const { name, avatar } = useLocalSearchParams<{ name: string; avatar: string }>();
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: `m${Date.now()}`, fromMe: true, text: input }]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Ionicons name="chevron-back" size={28} color={Colors.dark.tint} />
        </TouchableOpacity>
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