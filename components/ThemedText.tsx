import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { clsx } from 'clsx';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  className,
  darkColor = 'text-white',
  lightColor = 'text-black',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      className={ clsx(color, className) }
      {...rest}
    />
  );
}
