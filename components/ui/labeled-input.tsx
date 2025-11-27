import { TextInput, StyleSheet, Text, View } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={(text) => onChangeText(truncateText(text, maxLength))}
          maxLength={maxLength}
          multiline={multiline}
          style={styles.input}
        />
        <Text style={styles.counter}>{value.length}/{maxLength}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4A5565',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
  },
  counter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#99A1AF',
  },
});
