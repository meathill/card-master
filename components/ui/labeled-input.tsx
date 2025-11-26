import { TextInput, Text, View } from 'react-native';
import { truncateText } from '@/utils/validation';

export default function LabeledInput({
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
    <View className="mb-4" style={{marginBottom: 16}}>
      <Text className="text-sm text-gray-600 mb-2" style={{ fontSize: 14, color: '#4A5565', marginBottom: 8 }}>{label}</Text>
      <View className="border border-gray-200 rounded-2xl bg-white px-3 py-2" style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7Eb', borderRadius: 16, backgroundColor: '#fff', paddingInline: 12, paddingBlock: 8 }}>
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={(text) => onChangeText(truncateText(text, maxLength))}
          maxLength={maxLength}
          multiline={multiline}
          className="text-base"
          style={{ fontSize: 16 }}
        />
        <Text className="text-right text-xs text-gray-400" style={{ textAlign: 'right', fontSize: 12, color: '#99A1AF' }}>{value.length}/{maxLength}</Text>
      </View>
    </View>
  );
}
