import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { SelectionState } from '@/types';

export default function SelectionModal({
  state,
  setState,
}: {
  state: SelectionState;
  setState: (value: SelectionState) => void;
}) {
  const [tempValue, setTempValue] = useState(state.value);

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
        <View style={styles.container}>
          <Text style={styles.title}>{state.title}</Text>
          <FlatList
            data={state.options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setTempValue(item.value)}
                style={[styles.option, tempValue === item.value && styles.optionSelected]}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                {tempValue === item.value && <Text style={styles.selectedText}>已选</Text>}
              </Pressable>
            )}
          />
          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={() => setState({ ...state, visible: false })}>
              <Text>取消</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={() => {
                state.onConfirm?.(tempValue);
                setState({ ...state, visible: false });
              }}
            >
              <Text style={styles.confirmButtonText}>确定</Text>
            </Pressable>
          </View>
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1e40af',
  },
  confirmButtonText: {
    color: '#fff',
  },
});
