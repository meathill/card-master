import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { ChevronDown, ImagePlus, Info } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import CardPreview from '@/components/card-preview';
import LabeledInput from '@/components/ui/labeled-input';
import SettingsTabs from '@/components/settings-tabs';
import SelectionModal from '@/components/modal/selection-modal';
import FeedbackModal from '@/components/modal/feedback-modal';
import { createDefaultCard, Qualities, SkillLevels } from '@/constants';
import { filterVisibleSkills, truncateText, validateFeedback } from '@/utils/validation';
import { CardData, Quality, SkillLevel, SelectionState, SelectionOption } from '@/types';

export default function Card() {
  const [card, setCard] = useState<CardData>(createDefaultCard());
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'stats'>('basic');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [selectionState, setSelectionState] = useState<SelectionState>({
    title: '',
    options: [],
    value: '',
    visible: false
  });
  const [dbReady, setDbReady] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

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
      quality: 1
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

  const onSubmitFeedback = async () => {
    const result = validateFeedback(feedbackContent);
    if (!result.valid) {
      Alert.alert(result.error ?? '请填写内容');
      return;
    }
    // await logFeedback(feedbackContent.trim());
    setFeedbackContent('');
    Alert.alert('你的反馈我们已收到，谢谢！', '', [
      {
        text: '好的',
        onPress: () => setFeedbackVisible(false)
      }
    ]);
  };

  const visibleSkills = useMemo(() => filterVisibleSkills(card.skills), [card.skills]);

  const previewScale = scrollY.interpolate({
    inputRange: [-120, 0],
    outputRange: [1.15, 1],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: previewScale }] }}>
        <CardPreview card={card} onDownload={handleDownload} viewShotRef={viewShotRef} />
      </Animated.View>
      <View style={{ flex: 1, paddingInline: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
          <Text style={{ fontSize: 24, fontWeight: 700, marginEnd: 8 }}>设置</Text>
          <Pressable 
            onPress={() => setFeedbackVisible(true)} 
            className="p-2 rounded-full bg-white"
            style={{ padding: 8, borderRadius: 9999, backgroundColor: '#fff' }}
          >
            <Info size={18} color="#0f172a" />
          </Pressable>
        </View>
        <SettingsTabs 
          active={activeTab} 
          onChange={setActiveTab} 
        />
        <Animated.ScrollView
          className="bg-white rounded-3xl p-4"
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true
          })}
          scrollEventThrottle={16}
          style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16 }}
        >
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
              <View className="mb-4" style={{ marginBottom: 16 }}>
                <Text className="text-sm text-gray-600 mb-2" style={{ fontSize: 14, color: '#4A5565', marginBottom: 8 }}>图片</Text>
                <Pressable
                  onPress={handlePickImage}
                  className="border border-dashed border-gray-300 rounded-2xl bg-gray-50 h-36 items-center justify-center"
                  style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#D1D5DC', borderRadius: 16, backgroundColor: '#F9FAFb', height: 144, alignItems: 'center', justifyContent: 'center' }}
                >
                  <ImagePlus color="#0f172a" />
                  <Text className="text-sm text-gray-600 mt-2" style={{ fontSize: 14, color: '#4A5565', marginBottom: 8 }}>{card.imageUri ? '重新选择图片' : '从相册选图'}</Text>
                </Pressable>
              </View>
              <View className="mb-4" style={{ marginBottom: 16 }}>
                <Text className="text-sm text-gray-600 mb-2" style={{ fontSize: 14, color: '#4A5565', marginBottom: 8}}>品质</Text>
                <Pressable
                  onPress={() =>
                    openSelect(
                      '选择品质',
                      Qualities.map((q) => ({ label: q, value: q })),
                      card.quality,
                      (value) => setCard((prev) => ({ ...prev, quality: value as Quality }))
                    )
                  }
                  className="border border-gray-200 rounded-2xl bg-gray-50 px-3 py-3 flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#D1D5DC', borderRadius: 16, backgroundColor: '#F9FAFb', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text className="text-base" style={{ fontSize: 16 }}>{card.quality}</Text>
                  <ChevronDown color="#0f172a" />
                </Pressable>
              </View>
            </View>
          )}

          {activeTab === 'skills' && (
            <View>
              {card.skills.map((skill, index) => (
                <View key={index} className="mb-4" style={{ marginBottom: 16 }}>
                  <Text className="text-sm text-gray-600 mb-2" style={{ fontSize: 14, color: '#4A5565', marginBottom: 8}}>技能 {index + 1}</Text>
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
                  <View className="mb-2" style={{ marginBottom: 8 }}>
                    <Text className="text-sm text-gray-600 mb-2" style={{ fontSize: 14, color: '#4A5565', marginBottom: 8}}>技能等级</Text>
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
                            })
                        )
                      }
                      className="border border-gray-200 rounded-2xl bg-gray-50 px-3 py-3 flex-row items-center justify-between"
                    >
                      <Text className="text-base" style={{ fontSize: 16 }}>{skill.level}</Text>
                      <ChevronDown color="#0f172a" />
                    </Pressable>
                  </View>
                </View>
              ))}
              {visibleSkills.length === 0 && (
                <Text className="text-sm text-gray-500" style={{ fontSize: 14, color: '#6A7282' }}>填写技能标题或内容后将在卡牌上显示。</Text>
              )}
            </View>
          )}

          {activeTab === 'stats' && (
            <View>
              <Text className="text-gray-500" style={{ color: '#6A7282' }}>暂未开放的数值设置，敬请期待。</Text>
            </View>
          )}
        </Animated.ScrollView>
      </View>

      <SelectionModal state={selectionState} setState={setSelectionState} />
      <FeedbackModal
        visible={feedbackVisible}
        content={feedbackContent}
        onChange={(value) => setFeedbackContent(truncateText(value, 1000))}
        onClose={() => setFeedbackVisible(false)}
        onSubmit={onSubmitFeedback}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
});
