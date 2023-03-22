import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

// packages
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  useProgress,
} from 'react-native-track-player';

// constants
import {songs} from '../model/data';

// states
const {width} = Dimensions.get('window');

// initial player setup
const playerSetUp = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(songs);
  } catch (error) {
    console.log('ERROR', error);
  }
};

// when click play-pause button
const togglePlayPause = async playbackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack !== null) {
    if (playbackState == State.Paused || playbackState == 1) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

export default function MusicPlayer() {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);
  const [songIndex, setSongIndex] = useState(0);
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackTitle, setTrackTitle] = useState();

  // changing the track when the song end automaticaly
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    // automatic song changing when track end
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      setTrackArtwork(artwork);
      setTrackArtist(artist);
      setTrackTitle(title);

      // autoplay
      if (playbackState == State.Paused || playbackState == 1 || 6) {
        await TrackPlayer.play();
      }
    }
  });

  // song index for which index we want ,when we click prev/next button
  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    playerSetUp();

    // get the index value
    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);
      skipTo(index);
      setSongIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  // when click prev
  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  // when click next
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
          <Image
            source={
              trackArtwork
                ? trackArtwork
                : require('../assets/images/default.png')
            }
            style={styles.artwork}
          />
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
          <Text style={styles.title}>{trackTitle}</Text>
          <Text style={styles.artist}>{trackArtist}</Text>
        </View>
        <View>
          <Slider
            style={styles.progressContainer}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#1DB954"
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />
        </View>
        <View style={styles.progressLbaelContainer}>
          <Text style={styles.progressLabelText}>
            {new Date(progress.position * 1000)
              .toLocaleTimeString()
              .substring(4)}
          </Text>
          <Text style={styles.progressLabelText}>
            {new Date((progress.duration - progress.position) * 1000)
              .toLocaleTimeString()
              .substring(4)}
          </Text>
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons name="play-skip-back-outline" size={30} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayPause(playbackState)}>
            <Ionicons
              name={
                playbackState === State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={48}
              color="#1DB954"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={30}
              color="#1DB954"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={30} color="#1DB954" />
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
    backgroundColor: '#fff',
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
