import { Colors } from '@/constants/Colors';
import { db } from '@/lib/firebase';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../context/UserContext';

const demoUsers = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  { id: 'g1', name: 'Crypto Group' },
  { id: 'g2', name: 'Solana Fans' },
];

// Move postsData to a global mutable array for demo mode
export const demoPosts = [
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
  // Additional demo posts for testing
  {
    id: '6',
    user: 'frank',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    image: 'https://images.unsplash.com/photo-1465101053361-7630c1c47054',
    text: 'Crypto is the future!',
    likes: 10,
    comments: [
      { id: 'c5', user: 'alice', text: 'Absolutely!' },
    ],
  },
  {
    id: '7',
    user: 'grace',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    image: 'https://images.unsplash.com/photo-1465101060172-cd5f2a6b1b6a',
    text: 'Just finished a great book.',
    likes: 6,
    comments: [],
  },
  {
    id: '8',
    user: 'henry',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    image: 'https://images.unsplash.com/photo-1465101071231-2eec1d8d1b1a',
    text: 'Exploring new places.',
    likes: 9,
    comments: [
      { id: 'c6', user: 'bob', text: 'Where is this?' },
    ],
  },
  {
    id: '9',
    user: 'irene',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    image: 'https://images.unsplash.com/photo-1465101082342-2eec1d8d1b1a',
    text: 'Coffee time!',
    likes: 4,
    comments: [],
  },
  {
    id: '10',
    user: 'jack',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    image: 'https://images.unsplash.com/photo-1465101093453-2eec1d8d1b1a',
    text: 'Working on a new project.',
    likes: 11,
    comments: [
      { id: 'c7', user: 'carol', text: 'Good luck!' },
    ],
  },
  {
    id: '11',
    user: 'kate',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    image: 'https://images.unsplash.com/photo-1465101104564-2eec1d8d1b1a',
    text: 'Sunshine and smiles.',
    likes: 13,
    comments: [],
  },
  {
    id: '12',
    user: 'leo',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    image: 'https://images.unsplash.com/photo-1465101115675-2eec1d8d1b1a',
    text: 'Blockchain rocks!',
    likes: 15,
    comments: [
      { id: 'c8', user: 'frank', text: 'Preach!' },
    ],
  },
  {
    id: '13',
    user: 'mia',
    avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
    image: 'https://images.unsplash.com/photo-1465101126786-2eec1d8d1b1a',
    text: 'Just launched my NFT collection! 🚀',
    likes: 18,
    comments: [
      { id: 'c9', user: 'leo', text: 'Congrats!' },
      { id: 'c10', user: 'alice', text: 'Link?' },
    ],
  },
  {
    id: '14',
    user: 'nina',
    avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
    image: 'https://images.unsplash.com/photo-1465101137897-2eec1d8d1b1a',
    text: 'Solana hackathon was amazing! #web3',
    likes: 7,
    comments: [],
  },
  {
    id: '15',
    user: 'oliver',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    image: 'https://images.unsplash.com/photo-1465101148908-2eec1d8d1b1a',
    text: 'Who else is staking today?',
    likes: 4,
    comments: [
      { id: 'c11', user: 'mia', text: 'Me!' },
    ],
  },
  {
    id: '16',
    user: 'paula',
    avatar: 'https://randomuser.me/api/portraits/women/16.jpg',
    image: 'https://images.unsplash.com/photo-1465101159019-2eec1d8d1b1a',
    text: 'Art, coffee, and code.',
    likes: 9,
    comments: [],
  },
  {
    id: '17',
    user: 'quentin',
    avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
    image: 'https://images.unsplash.com/photo-1465101160120-2eec1d8d1b1a',
    text: 'Just joined Clovia! Excited to connect.',
    likes: 2,
    comments: [
      { id: 'c12', user: 'bob', text: 'Welcome!' },
    ],
  },
];

type Post = typeof demoPosts[number];

type Comment = { id: string; user: string; text: string };

const SCREEN_WIDTH = Dimensions.get('window').width;

const demoStories = [
  { id: 'me', user: 'You', avatar: 'https://randomuser.me/api/portraits/men/99.jpg', image: '', isMe: true },
  { id: 's1', user: 'alice', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: 's2', user: 'bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: 's3', user: 'carol', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308' },
  { id: 's4', user: 'dave', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429' },
  { id: 's5', user: 'eve', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99' },
  { id: 's6', user: 'mia', avatar: 'https://randomuser.me/api/portraits/women/13.jpg', image: 'https://images.unsplash.com/photo-1465101126786-2eec1d8d1b1a' },
  { id: 's7', user: 'oliver', avatar: 'https://randomuser.me/api/portraits/men/15.jpg', image: 'https://images.unsplash.com/photo-1465101148908-2eec1d8d1b1a' },
  { id: 's8', user: 'paula', avatar: 'https://randomuser.me/api/portraits/women/16.jpg', image: 'https://images.unsplash.com/photo-1465101159019-2eec1d8d1b1a' },
];

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Add PostImage component for fallback
function PostImage({ uri, style }: { uri: string; style: any }) {
  const [error, setError] = useState(false);
  // Use a local placeholder image; make sure it exists in assets/images
  return (
    <Image
      source={error ? require('../../assets/images/placeholder.png') : { uri }}
      style={style}
      onError={() => setError(true)}
    />
  );
}

const DEMO_MODE = true;

function getSortedDemoPosts() {
  // Sort demoPosts so demo-... posts (your new ones) appear first, then by id descending
  return [...demoPosts].sort((a, b) => {
    // If both are demo posts, sort by timestamp in id
    if (a.id.startsWith('demo-') && b.id.startsWith('demo-')) {
      return parseInt(b.id.replace('demo-', '')) - parseInt(a.id.replace('demo-', ''));
    }
    // If only a is demo, a comes first
    if (a.id.startsWith('demo-')) return -1;
    // If only b is demo, b comes first
    if (b.id.startsWith('demo-')) return 1;
    // Otherwise, sort by numeric id descending
    return parseInt(b.id) - parseInt(a.id);
  });
}

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likeAnims, setLikeAnims] = useState<Animated.Value[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const lastTaps = useRef<(number | null)[]>(demoPosts.map(() => null));
  const [commentModal, setCommentModal] = useState<{ visible: boolean; postIndex: number | null }>({ visible: false, postIndex: null });
  const [shareModal, setShareModal] = useState<{ visible: boolean; postIndex: number | null }>({ visible: false, postIndex: null });
  const [messageModal, setMessageModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedShare, setSelectedShare] = useState<string[]>([]);
  const [storyModal, setStoryModal] = useState<{ visible: boolean; storyIndex: number | null }>({ visible: false, storyIndex: null });
  const [storyPostModal, setStoryPostModal] = useState(false);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [storyCaption, setStoryCaption] = useState('');
  const router = useRouter();
  const feedListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { profilePic } = useUser();
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

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

  const handleYourStory = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setStoryImage(result.assets[0].uri);
      setStoryPostModal(true);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    // Also remove from demoPosts
    const idx = demoPosts.findIndex(p => p.id === postId);
    if (idx !== -1) demoPosts.splice(idx, 1);
    // Navigate to profile with refresh param
    router.push({ pathname: '/profile', params: { refresh: Date.now().toString() } });
  };

  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    const onImagePress = () => {
      const now = Date.now();
      if (lastTaps.current[index] && (now - lastTaps.current[index]!) < 300) {
        handleDoubleTap(index);
      }
      lastTaps.current[index] = now;
    };
    const avatarUri = item.user === 'you' ? profilePic : item.avatar;
    const isHighlighted = item.id === highlightedPostId;
    return (
      <View style={[styles.card, isHighlighted && { backgroundColor: '#ffe066' }]}>
        {/* Show delete button for user's own posts */}
        {item.user === 'you' && (
          <TouchableOpacity
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
            onPress={() => {
              Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDeletePost(item.id) },
              ]);
            }}
          >
            <Ionicons name="trash-outline" size={22} color="#ff3b5c" />
          </TouchableOpacity>
        )}
        <View style={styles.cardHeader}>
          <PostImage uri={avatarUri} style={styles.avatar} />
          <Text style={styles.user}>{item.user}</Text>
        </View>
        {/* Only render image if present */}
        {item.image && typeof item.image === 'string' && item.image.trim() !== '' && (
          <TouchableOpacity activeOpacity={0.8} onPress={onImagePress} style={{ position: 'relative' }}>
            <PostImage
              uri={item.image}
              style={styles.image}
            />
            <Animated.View style={[styles.heartOverlay, { opacity: likeAnims[index], transform: [{ scale: likeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }] }] }>
              <Ionicons name="heart" size={90} color="#ff3b5c" />
            </Animated.View>
          </TouchableOpacity>
        )}
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
    { id: 'chat3', name: 'Mia', last: 'Did you see the NFT drop?' },
    { id: 'chat4', name: 'Nina', last: 'Ready for the hackathon?' },
    { id: 'chat5', name: 'Oliver', last: 'Staking is live!' },
    { id: 'group2', name: 'Solana Artists', last: 'Art contest results posted.' },
    { id: 'chat6', name: 'Paula', last: 'Coffee later?' },
    { id: 'chat7', name: 'Quentin', last: 'Just joined Clovia!' },
  ];

  useEffect(() => {
    // @ts-ignore: 'tabPress' is a valid event for tab navigation
    const unsubscribe = (navigation as any).addListener('tabPress', () => {
      if (feedListRef.current) {
        feedListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (DEMO_MODE) {
      setPosts(getSortedDemoPosts());
    }
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestorePosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      if (firestorePosts.length === 0) {
        setPosts([...demoPosts]);
      } else {
        setPosts(firestorePosts);
      }
    });
    return unsubscribe;
  }, []);

  // Add meme to feed if coming from meme-generator
  useEffect(() => {
    if (params.newMeme && typeof params.newMeme === 'string') {
      const meme = JSON.parse(params.newMeme);
      setPosts(prev => [
        {
          id: `meme-${Date.now()}`,
          user: 'you',
          avatar: 'https://randomuser.me/api/portraits/men/99.jpg',
          image: meme.image,
          text: meme.topText + (meme.bottomText ? ('\n' + meme.bottomText) : ''),
          likes: 0,
          comments: [],
        },
        ...prev,
      ]);
      setLikeAnims(prev => [new Animated.Value(0), ...prev]);
      setLiked(prev => [false, ...prev]);
    }
  }, [params.newMeme]);

  // Keep likeAnims and liked in sync with posts
  useEffect(() => {
    if (posts.length !== likeAnims.length) {
      setLikeAnims(posts.map(() => new Animated.Value(0)));
    }
    if (posts.length !== liked.length) {
      setLiked(posts.map(() => false));
    }
  }, [posts]);

  // Scroll to post if postId param is present
  useEffect(() => {
    if (params.postId && posts.length > 0) {
      const index = posts.findIndex(p => p.id === params.postId);
      if (index !== -1 && feedListRef.current) {
        feedListRef.current.scrollToIndex({ index, animated: true });
        setHighlightedPostId(params.postId as string);
        setTimeout(() => setHighlightedPostId(null), 1200); // Remove highlight after 1.2s
      }
    }
  }, [params.postId, posts]);

  const renderAppName = () => (
    <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../assets/images/icon.png')} style={{ width: 36, height: 36, borderRadius: 8, marginRight: 10 }} />
        <Text style={{ color: Colors.dark.tint, fontSize: 22, fontWeight: '600', letterSpacing: 1.2, fontFamily: 'cursive' }}>Clovia</Text>
      </View>
    </View>
  );

  const renderStories = () => (
    <View style={styles.storiesContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, marginRight: 8 }}>
        <View />
        <TouchableOpacity style={{ padding: 6 }} onPress={() => router.push('/messages')}>
          <Ionicons name="paper-plane-outline" size={28} color={Colors.dark.tint} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={stories}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          item.isMe ? (
            <TouchableOpacity style={styles.storyItem} onPress={() => router.push('/post-story')}>
              <View style={styles.myStoryBubble}>
                <LinearGradient
                  colors={["#aba0f1", "#a4508b", "#5f0a87"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.storyGradientRing}
                >
                  <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
                </LinearGradient>
                <View style={styles.plusBubble}>
                  <Ionicons name="add" size={18} color="#000" />
                </View>
              </View>
              <Text style={styles.storyUser}>Your Story</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.storyItem} onPress={() => setStoryModal({ visible: true, storyIndex: index })}>
              <LinearGradient
                colors={["#aba0f1", "#a4508b", "#5f0a87"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.storyGradientRing}
              >
                <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
              </LinearGradient>
              <Text style={styles.storyUser}>{item.user}</Text>
            </TouchableOpacity>
          )
        )}
      />
    </View>
  );

  // Update demoStories to use profilePic for 'me'
  const stories = [
    { id: 'me', user: 'You', avatar: profilePic, image: '', isMe: true },
    ...demoStories.slice(1),
  ];

  return (
    <View style={styles.container}>
      <FlatList
        ref={feedListRef}
        data={likeAnims.length === posts.length && liked.length === posts.length ? posts : []}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <>
            {renderAppName()}
            {renderStories()}
          </>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
      {/* Story Post Modal (Instagram-like UI) */}
      <Modal visible={storyPostModal && !!storyImage} transparent animationType="fade" onRequestClose={() => { setStoryPostModal(false); setStoryImage(null); setStoryCaption(''); }}>
        <Pressable style={styles.storyModalOverlay} onPress={() => { setStoryPostModal(false); setStoryImage(null); setStoryCaption(''); }}>
          <View style={[styles.storyModalContent, { backgroundColor: '#18192b', borderRadius: 18, padding: 0, overflow: 'hidden' }]}> 
            {storyImage && (
              <Image source={{ uri: storyImage }} style={{ width: '100%', height: 400, resizeMode: 'cover' }} />
            )}
            <View style={{ padding: 16, width: '100%' }}>
              <TextInput
                style={{ color: '#fff', fontSize: 18, backgroundColor: '#23243a', borderRadius: 10, padding: 10, marginBottom: 12 }}
                placeholder="Add a caption..."
                placeholderTextColor="#aaa"
                value={storyCaption}
                onChangeText={setStoryCaption}
                maxLength={100}
              />
              <TouchableOpacity
                style={{ backgroundColor: Colors.dark.tint, borderRadius: 10, padding: 14, alignItems: 'center' }}
                onPress={() => { setStoryPostModal(false); setStoryImage(null); setStoryCaption(''); alert('Story shared! (Demo)'); }}
              >
                <Text style={{ color: Colors.dark.background, fontWeight: 'bold', fontSize: 16 }}>Share to Story</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      {/* Story Modal */}
      <Modal visible={storyModal.visible} transparent animationType="fade" onRequestClose={() => setStoryModal({ visible: false, storyIndex: null })}>
        <Pressable style={styles.storyModalOverlay} onPress={() => setStoryModal({ visible: false, storyIndex: null })}>
          <View style={styles.storyModalContent}>
            {storyModal.storyIndex !== null && (
              <Image source={{ uri: stories[storyModal.storyIndex].image }} style={styles.storyImage} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 0,
    paddingTop: 24,
  },
  card: {
    backgroundColor: '#2d2e4a',
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
  myStoryBubble: {
    position: 'relative',
  },
  plusBubble: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  storyGradientRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
}); 