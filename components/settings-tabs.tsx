import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SettingsTabs({
  active,
  onChange,
}: {
  active: 'basic' | 'skills' | 'stats';
  onChange: (value: 'basic' | 'skills' | 'stats') => void;
}) {
  const tabs: { key: 'basic' | 'skills' | 'stats'; label: string }[] = [
    { key: 'basic', label: '基本' },
    { key: 'skills', label: '技能' },
    { key: 'stats', label: '数值' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={[styles.tab, active === tab.key && styles.tabActive]}
        >
          <Text style={[styles.tabText, active === tab.key && styles.tabTextActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 9999,
    padding: 4,
    width: '80%',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#1e40af',
  },
  tabText: {
    fontSize: 16,
    color: '#374151',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
