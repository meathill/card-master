import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { truncateText, validateFeedback } from '@/utils/validation';
import { logFeedback } from '@/lib/db';
import { useRouter } from 'expo-router';

export default function AboutPage() {
  const router = useRouter();
  const [content, setContent] = useState('');

  async function onSubmit() {
    const result = validateFeedback(content);
    if (!result.valid) {
      Alert.alert(result.error ?? '请填写内容');
      return;
    }
    await logFeedback(content.trim());
    setContent('');
    Alert.alert('你的反馈我们已收到，谢谢！', '', [
      {
        text: '好的',
        onPress() {
          router.push('/');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>提交你的建议</Text>
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          maxLength={1000}
          placeholder="请输入，不超过1000字"
          style={styles.input}
          value={content}
          onChangeText={(value) => setContent(truncateText(value, 1000))}
        />
        <Text style={styles.counter}>{content.length}/1000</Text>
      </View>
      <Pressable onPress={onSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>提交</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#F3F4F6',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  input: {
    minHeight: 140,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    color: '#6B7280',
    fontSize: 12,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 9999,
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
