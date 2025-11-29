import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';
import { DownloadIcon, Info } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import CardPreview from '@/components/card-preview';
import BottomDrawer, { BottomDrawerRef } from '@/components/BottomDrawer';
import SettingsTabs from '@/components/settings-tabs';
import { BasicSettings, SkillsSettings, StatsSettings } from '@/components/settings';
import SelectionModal from '@/components/modal/selection-modal';
import { createDefaultCard } from '@/constants';
import { CardData, SelectionState, SelectionOption } from '@/types';
import { setupDatabase, saveCardData, loadCardData } from '@/lib/db';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Href, Link } from 'expo-router';

const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.cubic) };

export default function Card() {
  const [card, setCard] = useState<CardData>(createDefaultCard());
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'stats'>('basic');
  const [selectionState, setSelectionState] = useState<SelectionState>({
    title: '',
    options: [],
    value: '',
    visible: false,
  });
  const [dbReady, setDbReady] = useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const viewShotRef = useRef<ViewShot | null>(null);
  const drawerRef = useRef<BottomDrawerRef>(null);
  const previewScale = useSharedValue(1);
  const isCollapsed = useRef(false);

  // 抽屉拖动时更新预览缩放
  const handleDrawerProgress = useCallback((progress: number) => {
    // progress: 0=展开, 1=收起
    // 收起时放大到1.15
    previewScale.value = 1 + progress * 0.15;
    isCollapsed.current = progress > 0.5;
  }, []);

  // 点击预览区切换抽屉状态
  const handlePreviewPress = useCallback(() => {
    if (isCollapsed.current) {
      drawerRef.current?.expand();
      previewScale.value = withTiming(1, TIMING_CONFIG);
      isCollapsed.current = false;
    } else {
      drawerRef.current?.collapse();
      previewScale.value = withTiming(1.15, TIMING_CONFIG);
      isCollapsed.current = true;
    }
  }, []);

  const previewAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: previewScale.value }],
  }));

  // 初始化数据库并加载保存的卡牌数据
  useEffect(() => {
    (async () => {
      try {
        await setupDatabase();
        setDbReady(true);
        const savedCard = await loadCardData();
        if (savedCard) {
          setCard(savedCard);
        }
      } catch (error) {
        console.error('Database init failed:', error);
      }
    })();
  }, []);

  // 保存卡牌数据到数据库
  useEffect(() => {
    if (dbReady) {
      saveCardData(card).catch(console.error);
    }
  }, [card, dbReady]);

  const openSelect = (title: string, options: SelectionOption[], value: string, onConfirm: (val: string) => void) => {
    setSelectionState({ title, options, value, visible: true, onConfirm });
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('需要权限', '请允许访问相册以选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setCard((prev) => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const handleDownload = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('需要权限', '请允许保存图片到相册');
      return;
    }

    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error('capture failed');
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('已保存', '卡牌已保存到相册');
    } catch (error) {
      Alert.alert('保存失败', '请稍后再试');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Pressable style={styles.previewContainer} onPress={handlePreviewPress}>
        <Animated.View style={previewAnimatedStyle}>
          <CardPreview card={card} viewShotRef={viewShotRef} />
        </Animated.View>
      </Pressable>

      <BottomDrawer ref={drawerRef} onProgressChange={handleDrawerProgress}>
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <SettingsTabs active={activeTab} onChange={setActiveTab} />
            <Link asChild href={"/about" as Href}>
              <Pressable style={styles.infoButton}>
                <Info size={18} color="#0f172a" />
              </Pressable>
            </Link>
          </View>
          <ScrollView style={styles.scrollView}>
            {activeTab === 'basic' && (
              <BasicSettings
                card={card}
                onCardChange={setCard}
                onPickImage={handlePickImage}
                onOpenSelect={openSelect}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsSettings
                card={card}
                onCardChange={setCard}
                onOpenSelect={openSelect}
              />
            )}
            {activeTab === 'stats' && <StatsSettings />}
          </ScrollView>
        </View>
      </BottomDrawer>

      <View style={{ ...styles.header, top }}>
        <Text style={styles.h1Text}>制卡大师</Text>
        <Pressable onPress={handleDownload} style={styles.downloadButton}>
          <DownloadIcon color="#0f172a" size={20} />
        </Pressable>
      </View>
      <SelectionModal state={selectionState} setState={setSelectionState} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 16,
    right: 16,
  },
  h1Text: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 80,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  infoButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
  },
  downloadButton: {
    backgroundColor: '#fff',
    borderRadius: 9999,
    padding: 8,
  },
});
