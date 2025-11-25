import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, {
  BlueSlider,
  colorKit,
  GreenSlider,
  OpacitySlider,
  PreviewText,
  RedSlider,
  Swatches,
} from 'reanimated-color-picker';
import Divider from '@/components/ui/Divider';
import BaseModal from '@/components/ui/BaseModal';
import { CheckIcon } from 'lucide-react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useStore from '@/store';
import { getTextColorForHex } from '@/utils';

// generate 6 random colors for swatches
const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

type Props = {
  buttonWidth: number;
  isCustomColor?: boolean;
  onChange: (color: string) => void;
  onClose?: () => void;
}
export default function CustomColorPicker({
  buttonWidth,
  isCustomColor = false,
  onChange,
  onClose,
}: Props) {
  const { customColor, setCustomColor } = useStore();
  const [ resultColor, setResultColor ] = useState<string>(customColor);
  const textColor = useMemo<string>(() => {
    return getTextColorForHex(customColor);
  }, [customColor])

  const currentColor = useSharedValue(customColor);

  function onModalClose() {
    onClose?.();
  }
  // runs on the ui thread on color change
  function onColorChange(color: ColorFormatsObject) {
    'worklet';
    currentColor.value = color.hex;
  }
  // runs on the js thread on color pick
  function onColorPick(color: ColorFormatsObject) {
    setResultColor(color.hex);
    setCustomColor(color.hex);
    onChange(color.hex);
  }

  return (
    <BaseModal
      backgroundColor={currentColor}
      button={<View
        className="h-16 rounded justify-center items-center"
        style={{ backgroundColor: customColor || '#eee', width: buttonWidth }}
      >
        {isCustomColor
          ? <CheckIcon color={textColor} size="32" />
          : <Text style={{ color: textColor }}>Custom color</Text>
        }
      </View>}
      onClose={onModalClose}
    >
      <ThemedView className="self-center w-72 p-5 rounded shadow">
        <ColorPicker
          value={resultColor}
          sliderThickness={25}
          thumbSize={24}
          thumbShape='circle'
          onChange={onColorChange}
          onCompleteJS={onColorPick}
          thumbAnimationDuration={100}
          style={{
            gap: 20,
          }}
          adaptSpectrum
          boundedThumb
        >
          <View>
            <ThemedText className="font-bold mb-1 px-1">Red</ThemedText>
            <RedSlider style={colorPickerStyle.sliderStyle}
            />
          </View>

          <View>
            <Text className="font-bold mb-1 px-1">Green</Text>
            <GreenSlider style={colorPickerStyle.sliderStyle} />
          </View>

          <View>
            <Text className="font-bold mb-1 px-1">Blue</Text>
            <BlueSlider style={colorPickerStyle.sliderStyle} />
          </View>

          <View>
            <Text className="font-bold mb-1 px-1">Opacity</Text>
            <OpacitySlider style={colorPickerStyle.sliderStyle} />
          </View>

          <Divider />
          <Swatches
            style={colorPickerStyle.swatchesContainer}
            swatchStyle={colorPickerStyle.swatchStyle}
            colors={customSwatches}
          />
          <Divider />

          <View className="flex-row justify-between">
            <PreviewText style={{ color: '#707070' }} colorFormat='rgba' />
            <PreviewText style={{ color: '#707070' }} colorFormat='hex' />
          </View>
        </ColorPicker>
      </ThemedView>
    </BaseModal>
  );
}

export const colorPickerStyle = StyleSheet.create({
  sliderStyle: {
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  swatchesContainer: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
});
