import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useWallet } from '../context/WalletContext';

export default function PhantomConnectHandler() {
  const router = useRouter();
  const { setWalletAddress } = useWallet();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Debug: show all params in an alert
    Alert.alert('Phantom Callback Params', JSON.stringify(params));
    // Phantom will redirect with ?public_key=...
    if (params.public_key) {
      setWalletAddress(params.public_key as string);
      router.replace('/feed');
    } else {
      router.replace('/welcome');
    }
  }, [params]);

  return null; // Optionally, show a loading spinner
} 