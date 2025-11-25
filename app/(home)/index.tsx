import { Platform, Text, View } from "react-native";

const isIOS = Platform.OS === 'ios';

export default function HomeIndex() {
  return <View className="flex-1 pt-16 bg-red">
    <Text>hello</Text>
  </View>
}
