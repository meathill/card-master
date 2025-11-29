import { StyleSheet, Text, View } from 'react-native';

export default function StatsSettings() {
  return (
    <View>
      <Text style={styles.placeholderText}>暂未开放的数值设置，敬请期待。</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderText: {
    color: '#6A7282',
  },
});
