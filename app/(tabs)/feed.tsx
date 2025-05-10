import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const demoUsers = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  { id: 'g1', name: 'Crypto Group' },
  { id: 'g2', name: 'Solana Fans' },
];

const postsData = [
  {
    id: '1',
    user: 'alice',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    text: 'Hello from the Phantom-inspired feed!',
    likes: 12,
    comments: [
      { id: 'c1', user: 'bob', text: 'Nice post!' },
      { id: 'c2', user: 'carol', text: 'Love this!' },
    ],
  },
  {
    id: '2',
    user: 'bob',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    text: 'Loving this new app design.',
    likes: 8,
    comments: [
      { id: 'c3', user: 'alice', text: 'So cool!' },
    ],
  },
  {
    id: '3',
    user: 'carol',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    text: 'Check out this awesome view!',
    likes: 5,
    comments: [],
  },
  {
    id: '4',
    user: 'dave',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    text: 'Enjoying the sunset.',
    likes: 3,
    comments: [
      { id: 'c4', user: 'eve', text: 'Beautiful!' },
    ],
  },
  {
    id: '5',
    user: 'eve',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
    text: 'Nature is beautiful.',
    likes: 7,
    comments: [],
  },
];

type Post = typeof postsData[number];

type Comment = { id: string; user: string; text: string };

const SCREEN_WIDTH = Dimensions.get('window').width;

const demoStories = [
  { id: 's1', user: 'alice', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: 's2', user: 'bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: 's3', user: 'carol', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
  { id: 's4', user: 'dave', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429' },
  { id: 's5', user: 'eve', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99' },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState(postsData);
  const [likeAnims, setLikeAnims] = useState(postsData.map(() => new Animated.Value(0)));
  const [liked, setLiked] = useState(postsData.map(() => false));
  const lastTaps = useRef<(number | null)[]>(postsData.map(() => null));
  const [commentModal, setCommentModal] = useState<{ visible: boolean; postIndex: number | null }>({ visible: false, postIndex: null });
  const [shareModal, setShareModal] = useState<{ visible: boolean; postIndex: number | null }>({ visible: false, postIndex: null });
  const [messageModal, setMessageModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedShare, setSelectedShare] = useState<string[]>([]);
  const [storyModal, setStoryModal] = useState<{ visible: boolean; storyIndex: number | null }>({ visible: false, storyIndex: null });
  const router = useRouter();
  const panRef = useRef(null);

  const handleDoubleTap = (index: number) => {
    Animated.sequence([
      Animated.timing(likeAnims[index], { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(likeAnims[index], { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    setPosts((prev) => prev.map((p, i) => i === index ? { ...p, likes: liked[index] ? p.likes : p.likes + 1 } : p));
    setLiked((prev) => prev.map((l, i) => i === index ? true : l));
  };

  const handleLike = (index: number) => {
    setLiked((prev) => prev.map((l, i) => i === index ? !l : l));
    setPosts((prev) => prev.map((p, i) => {
      if (i === index) {
        if (liked[index]) {
          return { ...p, likes: Math.max(0, p.likes - 1) };
        } else {
          return { ...p, likes: p.likes + 1 };
        }
      }
      return p;
    }));
  };

  const handleAddComment = () => {
    if (commentModal.postIndex === null || !newComment.trim()) return;
    setPosts((prev) => prev.map((p, i) =>
      i === commentModal.postIndex
        ? { ...p, comments: [...p.comments, { id: `c${Date.now()}`, user: 'you', text: newComment }] }
        : p
    ));
    setNewComment('');
  };

  const handleShare = () => {
    setShareModal({ visible: false, postIndex: null });
    setSelectedShare([]);
  };

  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    const onImagePress = () => {
      const now = Date.now();
      if (lastTaps.current[index] && (now - lastTaps.current[index]!) < 300) {
        handleDoubleTap(index);
      }
      lastTaps.current[index] = now;
    };
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.user}>{item.user}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={onImagePress} style={{ position: 'relative' }}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Animated.View style={[styles.heartOverlay, { opacity: likeAnims[index], transform: [{ scale: likeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }] }] }>
            <Ionicons name="heart" size={90} color="#ff3b5c" />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => handleLike(index)}>
            <Ionicons name={liked[index] ? 'heart' : 'heart-outline'} size={28} color={liked[index] ? '#ff3b5c' : Colors.dark.tint} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 18 }} onPress={() => setCommentModal({ visible: true, postIndex: index })}>
            <Ionicons name="chatbubble-outline" size={26} color={Colors.dark.tint} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 18 }} onPress={() => setShareModal({ visible: true, postIndex: index })}>
            <Ionicons name="paper-plane-outline" size={26} color={Colors.dark.tint} />
          </TouchableOpacity>
          <Text style={styles.likes}>{item.likes} likes</Text>
        </View>
        {/* Recent comments preview */}
        {item.comments.length > 0 && (
          <View style={styles.commentsPreview}>
            {item.comments.slice(-2).map((c) => (
              <Text key={c.id} style={styles.commentText}><Text style={{ color: Colors.dark.tint }}>{c.user}:</Text> {c.text}</Text>
            ))}
          </View>
        )}
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  // Demo messages/groups
  const demoChats = [
    { id: 'chat1', name: 'Alice', last: 'Hey there!' },
    { id: 'chat2', name: 'Bob', last: "Let's catch up." },
    { id: 'group1', name: 'Crypto Group', last: 'New event soon!' },
  ];

  const handleGesture = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationX < -80 && event.nativeEvent.state === State.END) {
      router.push('/(tabs)/messages');
    }
  };

  return (
    <PanGestureHandler ref={panRef} onHandlerStateChange={handleGesture}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/icon.png')} style={styles.appIcon} />
          <Text style={styles.headerTitle}>Clovia</Text>
          <TouchableOpacity style={styles.messageIcon} onPress={() => router.push('/(tabs)/messages')}>
            <Ionicons name="paper-plane-outline" size={28} color={Colors.dark.tint} />
          </TouchableOpacity>
        </View>
        {/* Stories Section */}
        <View style={styles.storiesContainer}>
          <FlatList
            data={demoStories}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.storyItem} onPress={() => setStoryModal({ visible: true, storyIndex: index })}>
                <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
                <Text style={styles.storyUser}>{item.user}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {/* End Stories Section */}
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        {/* Story Modal */}
        <Modal visible={storyModal.visible} transparent animationType="fade" onRequestClose={() => setStoryModal({ visible: false, storyIndex: null })}>
          <Pressable style={styles.storyModalOverlay} onPress={() => setStoryModal({ visible: false, storyIndex: null })}>
            <View style={styles.storyModalContent}>
              {storyModal.storyIndex !== null && (
                <Image source={{ uri: demoStories[storyModal.storyIndex].image }} style={styles.storyImage} />
              )}
            </View>
          </Pressable>
        </Modal>
        {/* Comments Modal */}
        <Modal visible={commentModal.visible} transparent animationType="slide" onRequestClose={() => setCommentModal({ visible: false, postIndex: null })}>
          <Pressable style={styles.modalOverlay} onPress={() => setCommentModal({ visible: false, postIndex: null })}>
            <View style={styles.commentModal}>
              <Text style={styles.modalTitle}>Comments</Text>
              <View style={{ flex: 1 }}>
                <FlatList
                  data={commentModal.postIndex !== null ? posts[commentModal.postIndex].comments : []}
                  keyExtractor={c => c.id}
                  renderItem={({ item }) => (
                    <Text style={styles.commentText}><Text style={{ color: Colors.dark.tint }}>{item.user}:</Text> {item.text}</Text>
                  )}
                  ListEmptyComponent={<Text style={{ color: Colors.dark.icon, textAlign: 'center', marginTop: 20 }}>No comments yet.</Text>}
                />
              </View>
              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor={Colors.dark.icon}
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
                  <Ionicons name="send" size={22} color={Colors.dark.tint} />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
        {/* Share Modal */}
        <Modal visible={shareModal.visible} transparent animationType="slide" onRequestClose={() => setShareModal({ visible: false, postIndex: null })}>
          <Pressable style={styles.modalOverlay} onPress={() => setShareModal({ visible: false, postIndex: null })}>
            <View style={styles.shareModal}>
              <Text style={styles.modalTitle}>Share to...</Text>
              <FlatList
                data={demoUsers}
                keyExtractor={u => u.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.shareUser, selectedShare.includes(item.id) && { backgroundColor: Colors.dark.icon }]}
                    onPress={() => setSelectedShare((prev) => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                  >
                    <Text style={styles.shareUserText}>{item.name}</Text>
                    {selectedShare.includes(item.id) && <Ionicons name="checkmark-circle" size={22} color={Colors.dark.tint} />}
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
        {/* Messages Modal */}
        <Modal visible={messageModal} transparent animationType="slide" onRequestClose={() => setMessageModal(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setMessageModal(false)}>
            <View style={styles.messagesModal}>
              <Text style={styles.modalTitle}>Messages</Text>
              <FlatList
                data={demoChats}
                keyExtractor={c => c.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.chatItem}>
                    <Ionicons name={item.id.startsWith('group') ? 'people-outline' : 'person-outline'} size={26} color={Colors.dark.tint} style={{ marginRight: 10 }} />
                    <View>
                      <Text style={styles.chatName}>{item.name}</Text>
                      <Text style={styles.chatLast}>{item.last}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </Modal>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: Colors.dark.background,
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
  },
  headerTitle: {
    color: Colors.dark.tint,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  messageIcon: {
    position: 'absolute',
    right: 24,
    top: 40,
  },
  card: {
    backgroundColor: '#23243a',
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  user: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 4,
    backgroundColor: '#1a1a2e',
  },
  heartOverlay: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 90,
    top: 60,
    zIndex: 10,
    pointerEvents: 'none',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 2,
  },
  likes: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 18,
  },
  commentsPreview: {
    marginBottom: 4,
    marginLeft: 4,
  },
  commentText: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 2,
  },
  text: {
    color: Colors.dark.text,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  commentModal: {
    backgroundColor: '#23243a',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    minWidth: 320,
    minHeight: 320,
    width: '100%',
    maxHeight: '60%',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#18192b',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  commentInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 15,
    padding: 10,
  },
  sendButton: {
    padding: 8,
  },
  shareModal: {
    backgroundColor: '#23243a',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    minWidth: 320,
    minHeight: 320,
    width: '100%',
    maxHeight: '60%',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  shareUser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  shareUserText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  shareButtonText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  messagesModal: {
    backgroundColor: '#23243a',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    minWidth: 320,
    minHeight: 320,
    width: '100%',
    maxHeight: '60%',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2e4a',
  },
  chatName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatLast: {
    color: Colors.dark.icon,
    fontSize: 14,
  },
  storiesContainer: {
    paddingVertical: 10,
    paddingLeft: 8,
    backgroundColor: Colors.dark.background,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff3b5c',
    marginBottom: 4,
  },
  storyUser: {
    color: Colors.dark.text,
    fontSize: 13,
    maxWidth: 60,
    textAlign: 'center',
  },
  storyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyModalContent: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'cover',
  },
}); 