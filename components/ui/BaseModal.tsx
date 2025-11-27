import { PropsWithChildren, ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { XIcon } from 'lucide-react-native';

type BaseModalProps = PropsWithChildren & {
  backgroundColor?: SharedValue<string>;
  button: ReactNode;
  onClose?: () => void;
};

export default function BaseModal({
  backgroundColor,
  button,
  children,
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
          style={[styles.modalContainer, backgroundColorStyle]}
        >
          <View style={styles.content}>
            {children}
            <Pressable
              style={styles.closeButton}
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 'auto',
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 9999,
  },
});
