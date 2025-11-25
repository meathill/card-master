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
