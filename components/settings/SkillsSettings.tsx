import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import LabeledInput from '@/components/ui/labeled-input';
import { CardData, SelectionOption, Skill, SkillLevel } from '@/types';
import { SkillLevels } from '@/constants';
import { filterVisibleSkills } from '@/utils/validation';

type Props = {
  card: CardData;
  onCardChange: (updater: (prev: CardData) => CardData) => void;
  onOpenSelect: (title: string, options: SelectionOption[], value: string, onConfirm: (val: string) => void) => void;
};

function SkillEditor({
  skill,
  index,
  onUpdate,
  onOpenSelect,
}: {
  skill: Skill;
  index: number;
  onUpdate: (index: number, field: keyof Skill, value: string) => void;
  onOpenSelect: Props['onOpenSelect'];
}) {
  return (
    <View style={styles.skillRow}>
      <View style={styles.skillLabel}>
        <Text style={styles.skillLabelText}>技能 {index + 1}</Text>
      </View>
      <View style={styles.skillInputs}>
        <View style={styles.skillTitleRow}>
          <LabeledInput
            label="技能标题"
            value={skill.title}
            placeholder="请输入技能标题"
            maxLength={10}
            onChangeText={(text) => onUpdate(index, 'title', text)}
          />
          <Pressable
            onPress={() =>
              onOpenSelect(
                '选择技能等级',
                SkillLevels.map((lvl) => ({ label: lvl, value: lvl })),
                skill.level,
                (value) => onUpdate(index, 'level', value),
              )
            }
            style={styles.levelButton}
          >
            <Text style={styles.levelButtonText}>{skill.level}</Text>
            <ChevronDown color="#0f172a" />
          </Pressable>
        </View>
        <LabeledInput
          label="技能正文"
          value={skill.content}
          placeholder="请输入技能描述"
          maxLength={120}
          multiline
          onChangeText={(text) => onUpdate(index, 'content', text)}
        />
      </View>
    </View>
  );
}

export default function SkillsSettings({ card, onCardChange, onOpenSelect }: Props) {
  const visibleSkills = filterVisibleSkills(card.skills);

  const handleSkillUpdate = (index: number, field: keyof Skill, value: string) => {
    onCardChange((prev) => {
      const skills = [...prev.skills];
      skills[index] = { ...skills[index], [field]: value };
      return { ...prev, skills };
    });
  };

  return (
    <View style={styles.container}>
      {card.skills.map((skill, index) => (
        <SkillEditor key={index} skill={skill} index={index} onUpdate={handleSkillUpdate} onOpenSelect={onOpenSelect} />
      ))}
      {visibleSkills.length === 0 && <Text style={styles.hintText}>填写技能标题或内容后将在卡牌上显示。</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  skillRow: {
    flexDirection: 'row',
    gap: 16,
  },
  skillLabel: {
    paddingTop: 6,
  },
  skillLabelText: {
    fontSize: 14,
    color: '#4A5565',
  },
  skillInputs: {
    flex: 1,
  },
  skillTitleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelButtonText: {
    fontSize: 16,
  },
  hintText: {
    fontSize: 14,
    color: '#6A7282',
  },
});
