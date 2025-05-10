import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

export default function ProfileScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const stakedAmount = '3.7 SOL';

  // Filter for user's posts (demo: user === 'you')
  const userPosts = demoFeedPosts.filter(p => p.user === 'you');
  const [showAllRecent, setShowAllRecent] = useState(false);
  const visibleRecent = showAllRecent ? userPosts : userPosts.slice(0, 6);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.menuIcon} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={32} color={Colors.dark.tint} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/3.jpg' }} style={styles.avatar} />
        <Text style={styles.username}>@phantomuser</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2.3k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>180</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
      {/* Recent Posts Horizontal Scroll (no title) */}
      {userPosts.length > 0 && (
        <View style={styles.recentPostsContainer}>
          <FlatList
            data={visibleRecent}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Image source={{ uri: item.image }} style={styles.recentPostImage} />
            )}
            ListFooterComponent={
              !showAllRecent && userPosts.length > 6 ? (
                <TouchableOpacity style={styles.showMoreIcon} onPress={() => setShowAllRecent(true)}>
                  <Ionicons name="ellipsis-horizontal-circle" size={40} color={Colors.dark.tint} />
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      )}
      <Text style={styles.sectionTitle}>Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      />
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuModal}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings-outline" size={22} color={Colors.dark.tint} style={styles.menuIconLeft} />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={22} color={Colors.dark.tint} style={styles.menuIconLeft} />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="pulse-outline" size={22} color={Colors.dark.tint} style={styles.menuIconLeft} />
              <Text style={styles.menuText}>Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="wallet-outline" size={22} color={Colors.dark.tint} style={styles.menuIconLeft} />
              <Text style={styles.menuText}>Wallet Details</Text>
            </TouchableOpacity>
            <View style={styles.financeTab}>
              <Ionicons name="trending-up-outline" size={22} color={Colors.dark.tint} style={styles.menuIconLeft} />
              <Text style={styles.menuText}>Staked: <Text style={{ color: Colors.dark.tint, fontWeight: 'bold' }}>{stakedAmount}</Text></Text>
            </View>
          </View>
        </Pressable>
      </Modal>
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
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 4,
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
    borderTopColor: '#2d2e4a',
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
}); 