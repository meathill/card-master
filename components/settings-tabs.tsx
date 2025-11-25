import { Pressable, Text, View } from 'react-native';

export default function SettingsTabs({
  active,
  onChange
}: {
  active: 'basic' | 'skills' | 'stats';
  onChange: (value: 'basic' | 'skills' | 'stats') => void;
}) {
  const tabs: { key: 'basic' | 'skills' | 'stats'; label: string }[] = [
    { key: 'basic', label: '基本' },
    { key: 'skills', label: '技能' },
    { key: 'stats', label: '数值' }
  ];

  return (
    <View className="flex-row bg-white rounded-full p-1 mb-4">
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onChange(tab.key)}
          className={`flex-1 py-2 rounded-full items-center ${active === tab.key ? 'bg-primary' : ''}`}
        >
          <Text className={`text-base ${active === tab.key ? 'text-white font-semibold' : 'text-gray-700'}`}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
