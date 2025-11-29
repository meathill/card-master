import { ReactNode, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

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
  onProgressChange?: (progress: number) => void; // 0=展开, 1=收起
};

const BottomDrawer = forwardRef<BottomDrawerRef, Props>(({ children, onProgressChange }, ref) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const maxTranslate = MAX_DRAWER_HEIGHT - MIN_DRAWER_HEIGHT;

  const notifyProgress = useCallback((progress: number) => {
    onProgressChange?.(progress);
  }, [onProgressChange]);

  useImperativeHandle(ref, () => ({
    collapse: () => {
      translateY.value = withTiming(maxTranslate, TIMING_CONFIG);
      notifyProgress(1);
    },
    expand: () => {
      translateY.value = withTiming(0, TIMING_CONFIG);
      notifyProgress(0);
    },
  }));

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY;
      translateY.value = Math.max(0, Math.min(newY, maxTranslate));
      // 实时通知进度
      runOnJS(notifyProgress)(translateY.value / maxTranslate);
    })
    .onEnd((event) => {
      if (event.velocityY > 500) {
        translateY.value = withTiming(maxTranslate, TIMING_CONFIG);
        runOnJS(notifyProgress)(1);
      } else if (event.velocityY < -500) {
        translateY.value = withTiming(0, TIMING_CONFIG);
        runOnJS(notifyProgress)(0);
      } else {
        if (translateY.value > maxTranslate / 2) {
          translateY.value = withTiming(maxTranslate, TIMING_CONFIG);
          runOnJS(notifyProgress)(1);
        } else {
          translateY.value = withTiming(0, TIMING_CONFIG);
          runOnJS(notifyProgress)(0);
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: MAX_DRAWER_HEIGHT - translateY.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        <View style={styles.content}>
          {children}
        </View>
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
    backgroundColor: '#f1f5f9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
