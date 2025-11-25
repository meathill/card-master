import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Download, ImagePlus } from 'lucide-react-native';
import { CardData, Quality, Skill } from '@/types';
import { filterVisibleSkills } from '@/utils/validation';

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

export default function CardPreview({
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
