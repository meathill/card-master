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
    <View style={styles.container}>
      <View style={styles.imageColumn}>
        <Pressable onPress={onPickImage} style={styles.imagePickerButton}>
          <ImagePlus color="#A3A3A3" />
          <Text style={styles.imagePickerText}>{card.imageUri ? '重选' : '图片'}</Text>
        </Pressable>
      </View>
      <View style={styles.inputColumn}>
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
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  imageColumn: {
    width: 75,
    flexBasis: 75,
    flexShrink: 0,
  },
  inputColumn: {
    flex: 1,
    gap: 12,
  },
  imagePickerButton: {
    height: 100,
    borderRadius: 6,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    color: '#A3A3A3',
    marginTop: 8,
  },
  selectButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectButtonText: {
    fontSize: 14,
  },
});
