import { Colors } from '@/constants/Colors';
import { Connection, PublicKey } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useStaking } from '../../context/StakingContext';
import { useWallet } from '../../context/WalletContext';
import { connectPhantomWallet } from '../../lib/phantom';
import { PremiumText } from '../_layout';

export default function FinancesScreen() {
  const { walletAddress, setWalletAddress } = useWallet();
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]); // Replace any with real type if available
  const [loadingTx, setLoadingTx] = useState(false);
  const { staked } = useStaking();

  const handleConnectWallet = async () => {
    setConnecting(true);
    await connectPhantomWallet((publicKey) => {
      setWalletAddress(publicKey);
      setConnecting(false);
    });
  };

  // Floating animation for wallet icon
  const floatAnim = useSharedValue(0);
  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 900 }),
        withTiming(0, { duration: 900 })
      ),
      -1,
      true
    );
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  useEffect(() => {
    if (walletAddress) {
      setLoadingBalance(true);
      const connection = new Connection('https://api.devnet.solana.com');
      connection.getBalance(new PublicKey(walletAddress))
        .then(lamports => setBalance(lamports / 1e9))
        .catch(() => setBalance(null))
        .finally(() => setLoadingBalance(false));
      // Fetch SOL price in USD
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        .then(res => res.json())
        .then(data => setSolPrice(data.solana.usd))
        .catch(() => setSolPrice(null));
      // Fetch recent transactions (placeholder for now)
      setLoadingTx(true);
      connection.getConfirmedSignaturesForAddress2(new PublicKey(walletAddress), { limit: 5 })
        .then(sigs => setTransactions(sigs))
        .catch(() => setTransactions([]))
        .finally(() => setLoadingTx(false));
    } else {
      setBalance(null);
      setSolPrice(null);
      setTransactions([]);
    }
  }, [walletAddress]);

  return (
    <View style={styles.container}>
      {!walletAddress ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View style={[floatStyle, { marginBottom: 18 }]}> 
            <Ionicons name="wallet" size={54} color="#a4508b" />
          </Animated.View>
          <PremiumText style={{ color: Colors.dark.text, fontSize: 12, textAlign: 'center', marginBottom: 18, marginHorizontal: 12 }}>
            Connect your wallet to view your real-time Solana balance, portfolio value, and recent transactions securely in one place.
          </PremiumText>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.dark.tint,
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 38,
              alignItems: 'center',
              marginBottom: 18,
              opacity: connecting ? 0.7 : 1,
              borderWidth: 5,
              borderColor: '#a4508b', // shiny purple
              shadowColor: '#a4508b',
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleConnectWallet}
            disabled={connecting}
          >
            <PremiumText style={{ color: Colors.dark.background, fontWeight: 'bold', fontSize: 22, letterSpacing: 1 }}>
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </PremiumText>
            {connecting && (
              <ActivityIndicator color={Colors.dark.background} style={{ marginTop: 8 }} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.balanceCard}>
            <PremiumText style={styles.balanceLabel}>Wallet Balance</PremiumText>
            <PremiumText style={styles.balance}>
              {loadingBalance ? 'Loading...' : (balance !== null ? `${balance} SOL` : 'Error')}
            </PremiumText>
            {solPrice && balance !== null && (
              <PremiumText style={{ color: Colors.dark.text, fontSize: 18, marginTop: 6 }}>
                ≈ ${(balance * solPrice).toFixed(2)} USD
              </PremiumText>
            )}
          </View>
          {staked.length > 0 && (
            <View style={[styles.balanceCard, { marginBottom: 12, backgroundColor: '#2d2e4a' }]}> 
              <PremiumText style={[styles.balanceLabel, { marginBottom: 8 }]}>Staked</PremiumText>
              {staked.map((s, i) => (
                <PremiumText key={i} style={{ color: Colors.dark.tint, fontSize: 16, marginBottom: 2 }}>
                  {s.amount} SOL staked to <PremiumText style={{ color: '#a4508b', fontWeight: 'bold' }}>{s.username}</PremiumText>
                </PremiumText>
              ))}
            </View>
          )}
          <PremiumText style={styles.sectionTitle}>Recent Transactions</PremiumText>
          {loadingTx ? (
            <ActivityIndicator color={Colors.dark.tint} />
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={item => item.signature}
              renderItem={({ item }) => (
                <View style={styles.transactionCard}>
                  <PremiumText style={styles.transactionType}>Signature</PremiumText>
                  <PremiumText style={styles.transactionAmount} numberOfLines={1} ellipsizeMode="middle">{item.signature}</PremiumText>
                  <PremiumText style={styles.transactionDate}>{item.blockTime ? new Date(item.blockTime * 1000).toLocaleString() : ''}</PremiumText>
                </View>
              )}
              ListEmptyComponent={<PremiumText style={{ color: Colors.dark.icon }}>No recent transactions</PremiumText>}
            />
          )}
        </>
      )}
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
  balanceCard: {
    backgroundColor: '#23243a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceLabel: {
    color: Colors.dark.icon,
    fontSize: 16,
    marginBottom: 6,
  },
  balance: {
    color: Colors.dark.tint,
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.dark.tint,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: '#23243a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  transactionType: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionAmount: {
    color: Colors.dark.tint,
    fontSize: 16,
    marginTop: 2,
  },
  transactionDate: {
    color: Colors.dark.icon,
    fontSize: 13,
    marginTop: 2,
  },
}); 