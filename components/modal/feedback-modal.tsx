import { Modal, Pressable, Text, TextInput, View } from 'react-native';

export default function FeedbackModal({
  visible,
  content,
  onChange,
  onClose,
  onSubmit
}: {
  visible: boolean;
  content: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-white p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold">关于产品的说明</Text>
          <Pressable onPress={onClose} className="px-2 py-1 rounded-full bg-gray-100">
            <Text>关闭</Text>
          </Pressable>
        </View>
        <Text className="text-base mb-2">提交你的建议</Text>
        <View className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
          <TextInput
            multiline
            maxLength={1000}
            placeholder="请输入，不超过1000字"
            className="min-h-[140px] text-base"
            value={content}
            onChangeText={onChange}
          />
          <Text className="text-right text-gray-500 text-xs">{content.length}/1000</Text>
        </View>
        <Pressable onPress={onSubmit} className="mt-6 rounded-full bg-primary py-3 items-center">
          <Text className="text-white text-base">提交</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
