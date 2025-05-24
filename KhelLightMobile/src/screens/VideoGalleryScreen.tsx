import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  Discover: undefined;
  VideoGallery: { timeSlotId: string };
  VideoPlayer: { videoUrl: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type VideoGalleryRouteProp = RouteProp<RootStackParamList, 'VideoGallery'>;

type Video = {
  id: string;
  cloudinary_url: string;
  captured_at: string;
  duration: number;
};

export default function VideoGalleryScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'VideoGallery'>>();
  const navigation = useNavigation<NavigationProp>();
  const { timeSlotId } = route.params;
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos from backend API instead of Supabase directly
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8002/api/videos/time-slot/${timeSlotId}`);
        const json = await response.json();
        if (json.success) {
          setVideos(json.data || []);
        } else {
          Alert.alert('Error', json.error || 'Failed to fetch videos');
        }
      } catch (error) {
        Alert.alert('Error', 'Could not connect to backend API');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [timeSlotId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#8B61C2" style={{ flex: 1, marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#8B61C2" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Highlights</Text>
      {videos.length === 0 ? (
        <Text style={styles.noVideos}>No highlights found for this time slot.</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.videoCard}>
              <TouchableOpacity onPress={() => navigation.navigate('VideoPlayer', { videoUrl: item.cloudinary_url })}>
                <Image source={{ uri: item.cloudinary_url }} style={styles.thumbnail} />
              </TouchableOpacity>
              <View style={styles.info}>
                <Text style={styles.caption}>Captured: {new Date(item.captured_at).toLocaleString()}</Text>
                <Text style={styles.caption}>Duration: {item.duration} sec</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 50, // For iPhone notch
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B61C2',
    marginBottom: 20,
  },
  noVideos: {
    fontSize: 18,
    color: '#888',
    marginTop: 40,
    textAlign: 'center',
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    width: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  caption: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
});
