import React, { RefObject } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { ImagePlus } from 'lucide-react-native';
import { CardData, Quality, Skill } from '@/types';
import { filterVisibleSkills } from '@/utils/validation';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import CardBg from '@/assets/card-bg.webp';
import QualityN from '@/assets/N.png';
import QualityR from '@/assets/R.png';
import QualitySR from '@/assets/SR.png';
import QualitySSR from '@/assets/SSR.png';
import QualityUR from '@/assets/UR.png';
import { Svg, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// 卡牌保持屏幕比例
const CARD_WIDTH = SCREEN_WIDTH;
const CARD_HEIGHT = SCREEN_HEIGHT;
const QUALITY_BADGES: Record<Quality, any> = {
  N: {
    width: 97,
    height: 91,
    icon: QualityN,
  },
  R: {
    width: 91,
    height: 94,
    icon: QualityR,
  },
  SR: {
    width: 135,
    height: 135,
    icon: QualitySR,
  },
  SSR: {
    width: 211,
    height: 141,
    icon: QualitySSR,
  },
  UR: {
    width: 208,
    height: 144,
    icon: QualityUR,
  },
};

function QualityBadge({ quality }: { quality: Quality }) {
  const Badge = QUALITY_BADGES[quality];

  return (
    <View style={styles.qualityBadge}>
      <Image source={Badge.icon} width={(Badge.width / Badge.height) * 67} height={67} />
    </View>
  );
}

function SkillBlock({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  return (
    <View style={styles.skillBlock}>
      <View style={styles.skillBlockInner}>
        {skills.map((skill, index) => (
          <View key={`${skill.title}-${index}`} style={styles.skillItem}>
            <View style={styles.skillIcon}>
              <Text style={styles.skillLevel}>Lv.{skill.level}</Text>
            </View>
            <View style={styles.skillRight}>
              <Text style={styles.skillTitle} numberOfLines={1} ellipsizeMode="clip">
                {skill.title || '技能标题'}
              </Text>
              <Text style={styles.skillContent}>{skill.content || '技能描述'}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function CardPreview({
  card,
  viewShotRef,
}: {
  card: CardData;
  viewShotRef: RefObject<ViewShot | null>;
}) {
  const visibleSkills = filterVisibleSkills(card.skills);

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.viewShot}>
        <View style={styles.cardInner} collapsable={false}>
          <Image contentFit="cover" source={CardBg} style={StyleSheet.absoluteFill} />
          <View style={styles.imageContainer}>
            {card.imageUri ? (
              <Image source={{ uri: card.imageUri }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImagePlus color="#cbd5e1" size={48} />
                <Text style={styles.imagePlaceholderText}>选择一张图片</Text>
              </View>
            )}
          </View>
          <QualityBadge quality={card.quality} />
          <View style={styles.cardInfo}>
            <LinearGradient
              colors={['#0000', '#0008', '#0008', '#0000']}
              end={{ x: 1, y: 0.5 }}
              start={{ x: 0, y: 0.5 }}
              style={styles.cardInfoBg}
            />
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
          <View style={styles.footer}>
            <Text style={styles.footerText}>制卡大师</Text>
          </View>
        </View>
      </ViewShot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewShot: {},
  cardInner: {
    width: CARD_WIDTH * 0.9,
    height: (CARD_WIDTH * 0.9) / (57 / 87),
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
    paddingBottom: 0,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D293D',
    borderRadius: 18,
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#99A1AF',
  },
  qualityBadge: {
    position: 'absolute',
    top: -4,
    right: -2,
    justifyContent: 'flex-end',
  },
  cardInfo: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 30,
  },
  cardInfoBg: {
    position: 'absolute',
    top: 7,
    left: 0,
    width: '90%',
    height: 44,
  },
  nameContainer: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  cardName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    textShadowColor: 'black',
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 },
  },
  subtitleContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardSubtitle: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 },
  },
  skillBlock: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 30,
    backgroundColor: '#F5C36A',
    borderWidth: 0.75,
    borderColor: '#896C3E',
    borderRadius: 20,
    padding: 6,
    boxShadow: '0 4px 30.8px -15px rgba(0, 0, 0, 0.25)',
  },
  skillBlockInner: {
    backgroundColor: '#FDEDD6',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 12,
  },
  skillItem: {
    flexDirection: 'row',
    gap: 8,
  },
  skillRight: {
    gap: 2,
  },
  skillIcon: {
    width: 32,
    flexBasis: 32,
    flexShrink: 0,
  },
  skillLevel: {
    fontSize: 12,
    marginEnd: 8,
    color: '#6A7282',
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  skillContent: {
    fontSize: 14,
    color: '#402518',
  },
  footer: {
    flexBasis: 40,
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
    paddingTop: 10,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 10,
  },
});
