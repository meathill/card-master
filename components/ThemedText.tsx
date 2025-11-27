import { Text, StyleSheet, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  darkColor,
  lightColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[{ color }, type === 'title' && styles.title, type === 'defaultSemiBold' && styles.semiBold, type === 'subtitle' && styles.subtitle, type === 'link' && styles.link, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  semiBold: {
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6A7282',
  },
  link: {
    color: '#1e40af',
    textDecorationLine: 'underline',
  },
});
