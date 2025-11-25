import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Stack} from "expo-router";
import {useColorScheme} from "@/hooks/useColorScheme";
import '../global.css';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(home)/index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
