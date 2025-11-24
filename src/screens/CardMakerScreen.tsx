import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { ChevronDown, Download, ImagePlus, Info } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as SQLite from 'expo-sqlite';
import { filterVisibleSkills, Skill, truncateText, validateFeedback } from '@/utils/validation';

const qualities = ['N', 'R', 'SR', 'SSR', 'UR'] as const;
const skillLevels = ['D', 'C', 'B', 'A', 'S'] as const;
type Quality = (typeof qualities)[number];
type SkillLevel = (typeof skillLevels)[number];

type CardData = {
  name: string;
  subtitle: string;
  quality: Quality;
  imageUri?: string;
  skills: Skill[];
};

const defaultCard: CardData = {
  name: '卡牌名称',
  subtitle: '卡牌副标题或称号',
  quality: 'SSR',
  imageUri: undefined,
  skills: [
    { title: '', content: '', level: 'A' },
    { title: '', content: '', level: 'A' }
  ]
};

type SelectionOption = { label: string; value: string };

type SelectionState = {
  title: string;
  options: SelectionOption[];
  value: string;
  visible: boolean;
  onConfirm?: (value: string) => void;
};

async function getDb() {
  return SQLite.openDatabaseAsync('card-master.db');
}

async function setupDatabase() {
  const db = await getDb();
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY NOT NULL, value TEXT);' +
      'CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, createdAt TEXT);'
  );
  return db;
}

async function saveCardData(card: CardData) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO kv(key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
    ['card', JSON.stringify(card)]
  );
}

async function loadCardData(): Promise<CardData | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM kv WHERE key = ?', ['card']);
  return row?.value ? (JSON.parse(row.value) as CardData) : null;
}

async function logFeedback(content: string) {
  const db = await getDb();
  await db.runAsync('INSERT INTO feedback(content, createdAt) VALUES (?, ?)', [content, new Date().toISOString()]);
}

function SelectionModal({ state, setState }: { state: SelectionState; setState: (value: SelectionState) => void }) {
  const [tempValue, setTempValue] = useState(state.value);

  useEffect(() => {
    setTempValue(state.value);
  }, [state.value, state.visible]);

  return (
    <Modal visible={state.visible} transparent animationType="slide" onRequestClose={() => setState({ ...state, visible: false })}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-2xl p-4">
          <Text className="text-lg font-semibold mb-4">{state.title}</Text>
          <FlatList
            data={state.options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setTempValue(item.value)}
                className={`flex-row items-center justify-between p-3 rounded-xl mb-2 ${
                  tempValue === item.value ? 'bg-slate-100' : 'bg-white'
                }`}
              >
                <Text className="text-base">{item.label}</Text>
                {tempValue === item.value && <Text className="text-primary font-semibold">已选</Text>}
              </Pressable>
            )}
          />
          <View className="flex-row justify-end mt-2 space-x-3">
            <Pressable
              className="px-4 py-2 rounded-xl bg-gray-200"
              onPress={() => setState({ ...state, visible: false })}
            >
              <Text>取消</Text>
            </Pressable>
            <Pressable
              className="px-4 py-2 rounded-xl bg-primary"
              onPress={() => {
                state.onConfirm?.(tempValue);
                setState({ ...state, visible: false });
              }}
            >
              <Text className="text-white">确定</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FeedbackModal({
  visible,
  content,
  onChange,
  onClose,
  onSubmit
}: {
  visible: boolean;
  content: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-white p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold">关于产品的说明</Text>
          <Pressable onPress={onClose} className="px-2 py-1 rounded-full bg-gray-100">
            <Text>关闭</Text>
          </Pressable>
        </View>
        <Text className="text-base mb-2">提交你的建议</Text>
        <View className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
          <TextInput
            multiline
            maxLength={1000}
            placeholder="请输入，不超过1000字"
            className="min-h-[140px] text-base"
            value={content}
            onChangeText={onChange}
          />
          <Text className="text-right text-gray-500 text-xs">{content.length}/1000</Text>
        </View>
        <Pressable onPress={onSubmit} className="mt-6 rounded-full bg-primary py-3 items-center">
          <Text className="text-white text-base">提交</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function QualityBadge({ quality }: { quality: Quality }) {
  return (
    <View className="absolute right-4 top-4 bg-black/60 px-3 py-1 rounded-full">
      <Text className="text-lg font-black text-yellow-300">{quality}</Text>
    </View>
  );
}

function SkillBlock({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  return (
    <View className="absolute inset-x-3 bottom-4 bg-black/50 rounded-2xl p-3 space-y-2">
      {skills.map((skill, index) => (
        <View key={`${skill.title}-${index}`} className="bg-white/90 rounded-xl p-2">
          <View className="flex-row items-center mb-1">
            <Text className="text-xs text-gray-500 mr-2">Lv.{skill.level}</Text>
            <Text className="text-base font-semibold" numberOfLines={1} ellipsizeMode="clip">
              {skill.title || '技能标题'}
            </Text>
          </View>
          <Text className="text-sm text-gray-800">{skill.content || '技能描述'}</Text>
        </View>
      ))}
    </View>
  );
}

function CardPreview({
  card,
  onDownload,
  viewShotRef
}: {
  card: CardData;
  onDownload: () => void;
  viewShotRef: React.RefObject<ViewShot>;
}) {
  const visibleSkills = filterVisibleSkills(card.skills);

  return (
    <View className="bg-black rounded-3xl overflow-hidden shadow-xl mb-4">
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-white font-extrabold text-xl">制卡大师</Text>
      </View>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <View className="bg-slate-900 rounded-3xl overflow-hidden" collapsable={false}>
          <View className="h-96 relative">
            {card.imageUri ? (
              <Image source={{ uri: card.imageUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full bg-slate-800 items-center justify-center">
                <ImagePlus color="#cbd5e1" size={48} />
                <Text className="text-gray-400 mt-2">选择一张图片</Text>
              </View>
            )}
            <View className="absolute inset-0 border-4 border-yellow-500/50 rounded-3xl" />
            <QualityBadge quality={card.quality} />
            <View className="absolute left-4 bottom-24 right-4">
              <View className="bg-black/50 rounded-xl px-3 py-2 mb-2">
                <Text className="text-white text-xl font-semibold" numberOfLines={1} ellipsizeMode="clip">
                  {card.name}
                </Text>
              </View>
              <View className="bg-black/40 rounded-xl px-3 py-2">
                <Text className="text-white text-sm" numberOfLines={1} ellipsizeMode="clip">
                  {card.subtitle}
                </Text>
              </View>
            </View>
            <SkillBlock skills={visibleSkills} />
          </View>
          <View className="bg-black px-4 py-3">
            <Text className="text-center text-white text-xs">微信小程序：制卡大师</Text>
          </View>
        </View>
      </ViewShot>
      <View className="flex-row justify-end px-4 pb-4">
        <Pressable onPress={onDownload} className="bg-white rounded-full px-4 py-3 flex-row items-center space-x-2">
          <Download color="#0f172a" size={20} />
          <Text className="text-base font-semibold">下载</Text>
        </Pressable>
      </View>
    </View>
  );
}

function LabeledInput({
  label,
  value,
  placeholder,
  onChangeText,
  maxLength,
  multiline = false
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  maxLength: number;
  multiline?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-600 mb-2">{label}</Text>
      <View className="border border-gray-200 rounded-2xl bg-white px-3 py-2">
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={(text) => onChangeText(truncateText(text, maxLength))}
          maxLength={maxLength}
          multiline={multiline}
          className="text-base"
        />
        <Text className="text-right text-xs text-gray-400">{value.length}/{maxLength}</Text>
      </View>
    </View>
  );
}

function SettingsTabs({
  active,
  onChange
}: {
  active: 'basic' | 'skills' | 'stats';
  onChange: (value: 'basic' | 'skills' | 'stats') => void;
}) {
  const tabs: { key: 'basic' | 'skills' | 'stats'; label: string }[] = [
    { key: 'basic', label: '基本' },
    { key: 'skills', label: '技能' },
    { key: 'stats', label: '数值' }
  ];

  return (
    <View className="flex-row bg-white rounded-full p-1 mb-4">
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onChange(tab.key)}
          className={`flex-1 py-2 rounded-full items-center ${active === tab.key ? 'bg-primary' : ''}`}
        >
          <Text className={`text-base ${active === tab.key ? 'text-white font-semibold' : 'text-gray-700'}`}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function CardMakerScreen() {
  const [card, setCard] = useState<CardData>(defaultCard);
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

  useEffect(() => {
    (async () => {
      await setupDatabase();
      const saved = await loadCardData();
      if (saved) {
        setCard({ ...defaultCard, ...saved });
      }
      setDbReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!dbReady) return;
    saveCardData(card).catch(() => {
      // best-effort persistence
    });
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
    await logFeedback(feedbackContent.trim());
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
    <View className="flex-1 bg-gray-100">
      <Animated.View style={{ transform: [{ scale: previewScale }] }}>
        <CardPreview card={card} onDownload={handleDownload} viewShotRef={viewShotRef} />
      </Animated.View>
      <View className="flex-1 px-4 pb-4">
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl font-bold mr-2">设置</Text>
          <Pressable onPress={() => setFeedbackVisible(true)} className="p-2 rounded-full bg-white">
            <Info size={18} color="#0f172a" />
          </Pressable>
        </View>
        <SettingsTabs active={activeTab} onChange={setActiveTab} />
        <Animated.ScrollView
          className="bg-white rounded-3xl p-4"
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true
          })}
          scrollEventThrottle={16}
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
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">图片</Text>
                <Pressable
                  onPress={handlePickImage}
                  className="border border-dashed border-gray-300 rounded-2xl bg-gray-50 h-36 items-center justify-center"
                >
                  <ImagePlus color="#0f172a" />
                  <Text className="text-sm text-gray-600 mt-2">{card.imageUri ? '重新选择图片' : '从相册选图'}</Text>
                </Pressable>
              </View>
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">品质</Text>
                <Pressable
                  onPress={() =>
                    openSelect(
                      '选择品质',
                      qualities.map((q) => ({ label: q, value: q })),
                      card.quality,
                      (value) => setCard((prev) => ({ ...prev, quality: value as Quality }))
                    )
                  }
                  className="border border-gray-200 rounded-2xl bg-gray-50 px-3 py-3 flex-row items-center justify-between"
                >
                  <Text className="text-base">{card.quality}</Text>
                  <ChevronDown color="#0f172a" />
                </Pressable>
              </View>
            </View>
          )}

          {activeTab === 'skills' && (
            <View>
              {card.skills.map((skill, index) => (
                <View key={index} className="mb-4">
                  <Text className="text-sm text-gray-600 mb-2">技能 {index + 1}</Text>
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
                  <View className="mb-2">
                    <Text className="text-sm text-gray-600 mb-2">技能等级</Text>
                    <Pressable
                      onPress={() =>
                        openSelect(
                          '选择技能等级',
                          skillLevels.map((lvl) => ({ label: lvl, value: lvl })),
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
                      <Text className="text-base">{skill.level}</Text>
                      <ChevronDown color="#0f172a" />
                    </Pressable>
                  </View>
                </View>
              ))}
              {visibleSkills.length === 0 && (
                <Text className="text-sm text-gray-500">填写技能标题或内容后将在卡牌上显示。</Text>
              )}
            </View>
          )}

          {activeTab === 'stats' && (
            <View>
              <Text className="text-gray-500">暂未开放的数值设置，敬请期待。</Text>
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
