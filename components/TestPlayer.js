import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import React, {useEffect} from 'react';

// const tracks = [
//   {
//     id: 1,
//     url: require('../assets/songs/outside.mp3'),
//     title: 'Outside',
//   },
// ];
const tracks = [
  {
    id: 1,
    url: 'http://cast.uncuartocomunicacion.com:8020/live',
    title: 'Outside',
  },
];

TrackPlayer.updateOptions({
  stopWithApp: false,
  capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
  compactCapabilities: [
    TrackPlayer.CAPABILITY_PLAY,
    TrackPlayer.CAPABILITY_PAUSE,
  ],
});

export default function TestPlayer() {
  const setUpTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(tracks);
    } catch (error) {
      console.log('ERROR', error);
    }
  };
  useEffect(() => {
    setUpTrackPlayer();
    return () => TrackPlayer.destroy();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={() => TrackPlayer.pause()}>
        <Text style={styles.btnText}>Pause</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => TrackPlayer.play()}>
        <Text style={styles.btnText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => TrackPlayer.skipToPrevious()}>
        <Text style={styles.btnText}>Prev</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => TrackPlayer.skipToNext()}>
        <Text style={styles.btnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'yellow',
    width: 200,
    height: 50,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
