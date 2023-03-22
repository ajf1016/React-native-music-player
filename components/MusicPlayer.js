import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  onProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {songs} from '../model/data';
const {width, height} = Dimensions.get('window');

const playerSetUp = async () => {
  await TrackPlayer.setupPlayer();
  console.log('setuped');
  await TrackPlayer.add(songs);
};

const togglePlayPause = async playbackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log(currentTrack, 'CURR');
    if (currentTrack !== null) {

      console.log(State);
      if (playbackState == State.Paused) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
};

export default function MusicPlayer() {
  const playbackState = usePlaybackState();
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);
  const [songIndex, setSongIndex] = useState(0);
  useEffect(() => {
    playerSetUp();
    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);
      setSongIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };
  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const renderSongs = ({index, item}) => {
    return (
      <Animated.View
        style={{
          width: width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.artworkWrapper}>
          <Image source={item.image} style={styles.artwork} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={{width: width}}>
          <Animated.FlatList
            ref={songSlider}
            data={songs}
            renderItem={renderSongs}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={100}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x: scrollX},
                  },
                },
              ],
              {useNativeDriver: true},
            )}
          />
        </View>
        <View>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>
        <View>
          <Slider
            style={styles.progressContainer}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#D61C4E"
            minimumTrackTintColor="#D61C4E"
            maximumTrackTintColor="#fff"
            onSlidingComplete={() => {}}
          />
        </View>
        <View style={styles.progressLbaelContainer}>
          <Text style={styles.progressLabelText}>0:00</Text>
          <Text style={styles.progressLabelText}>0:00</Text>
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons name="play-skip-back-outline" size={30} color="#D61C4E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayPause(playbackState)}>
            <Ionicons name="ios-play-circle" size={48} color="#D61C4E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={30}
              color="#D61C4E"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#D61C4E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#D61C4E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#D61C4E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={30} color="#D61C4E" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3333',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    borderTopColor: '#393E46',
    borderTopWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
    overflow: 'hidden',
    borderRadius: 15,
    elevation: 20,
  },
  artwork: {
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#eee',
  },
  artist: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: '#eee',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLbaelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '200',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 170,
    justifyContent: 'space-between',
  },
});
