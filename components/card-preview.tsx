import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Download, ImagePlus, Leaf } from 'lucide-react-native';
import { CardData, Quality, Skill } from '@/types';
import { filterVisibleSkills } from '@/utils/validation';

function QualityBadge({ quality }: { quality: Quality }) {
  return (
    <View className="absolute right-4 top-4 bg-black/60 px-3 py-1 rounded-full" style={{ position: 'absolute', right: 16, top: 16, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 }}>
      <Text className="text-lg font-black text-yellow-300" style={{ fontSize: 18, fontWeight: 800, color: '#FFDF20' }}>{quality}</Text>
    </View>
  );
}

function SkillBlock({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  return (
    <View className="absolute inset-x-3 bottom-4 bg-black/50 rounded-2xl p-3 space-y-2" style={{ position: 'absolute', left: 12, right: 12, bottom: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, paddingInline: 12 }}>
      {skills.map((skill, index) => (
        <View key={`${skill.title}-${index}`} className="bg-white/90 rounded-xl p-2" style={{ backgroundColor: '#fffD', borderRadius: 12, padding: 8}}>
          <View className="flex-row items-center mb-1" style={{ flexDirection: 'row', 'alignItems': 'center', marginBottom: 4 }}>
            <Text className="text-xs text-gray-500 mr-2" style={{ fontSize: 12, marginEnd: 8, color: '#6A7282' }}>Lv.{skill.level}</Text>
            <Text 
              className="text-base font-semibold" 
              numberOfLines={1} 
              ellipsizeMode="clip"
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              {skill.title || '技能标题'}
            </Text>
          </View>
          <Text className="text-sm text-gray-800" style={{ fontSize: 14, color: '#1E2939' }}>{skill.content || '技能描述'}</Text>
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
    <View className="bg-black rounded-3xl overflow-hidden shadow-xl mb-4" style={{ backgroundColor: '#000', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, marginBottom: 16 }}>
      <View className="flex-row items-center justify-between px-4 pt-4" style={{ flexDirection: 'row', 'alignItems': 'center', justifyContent: 'center', paddingInline: 16, paddingTop: 16 }}>
        <Text className="text-white font-extrabold text-xl" style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>制卡大师</Text>
      </View>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <View 
          className="bg-slate-900 rounded-3xl overflow-hidden" 
          collapsable={false}
          style={{ backgroundColor: '#0F172B', borderRadius: 24, overflow: 'hidden' }}
        >
          <View className="h-96 relative" style={{ height: 384, position: 'relative' }}>
            {card.imageUri ? (
              <Image 
                source={{ uri: card.imageUri }} 
                className="w-full h-full" 
                resizeMode="cover" 
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View className="w-full h-full bg-slate-800 items-center justify-center" style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1D293D' }}>
                <ImagePlus color="#cbd5e1" size={48} />
                <Text className="text-gray-400 mt-2" style={{ marginBottom: 8, color: '#99A1AF' }}>选择一张图片</Text>
              </View>
            )}
            <View className="absolute inset-0 border-4 border-yellow-500/50 rounded-3xl" style={{ position: 'absolute', inset: 0, borderWidth: 4, borderColor: '#F0B10088', borderRadius: 24 }} />
            <QualityBadge quality={card.quality} />
            <View className="absolute left-4 bottom-24 right-4" style={{ position: 'absolute', left: 16, bottom: 96, right: 16}}>
              <View className="bg-black/50 rounded-xl px-3 py-2 mb-2" style={{ backgroundColor: '#0008', borderRadius: 12, paddingInline: 12, paddingBlock: 8, marginBottom: 8}}>
                <Text 
                  className="text-white text-xl font-semibold" 
                  numberOfLines={1} 
                  ellipsizeMode="clip"
                  style={{ color: '#fff', fontSize: 20, fontWeight: 600 }}
                >
                  {card.name}
                </Text>
              </View>
              <View className="bg-black/40 rounded-xl px-3 py-2" style={{ backgroundColor: '#0006', borderRadius: 12, paddingInline: 12, paddingBlock: 8 }}>
                <Text 
                  className="text-white text-sm" 
                  numberOfLines={1} 
                  ellipsizeMode="clip"
                  style={{ color: '#fff', fontSize: 14 }}
                >
                  {card.subtitle}
                </Text>
              </View>
            </View>
            <SkillBlock skills={visibleSkills} />
          </View>
          <View className="bg-black px-4 py-3" style={{ backgroundColor: '#000', paddingInline: 16, paddingBlock: 12 }}>
            <Text className="text-center text-white text-xs" style={{ textAlign: 'center', color: '#fff', fontSize: 12 }}>微信小程序：制卡大师</Text>
          </View>
        </View>
      </ViewShot>
      <View className="flex-row justify-end px-4 pb-4" style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingInline: 16, paddingBottom: 16 }}>
        <Pressable 
          onPress={onDownload} 
          className="bg-white rounded-full px-4 py-3 flex-row items-center space-x-2"
          style={{ backgroundColor: '#fff', borderRadius: 9999, paddingInline: 16, paddingBlock: 12, flexDirection: 'row', alignItems: 'center' }}
        >
          <Download color="#0f172a" size={20} />
          <Text className="text-base font-semibold" style={{ fontSize: 16, fontWeight: 600 }}>下载</Text>
        </Pressable>
      </View>
    </View>
  );
}
