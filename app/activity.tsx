import { Colors } from '@/constants/Colors';
import { db } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ActivityScreen() {
  const router = useRouter();
  const [activities, setActivities] = React.useState<any[]>([]);
  React.useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      <FlatList
        data={activities}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Ionicons name={item.icon} size={22} color={Colors.dark.tint} style={styles.activityIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>{item.text}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: Colors.dark.icon, textAlign: 'center', marginTop: 40 }}>No recent activity.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: Colors.dark.tint,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23243a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  activityIcon: {
    marginRight: 16,
  },
  activityText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  activityTime: {
    color: Colors.dark.icon,
    fontSize: 13,
    marginTop: 2,
  },
}); 