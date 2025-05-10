import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MemeGeneratorScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleShare = () => {
    if (!image) return;
    // Pass meme data to feed
    const meme = { image, topText, bottomText };
    router.push(`/feed?newMeme=${encodeURIComponent(JSON.stringify(meme))}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Meme</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.memeImage} />
        ) : (
          <>
            <Ionicons name="image-outline" size={48} color={Colors.dark.icon} />
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          </>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Top Text"
        placeholderTextColor={Colors.dark.icon}
        value={topText}
        onChangeText={setTopText}
      />
      <TextInput
        style={styles.input}
        placeholder="Bottom Text"
        placeholderTextColor={Colors.dark.icon}
        value={bottomText}
        onChangeText={setBottomText}
      />
      {/* Meme Preview */}
      {image && (
        <View style={styles.previewContainer}>
          <View style={styles.memePreview}>
            <Image source={{ uri: image }} style={styles.memePreviewImage} />
            <Text style={styles.memeTextTop}>{topText}</Text>
            <Text style={styles.memeTextBottom}>{bottomText}</Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={[styles.shareButton, (!image || (!topText && !bottomText)) && { opacity: 0.5 }]}
        onPress={handleShare}
        disabled={!image || (!topText && !bottomText)}
      >
        <Text style={styles.shareButtonText}>Share to Feed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    minHeight: '100%',
  },
  title: {
    color: Colors.dark.tint,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 1.1,
  },
  imagePicker: {
    backgroundColor: '#23243a',
    borderRadius: 16,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    overflow: 'hidden',
  },
  imagePickerText: {
    color: Colors.dark.icon,
    fontSize: 16,
    marginTop: 8,
  },
  memeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    backgroundColor: '#18192b',
    color: Colors.dark.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    width: SCREEN_WIDTH * 0.8,
  },
  previewContainer: {
    marginVertical: 18,
    alignItems: 'center',
  },
  memePreview: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memePreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  memeTextTop: {
    position: 'absolute',
    top: 18,
    left: 10,
    right: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  memeTextBottom: {
    position: 'absolute',
    bottom: 18,
    left: 10,
    right: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  shareButton: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.8,
    marginTop: 10,
  },
  shareButtonText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.1,
  },
}); 