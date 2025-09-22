
import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, interpolate, Extrapolate } from 'react-native-reanimated';
import { recipes as initialRecipes } from '../data/recipes';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const onSwipe = useCallback(() => {
    setRecipes(prevRecipes => prevRecipes.slice(1));
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = interpolate(event.translationX, [-screenWidth / 2, screenWidth / 2], [-15, 15], Extrapolate.CLAMP);
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > screenWidth / 3) {
        translateX.value = withSpring(event.translationX > 0 ? screenWidth * 2 : -screenWidth * 2, {}, () => {
          runOnJS(onSwipe)();
        });
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(Math.abs(translateX.value), [0, screenWidth / 2], [0.8, 1], Extrapolate.CLAMP),
        },
      ],
      opacity: interpolate(Math.abs(translateX.value), [0, screenWidth / 2], [0.5, 1], Extrapolate.CLAMP),
    };
  });

  if (recipes.length === 0) {
    return <View style={styles.container}><Text>No more recipes</Text></View>;
  }

  return (
    <View style={styles.container}>
      {recipes.length > 1 && (
        <Animated.View style={[styles.card, styles.nextCard, nextCardStyle]}>
          <Image source={{ uri: recipes[1].photo_url }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{recipes[1].name}</Text>
          </View>
        </Animated.View>
      )}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Image source={{ uri: recipes[0].photo_url }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{recipes[0].name}</Text>
            <Text style={styles.description}>{recipes[0].description}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.difficulty}>{recipes[0].difficulty}</Text>
              <Text style={styles.rating}>{recipes[0].rating_avg} stars</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
  },
  nextCard: {
    zIndex: -1,
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  difficulty: {
    fontSize: 14,
    color: '#999',
  },
  rating: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;
