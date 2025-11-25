import { PropsWithChildren, ReactNode, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { clsx } from 'clsx';
import { XIcon } from 'lucide-react-native';

type BaseModalProps = PropsWithChildren & {
  backgroundColor?: SharedValue<string>;
  button: ReactNode;
  className?: string;
  onClose?: () => void;
};

export default function BaseModal({
  backgroundColor,
  button,
  children,
  className,
  onClose,
}: BaseModalProps) {
  const [showModal, setShowModal] = useState(false);

  const backgroundColorStyle = useAnimatedStyle(() => {
    return { backgroundColor: backgroundColor ? backgroundColor.value : '#aaa' };
  });

  function doClose() {
    setShowModal(false);
    onClose?.();
  }

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
      >
        {button}
      </Pressable>

      <Modal onRequestClose={() => setShowModal(false)} visible={showModal} animationType='slide'>
        <Animated.View
          className={clsx('flex-1', className)}
          style={backgroundColorStyle}
        >
          <View className="flex-1 justify-center">
            {children}
            <Pressable
              className="justify-center items-center mt-6 mx-auto bg-white size-8  rounded-full"
              onPress={doClose}
            >
              <XIcon size={24} />
            </Pressable>
          </View>

        </Animated.View>
      </Modal>
    </>
  );
}
