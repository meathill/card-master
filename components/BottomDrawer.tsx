import { ReactNode, useImperativeHandle, forwardRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, SharedValue } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HANDLE_HEIGHT = 24;
const MIN_DRAWER_HEIGHT = 60;
const MAX_DRAWER_HEIGHT = SCREEN_HEIGHT * 0.55;

const TIMING_CONFIG = {
  duration: 250,
  easing: Easing.out(Easing.cubic),
};

export type BottomDrawerRef = {
  collapse: () => void;
  expand: () => void;
};

type Props = {
  children: ReactNode;
  progress: SharedValue<number>; // 外部传入的 shared value，0=展开, 1=收起
};

const BottomDrawer = forwardRef<BottomDrawerRef, Props>(({ children, progress }, ref) => {
  const context = useSharedValue({ y: 0 });
  const maxTranslate = MAX_DRAWER_HEIGHT - MIN_DRAWER_HEIGHT;

  useImperativeHandle(ref, () => ({
    collapse: () => {
      progress.value = withTiming(1, TIMING_CONFIG);
    },
    expand: () => {
      progress.value = withTiming(0, TIMING_CONFIG);
    },
  }));

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: progress.value * maxTranslate };
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY;
      const clampedY = Math.max(0, Math.min(newY, maxTranslate));
      progress.value = clampedY / maxTranslate;
    })
    .onEnd((event) => {
      if (event.velocityY > 500) {
        progress.value = withTiming(1, TIMING_CONFIG);
      } else if (event.velocityY < -500) {
        progress.value = withTiming(0, TIMING_CONFIG);
      } else {
        if (progress.value > 0.5) {
          progress.value = withTiming(1, TIMING_CONFIG);
        } else {
          progress.value = withTiming(0, TIMING_CONFIG);
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: MAX_DRAWER_HEIGHT - progress.value * maxTranslate,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </GestureDetector>
  );
});

BottomDrawer.displayName = 'BottomDrawer';
export default BottomDrawer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleContainer: {
    height: HANDLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});
