import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ImagePlus } from 'lucide-react-native';
import LabeledInput from '@/components/ui/labeled-input';
import { CardData, Quality, SelectionOption } from '@/types';
import { Qualities } from '@/constants';

type Props = {
  card: CardData;
  onCardChange: (updater: (prev: CardData) => CardData) => void;
  onPickImage: () => void;
  onOpenSelect: (title: string, options: SelectionOption[], value: string, onConfirm: (val: string) => void) => void;
};

export default function BasicSettings({ card, onCardChange, onPickImage, onOpenSelect }: Props) {
  return (
    <View>
      <LabeledInput
        label="名称"
        value={card.name}
        placeholder="请输入名称"
        maxLength={15}
        onChangeText={(text) => onCardChange((prev) => ({ ...prev, name: text }))}
      />
      <LabeledInput
        label="副标题"
        value={card.subtitle}
        placeholder="请输入副标题"
        maxLength={25}
        onChangeText={(text) => onCardChange((prev) => ({ ...prev, subtitle: text }))}
      />
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>图片</Text>
        <Pressable onPress={onPickImage} style={styles.imagePickerButton}>
          <ImagePlus color="#0f172a" />
          <Text style={styles.imagePickerText}>
            {card.imageUri ? '重新选择图片' : '从相册选图'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>品质</Text>
        <Pressable
          onPress={() =>
            onOpenSelect(
              '选择品质',
              Qualities.map((q) => ({ label: q, value: q })),
              card.quality,
              (value) => onCardChange((prev) => ({ ...prev, quality: value as Quality })),
            )
          }
          style={styles.selectButton}
        >
          <Text style={styles.selectButtonText}>{card.quality}</Text>
          <ChevronDown color="#0f172a" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
