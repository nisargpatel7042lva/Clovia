import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Demo posts per user
const demoUserPosts: Record<string, { id: string; image: string }[]> = {
  alice: [
    { id: 'p1', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
    { id: 'p2', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  ],
  bob: [
    { id: 'p3', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
    { id: 'p4', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429' },
  ],
  carol: [
    { id: 'p5', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99' },
  ],
  dave: [
    { id: 'p6', image: 'https://images.unsplash.com/photo-1465101053361-7630c1c47054' },
  ],
  eve: [
    { id: 'p7', image: 'https://images.unsplash.com/photo-1465101060172-cd5f2a6b1b6a' },
  ],
  frank: [
    { id: 'p8', image: 'https://images.unsplash.com/photo-1465101071231-2eec1d8d1b1a' },
  ],
  grace: [
    { id: 'p9', image: 'https://images.unsplash.com/photo-1465101082342-2eec1d8d1b1a' },
  ],
};

export default function UserProfileScreen() {
  const { id, username, name, avatar } = useLocalSearchParams();
  const [followModal, setFollowModal] = useState(false);
  const [stakeModal, setStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showUnfollow, setShowUnfollow] = useState(false);
  const [unfollowMsg, setUnfollowMsg] = useState(false);
  const router = useRouter();

  // Demo stats
  const followers = 123 + (username ? (username as string).length * 7 : 0);
  const following = 42 + (username ? (username as string).length * 2 : 0);
  const posts = demoUserPosts[username as string] || [];

  const handleConfirmStake = () => {
    setStakeModal(false);
    setStakeAmount('');
    setIsFollowing(true);
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 2500);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar as string }} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.username}>@{username}</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{posts.length}</Text>
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
      {/* User's posts horizontal scroll */}
      {posts.length > 0 && (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.postImage} />
          )}
        />
      )}
      <TouchableOpacity
        style={[styles.followBtn, isFollowing && { backgroundColor: Colors.dark.icon }]}
        onPress={() => {
          if (!isFollowing) setFollowModal(true);
          else setShowUnfollow(true);
        }}
        disabled={false}
      >
        <Text style={[styles.followBtnText, isFollowing && { color: Colors.dark.text }]}> {isFollowing ? 'Following' : 'Follow'} </Text>
      </TouchableOpacity>
      {/* Congratulations message bar */}
      {showCongrats && (
        <View style={styles.congratsBar}>
          <Text style={styles.congratsText}>Congratulations on staking and earning!</Text>
        </View>
      )}
      {/* Unfollow/Unstake message bar */}
      {unfollowMsg && (
        <View style={styles.congratsBar}>
          <Text style={styles.congratsText}>You have unfollowed and unstaked.</Text>
        </View>
      )}
      {/* Unfollow/Unstake Modal */}
      <Modal visible={showUnfollow} transparent animationType="fade" onRequestClose={() => setShowUnfollow(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowUnfollow(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unfollow & Unstake?</Text>
            <Text style={{ color: Colors.dark.text, marginBottom: 18, textAlign: 'center', fontWeight: '500' }}>
              Do you want to unfollow and unstake your staked amount?
            </Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => {
              setIsFollowing(false);
              setShowUnfollow(false);
              setUnfollowMsg(true);
              setTimeout(() => setUnfollowMsg(false), 2000);
            }}>
              <Text style={styles.modalBtnText}>Yes, Unfollow & Unstake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowUnfollow(false)}>
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {/* Follow Modal */}
      <Modal visible={followModal} transparent animationType="fade" onRequestClose={() => setFollowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFollowModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Follow Options</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => { setFollowModal(false); setStakeModal(true); }}>
              <Text style={styles.modalBtnText}>Stake & Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => { setFollowModal(false); setIsFollowing(true); }}>
              <Text style={styles.modalBtnText}>Just Follow</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {/* Stake Modal */}
      <Modal visible={stakeModal} transparent animationType="fade" onRequestClose={() => setStakeModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setStakeModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Stake Amount</Text>
            <View style={styles.stakeInputRow}>
              <Text style={{ color: Colors.dark.text, fontSize: 16, marginRight: 8 }}>Amount:</Text>
              <TextInput
                style={styles.stakeInput}
                placeholder="e.g. 2.5 SOL"
                placeholderTextColor={Colors.dark.text}
                value={stakeAmount}
                onChangeText={setStakeAmount}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.modalBtn} onPress={handleConfirmStake}>
              <Text style={styles.modalBtnText}>Confirm</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    marginTop: 16,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    color: Colors.dark.icon,
    fontSize: 16,
    marginBottom: 16,
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
  postImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },
  followBtn: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  followBtnText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  congratsBar: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    backgroundColor: Colors.dark.tint,
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 24,
    zIndex: 100,
    elevation: 10,
  },
  congratsText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23243a',
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    borderRadius: 18,
    padding: 28,
    minWidth: 280,
    alignItems: 'center',
  },
  modalTitle: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  modalBtn: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 14,
    width: 200,
    alignItems: 'center',
    shadowColor: Colors.dark.background,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  modalBtnText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  stakeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  stakeInput: {
    backgroundColor: '#18192b',
    color: Colors.dark.text,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    minWidth: 100,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
}); 