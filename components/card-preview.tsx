import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { ImagePlus } from 'lucide-react-native';
import { CardData, Quality, Skill } from '@/types';
import { filterVisibleSkills } from '@/utils/validation';

function QualityBadge({ quality }: { quality: Quality }) {
  return (
    <View style={styles.qualityBadge}>
      <Text style={styles.qualityText}>{quality}</Text>
    </View>
  );
}

function SkillBlock({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  return (
    <View style={styles.skillBlock}>
      {skills.map((skill, index) => (
        <View key={`${skill.title}-${index}`} style={styles.skillItem}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillLevel}>Lv.{skill.level}</Text>
            <Text style={styles.skillTitle} numberOfLines={1} ellipsizeMode="clip">
              {skill.title || '技能标题'}
            </Text>
          </View>
          <Text style={styles.skillContent}>{skill.content || '技能描述'}</Text>
        </View>
      ))}
    </View>
  );
}

export default function CardPreview({
  card,
  viewShotRef,
}: {
  card: CardData;
  viewShotRef: React.RefObject<ViewShot | null>;
}) {
  const visibleSkills = filterVisibleSkills(card.skills);

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.viewShot}>
        <View style={styles.cardInner} collapsable={false}>
          <View style={styles.imageContainer}>
            {card.imageUri ? (
              <Image source={{ uri: card.imageUri }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImagePlus color="#cbd5e1" size={48} />
                <Text style={styles.imagePlaceholderText}>选择一张图片</Text>
              </View>
            )}
            <View style={styles.imageBorder} />
            <QualityBadge quality={card.quality} />
            <View style={styles.cardInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="clip">
                  {card.name}
                </Text>
              </View>
              <View style={styles.subtitleContainer}>
                <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="clip">
                  {card.subtitle}
                </Text>
              </View>
            </View>
            <SkillBlock skills={visibleSkills} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>微信小程序：制卡大师</Text>
          </View>
        </View>
      </ViewShot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: 16,
  },
  viewShot: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardInner: {
    backgroundColor: '#0F172B',
    borderRadius: 24,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 384,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D293D',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#99A1AF',
  },
  imageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: 'rgba(240, 177, 0, 0.53)',
    borderRadius: 24,
  },
  qualityBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  qualityText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFDF20',
  },
  cardInfo: {
    position: 'absolute',
    left: 16,
    bottom: 96,
    right: 16,
  },
  nameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  cardName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  subtitleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardSubtitle: {
    color: '#fff',
    fontSize: 14,
  },
  skillBlock: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  skillItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.87)',
    borderRadius: 12,
    padding: 8,
    marginVertical: 4,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  skillLevel: {
    fontSize: 12,
    marginEnd: 8,
    color: '#6A7282',
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  skillContent: {
    fontSize: 14,
    color: '#1E2939',
  },
  footer: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
  },
});
