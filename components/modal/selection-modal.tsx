import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { SelectionState } from '@/types';
import { sleep } from '@/utils';

export default function SelectionModal({
  state,
  setState,
}: {
  state: SelectionState;
  setState: (value: SelectionState) => void;
}) {
  const [tempValue, setTempValue] = useState(state.value);

  async function doSelect(value: string) {
    setTempValue(value);
    await sleep(250);
    state.onConfirm?.(value);
    setState({ ...state, visible: false });
  }

  useEffect(() => {
    setTempValue(state.value);
  }, [state.value, state.visible]);

  return (
    <Modal
      visible={state.visible}
      transparent
      animationType="slide"
      onRequestClose={() => setState({ ...state, visible: false })}
    >
      <View style={styles.overlay}>
        <Pressable onPress={() => setState({ ...state, visible: false })} style={StyleSheet.absoluteFill} />
        <View style={styles.container}>
          <Text style={styles.title}>{state.title}</Text>
          <FlatList
            data={state.options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => doSelect(item.value)}
                style={[styles.option, tempValue === item.value && styles.optionSelected]}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                {tempValue === item.value && <Text style={styles.selectedText}>已选</Text>}
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  optionSelected: {
    backgroundColor: '#F1F5F9',
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#1e40af',
    fontWeight: '600',
  },
});
