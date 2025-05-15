import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../context/UserContext';
import { PremiumText } from '../_layout';
import { demoPosts } from './feed';

// Demo: import posts from feed
const demoFeedPosts = [
  { id: 'p1', user: 'you', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: 'p2', user: 'you', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: 'p3', user: 'alice', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
];

const posts = [
  { id: '1', image: 'https://source.unsplash.com/random/400x302' },
  { id: '2', image: 'https://source.unsplash.com/random/400x303' },
  { id: '3', image: 'https://source.unsplash.com/random/400x304' },
];

const WALLET_ADDRESS = 'JLoZ8cWwv6hPYR1dshN61scNHwF9DAA257YtVjZfB3E';

export default function ProfileScreen() {
  const stakedAmount = '3.7 SOL';
  const router = useRouter();
  const { profilePic, setProfilePic } = useUser();
  const params = useLocalSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(k => k + 1);
    }, [params.refresh])
  );

  // Get all posts by the current user from demoPosts
  const userPosts = demoPosts.filter(p => p.user === 'you');
  // Demo followers/following
  const followers = 1234;
  const following = 321;

  const handleChangeProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={demoPosts.filter(p => p.user === 'you')}
        key={refreshKey}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <>
            <View style={styles.topBar}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.menuIcon} onPress={() => router.push('/settings')}>
                <Ionicons name="menu" size={32} color={Colors.dark.tint} />
              </TouchableOpacity>
            </View>
            <View style={styles.header}>
              <Image source={{ uri: profilePic }} style={styles.avatar} />
              <PremiumText style={styles.username}>@phantomuser</PremiumText>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{userPosts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>
            <View style={styles.walletCard}>
              <PremiumText style={styles.walletLabel}>Wallet Address</PremiumText>
              <PremiumText style={styles.walletId}>{WALLET_ADDRESS}</PremiumText>
            </View>
            <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Posts</Text>
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <Image source={{ uri: profilePic }} style={styles.timelineAvatar} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.timelineUser}>@phantomuser</Text>
                <Text style={styles.timelineText}>{item.text}</Text>
              </View>
            </View>
            {item.image && item.image.trim() !== '' && (
              <Image source={{ uri: item.image }} style={styles.timelineImage} />
            )}
            {/* Show thread (replies by 'you') */}
            {item.comments && item.comments.filter(c => c.user === 'you').length > 0 && (
              <View style={styles.threadContainer}>
                {item.comments.filter(c => c.user === 'you').map(c => (
                  <View key={c.id} style={styles.threadReply}>
                    <Image source={{ uri: profilePic }} style={styles.threadAvatar} />
                    <Text style={styles.threadText}>{c.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
    paddingTop: 48,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    minHeight: 32,
  },
  menuIcon: {
    padding: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    color: Colors.dark.tint,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statNumber: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  statLabel: {
    color: Colors.dark.icon,
    fontSize: 13,
  },
  sectionTitle: {
    color: Colors.dark.tint,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: '#2d2e4a',
    borderRadius: 16,
    padding: 12,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  timelineAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  timelineUser: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  timelineText: {
    color: Colors.dark.text,
    fontSize: 15,
    marginBottom: 2,
  },
  timelineImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: '#1a1a2e',
  },
  threadContainer: {
    marginTop: 8,
    marginLeft: 46,
    borderLeftWidth: 2,
    borderLeftColor: Colors.dark.icon,
    paddingLeft: 10,
  },
  threadReply: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  threadAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  threadText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menuModal: {
    backgroundColor: '#23243a',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    padding: 20,
    minWidth: 220,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuTitle: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuIconLeft: {
    marginRight: 12,
  },
  menuText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  financeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#aba0f1',
    marginTop: 10,
  },
  recentPostsContainer: {
    marginBottom: 16,
  },
  recentPostImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },
  showMoreIcon: {
    padding: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toggleBtn: {
    backgroundColor: 'transparent',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: Colors.dark.tint,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  gridCard: {
    backgroundColor: '#2d2e4a',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  gridUser: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  gridText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  walletCard: {
    backgroundColor: '#23243a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  walletLabel: {
    color: Colors.dark.icon,
    fontSize: 15,
    marginBottom: 6,
  },
  walletId: {
    color: Colors.dark.tint,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 