import { TextInput, StyleSheet, Text, View } from 'react-native';
import { truncateText } from '@/utils/validation';

export default function LabeledInput({
  label,
  value,
  placeholder,
  onChangeText,
  maxLength,
  multiline = false,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  maxLength: number;
  multiline?: boolean;
}) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => onChangeText(truncateText(text, maxLength))}
        maxLength={maxLength}
        multiline={multiline}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 6,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 36,
  },
});
