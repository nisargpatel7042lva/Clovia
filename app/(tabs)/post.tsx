import { Colors } from '@/constants/Colors';
import { db } from '@/lib/firebase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../context/UserContext';
import { demoPosts } from './feed';

const DEMO_MODE = true;

export default function PostScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { profilePic } = useUser();

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

  const handlePost = async () => {
    if (!text && !image) return;
    if (DEMO_MODE) {
      // Simulate post in demo mode
      const newPost = {
        id: `demo-${Date.now()}`,
        user: 'you',
        avatar: profilePic,
        image: image || '',
        text,
        likes: 0,
        comments: [],
      };
      demoPosts.unshift(newPost); // Add to the start of the array
      setShowSuccess(true);
      setText('');
      setImage(null);
      setTimeout(() => {
        setShowSuccess(false);
        try {
          router.push({ pathname: '/feed', params: { reload: Date.now().toString() } });
        } catch (e) {
          alert('Posted! Please switch to the Feed tab to see your post.');
        }
      }, 300);
      return;
    }
    try {
      await addDoc(collection(db, 'posts'), {
        user: 'you',
        avatar: profilePic,
        image: image || '',
        text,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });
      setText('');
      setImage(null);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        try {
          router.push({ pathname: '/feed', params: { reload: Date.now().toString() } });
        } catch (e) {
          alert('Posted! Please switch to the Feed tab to see your post.');
        }
      }, 300);
    } catch (e) {
      alert('Failed to post. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={48} color="#2ecc40" style={{ marginRight: 14 }} />
            <Text style={styles.successText}>Your post is live!</Text>
          </View>
        </View>
      )}
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
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>
        <TouchableOpacity
          style={styles.memeButton}
          onPress={() => router.push('/meme-generator')}
          activeOpacity={0.85}
        >
          <Text style={styles.memeButtonText}>Create Meme</Text>
        </TouchableOpacity>
      </View>
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
    borderRadius: 24,
    padding: 32,
    width: '98%',
    minHeight: '88%',
    maxHeight: '94%',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 0,
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
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eafbe7',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2ecc40',
    alignSelf: 'center',
  },
  successText: {
    color: '#2ecc40',
    fontWeight: 'bold',
    fontSize: 22,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
    justifyContent: 'center',
  },
  orLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#444',
    marginHorizontal: 10,
    borderRadius: 1,
  },
  orText: {
    color: Colors.dark.icon,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.2,
  },
}); 