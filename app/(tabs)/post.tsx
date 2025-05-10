import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PostScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    // In a real app, this would update the feed context or global state
    setText('');
    setImage(null);
    Alert.alert('Posted!', 'Your post has been added to the feed.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Post</Text>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={Colors.dark.icon}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          <Text style={styles.imageUploadText}>{image ? 'Change Image' : '+ Add Image'}</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.button} onPress={handlePost} disabled={!text && !image}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.memeButton}
        onPress={() => router.push('/meme-generator')}
        activeOpacity={0.85}
      >
        <Text style={styles.memeButtonText}>Create Meme</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#23243a',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    color: Colors.dark.tint,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#18192b',
    color: Colors.dark.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    width: '100%',
  },
  imageUpload: {
    backgroundColor: '#18192b',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  imageUploadText: {
    color: Colors.dark.icon,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    width: '100%',
    opacity: 1,
  },
  buttonText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  memeButton: {
    marginTop: 24,
    backgroundColor: '#a4508b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  memeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.1,
  },
}); 