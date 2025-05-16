import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export default function PhantomTxHandler() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.signature) {
      Alert.alert('Staking Success', 'Your stake transaction was sent!');
      router.replace('/finances');
    } else {
      Alert.alert('Staking Failed', 'No signature returned.');
      router.replace('/welcome');
    }
  }, [params]);

  return null;
} 