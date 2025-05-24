import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  VideoPlayer: { videoUrl: string };
};

type VideoPlayerRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;

export default function VideoPlayerScreen() {
  const route = useRoute<VideoPlayerRouteProp>();
  const navigation = useNavigation();
  const { videoUrl } = route.params;
  const player = useVideoPlayer({ uri: videoUrl });

  if (!videoUrl) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>No video URL provided.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
        allowsFullscreen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: 0,
    zIndex: 10,
    paddingLeft: 10,
  },
  backButton: {
    padding: 8,
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.56, // 16:9 aspect ratio
    backgroundColor: '#000',
  },
});
