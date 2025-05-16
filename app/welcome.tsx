import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { connectPhantomWallet } from '../lib/phantom';
import { PremiumText } from './_layout';

const { width } = Dimensions.get('window');

export const options = {
  headerShown: false,
};

export default function WelcomeScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { walletAddress, setWalletAddress } = useWallet();
  const [connecting, setConnecting] = React.useState(false);

  React.useEffect(() => {
    if (walletAddress) {
      router.replace('/feed');
    }
  }, [walletAddress]);

  // Animation for arrow
  const arrowTranslate = useSharedValue(0);
  React.useEffect(() => {
    arrowTranslate.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);
  const arrowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowTranslate.value }],
  }));

  const handleConnectWallet = async () => {
    setConnecting(true);
    await connectPhantomWallet((publicKey) => {
      setWalletAddress(publicKey);
      setConnecting(false);
    });
  };

  const handleSkip = () => {
    // login();
    router.replace('/feed');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Skip button at top right */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <PremiumText style={styles.skipBtnText}>Skip</PremiumText>
      </TouchableOpacity>
      <Swiper
        loop={false}
        showsPagination
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={{ bottom: 40 }}
      >
        {/* Slide 1: Welcome */}
        <View style={styles.slide}>
          <Image source={require('../assets/images/icon.png')} style={styles.logo} />
          <PremiumText style={styles.appName}>Clovia</PremiumText>
          <PremiumText style={styles.welcomeText}>Welcome to Clovia!</PremiumText>
          <PremiumText style={styles.descText}>A premium, secure, and social Web3 experience.</PremiumText>
          {/* Animated right arrow indicator for more slides */}
          <Animated.View style={[styles.arrowContainer, arrowAnimStyle]}>
            <Ionicons name="arrow-forward" size={28} color={Colors.dark.tint} />
          </Animated.View>
        </View>
        {/* Slide 2: Mission & Vision */}
        <View style={styles.slide}>
          <PremiumText style={styles.slideTitle}>Our Mission</PremiumText>
          <PremiumText style={styles.slideText}>
            To turn everyday social media engagement into meaningful financial participation—empowering users to earn while they connect, follow, and engage.
          </PremiumText>
          <PremiumText style={styles.slideTitle}>Our Vision</PremiumText>
          <PremiumText style={styles.slideText}>
            To redefine the global social experience by merging entertainment with DeFi, becoming the leading platform for social staking and creator-backed economies on Solana.
          </PremiumText>
        </View>
        
        {/* Slide 3: Connect Wallet */}
        <View style={styles.slide}>
          <PremiumText style={styles.slideTitle}>Get Started</PremiumText>
          <PremiumText style={styles.slideText}>
            Connect your wallet to unlock the full Clovia experience.
          </PremiumText>
          <TouchableOpacity style={styles.walletBtn} onPress={handleConnectWallet} disabled={connecting}>
            <Ionicons name="wallet-outline" size={22} color={Colors.dark.background} style={{ marginRight: 10 }} />
            <PremiumText style={styles.walletBtnText}>{connecting ? 'Connecting...' : (walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet')}</PremiumText>
          </TouchableOpacity>
        </View>
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 18,
    marginTop: -40,
  },
  appName: {
    fontFamily: 'cursive',
    fontSize: 38,
    color: Colors.dark.tint,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 2,
  },
  welcomeText: {
    color: Colors.dark.tint,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  slideTitle: {
    color: Colors.dark.tint,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  slideText: {
    color: Colors.dark.text,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 24,
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.tint,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  walletBtnText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.1,
  },
  dot: {
    backgroundColor: Colors.dark.icon,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: Colors.dark.tint,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 6,
  },
  skipBtn: {
    position: 'absolute',
    top: 44,
    right: 24,
    zIndex: 10,
    backgroundColor: '#23243aee',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  skipBtnText: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.1,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 70,
    right: 36,
    backgroundColor: '#23243acc',
    borderRadius: 20,
    padding: 6,
    zIndex: 20,
    elevation: 10,
  },
}); 