import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardMakerScreen from './src/screens/CardMakerScreen';
import './global.css';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <CardMakerScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
