import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';
import { ChevronDown, ImagePlus, Info } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import CardPreview from '@/components/card-preview';
import BottomDrawer, { BottomDrawerRef } from '@/components/BottomDrawer';
import LabeledInput from '@/components/ui/labeled-input';
import SettingsTabs from '@/components/settings-tabs';
import SelectionModal from '@/components/modal/selection-modal';
import { createDefaultCard, Qualities, SkillLevels } from '@/constants';
import { filterVisibleSkills } from '@/utils/validation';
import { CardData, Quality, SkillLevel, SelectionState, SelectionOption } from '@/types';
import { setupDatabase, saveCardData, loadCardData } from '@/lib/db';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Href, Link} from 'expo-router';

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

  const visibleSkills = useMemo(() => filterVisibleSkills(card.skills), [card.skills]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Pressable style={styles.previewContainer} onPress={handlePreviewPress}>
        <Animated.View style={previewAnimatedStyle}>
          <CardPreview card={card} onDownload={handleDownload} viewShotRef={viewShotRef} />
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
              <View>
                <LabeledInput
                  label="名称"
                  value={card.name}
                  placeholder="请输入名称"
                  maxLength={15}
                  onChangeText={(text) => setCard((prev) => ({ ...prev, name: text }))}
                />
                <LabeledInput
                  label="副标题"
                  value={card.subtitle}
                  placeholder="请输入副标题"
                  maxLength={25}
                  onChangeText={(text) => setCard((prev) => ({ ...prev, subtitle: text }))}
                />
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>图片</Text>
                  <Pressable onPress={handlePickImage} style={styles.imagePickerButton}>
                    <ImagePlus color="#0f172a" />
                    <Text style={styles.imagePickerText}>{card.imageUri ? '重新选择图片' : '从相册选图'}</Text>
                  </Pressable>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>品质</Text>
                  <Pressable
                    onPress={() =>
                      openSelect(
                        '选择品质',
                        Qualities.map((q) => ({ label: q, value: q })),
                        card.quality,
                        (value) => setCard((prev) => ({ ...prev, quality: value as Quality })),
                      )
                    }
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectButtonText}>{card.quality}</Text>
                    <ChevronDown color="#0f172a" />
                  </Pressable>
                </View>
              </View>
            )}

            {activeTab === 'skills' && (
              <View>
                {card.skills.map((skill, index) => (
                  <View key={index} style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>技能 {index + 1}</Text>
                    <LabeledInput
                      label="技能标题"
                      value={skill.title}
                      placeholder="请输入技能标题"
                      maxLength={10}
                      onChangeText={(text) =>
                        setCard((prev) => {
                          const skills = [...prev.skills];
                          skills[index] = { ...skills[index], title: text };
                          return { ...prev, skills };
                        })
                      }
                    />
                    <LabeledInput
                      label="技能正文"
                      value={skill.content}
                      placeholder="请输入技能描述"
                      maxLength={120}
                      multiline
                      onChangeText={(text) =>
                        setCard((prev) => {
                          const skills = [...prev.skills];
                          skills[index] = { ...skills[index], content: text };
                          return { ...prev, skills };
                        })
                      }
                    />
                    <View style={styles.skillLevelContainer}>
                      <Text style={styles.fieldLabel}>技能等级</Text>
                      <Pressable
                        onPress={() =>
                          openSelect(
                            '选择技能等级',
                            SkillLevels.map((lvl) => ({ label: lvl, value: lvl })),
                            skill.level as SkillLevel,
                            (value) =>
                              setCard((prev) => {
                                const skills = [...prev.skills];
                                skills[index] = { ...skills[index], level: value };
                                return { ...prev, skills };
                              }),
                          )
                        }
                        style={styles.skillLevelButton}
                      >
                        <Text style={styles.selectButtonText}>{skill.level}</Text>
                        <ChevronDown color="#0f172a" />
                      </Pressable>
                    </View>
                  </View>
                ))}
                {visibleSkills.length === 0 && (
                  <Text style={styles.hintText}>填写技能标题或内容后将在卡牌上显示。</Text>
                )}
              </View>
            )}

            {activeTab === 'stats' && (
              <View>
                <Text style={styles.placeholderText}>暂未开放的数值设置，敬请期待。</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </BottomDrawer>

      <View style={{ ...styles.h1, top }}>
        <Text style={styles.h1Text}>制卡大师</Text>
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
  h1: {
    position: 'absolute',
    left: 16,
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#4A5565',
    marginBottom: 8,
  },
  imagePickerButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DC',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    color: '#4A5565',
    marginTop: 8,
  },
  selectButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DC',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectButtonText: {
    fontSize: 16,
  },
  skillLevelContainer: {
    marginBottom: 8,
  },
  skillLevelButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hintText: {
    fontSize: 14,
    color: '#6A7282',
  },
  placeholderText: {
    color: '#6A7282',
  },
});
