import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PostStoryScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    setLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [9, 16],
      quality: 1,
    });
    setLoading(false);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [9, 16],
      quality: 1,
    });
    setLoading(false);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    setCaption('');
    setImage(null);
    Alert.alert('Story Posted!', 'Your story has been added.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Camera access denied. Please enable camera permissions in your settings.</Text>
        <TouchableOpacity onPress={() => ImagePicker.requestCameraPermissionsAsync().then(({ status }) => setHasPermission(status === 'granted'))}>
          <Text style={{ color: Colors.dark.tint, fontWeight: 'bold', fontSize: 16, marginTop: 16 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: 36 }]}>
      <Text style={styles.title}>Post a Story</Text>
      {!image ? (
        <>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto} disabled={loading}>
            <Text style={styles.cameraButtonText}>{loading ? 'Opening Camera...' : 'Take a Picture'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery} disabled={loading}>
            <Text style={styles.galleryButtonText}>{loading ? 'Loading...' : 'Choose from Gallery'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.fullScreenWrapper}>
          <View style={styles.imagePreviewWrapperFull}>
            <Image source={{ uri: image }} style={styles.imagePreviewFull} />
            <View style={styles.topRightIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={() => setImage(null)}>
                <Ionicons name="close" size={28} color={Colors.dark.tint} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.fab} onPress={handlePost}>
              <Text style={styles.fabText}>Post Story</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: Colors.dark.tint,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  cameraButton: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  cameraButtonText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 18,
  },
  galleryButton: {
    backgroundColor: '#23243a',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  galleryButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  fullScreenWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewWrapperFull: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewFull: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  inputOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#23243acc',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.dark.tint,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.1,
  },
  cancelFab: {
    position: 'absolute',
    top: 40,
    right: 24,
    backgroundColor: '#23243acc',
    borderRadius: 20,
    padding: 6,
    zIndex: 3,
  },
  infoText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cropIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#18192bcc',
    borderRadius: 18,
    padding: 4,
    zIndex: 2,
  },
  topRightIcons: {
    position: 'absolute',
    top: 40,
    right: 24,
    flexDirection: 'row',
    zIndex: 3,
  },
  iconButton: {
    backgroundColor: '#23243acc',
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  cropModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropModalContent: {
    backgroundColor: Colors.dark.background,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    width: 340,
    height: 420,
    position: 'relative',
  },
  cropRect: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.dark.tint,
    backgroundColor: 'rgba(170,0,255,0.08)',
    zIndex: 10,
  },
  cropButton: {
    marginTop: 24,
    backgroundColor: Colors.dark.tint,
    borderRadius: 10,
    padding: 12,
    width: 120,
    alignItems: 'center',
  },
  cropButtonText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cropCancelButton: {
    marginTop: 10,
    backgroundColor: '#23243a',
    borderRadius: 10,
    padding: 10,
    width: 120,
    alignItems: 'center',
  },
  cropCancelButtonText: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 15,
  },
  cropResizeHandle: {
    position: 'absolute',
    right: -12,
    top: '50%',
    width: 24,
    height: 36,
    marginTop: -18,
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    opacity: 0.7,
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 