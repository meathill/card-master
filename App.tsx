import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TailwindProvider } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardMakerScreen from './src/screens/CardMakerScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TailwindProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <CardMakerScreen />
        </SafeAreaView>
      </TailwindProvider>
    </GestureHandlerRootView>
  );
}
