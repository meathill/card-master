import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Image,
  Animated
} from 'react-native';
import { SelectionState } from '@/types';

export default function SelectionModal({ state, setState }: { state: SelectionState; setState: (value: SelectionState) => void }) {
  const [tempValue, setTempValue] = useState(state.value);

  useEffect(() => {
    setTempValue(state.value);
  }, [state.value, state.visible]);

  return (
    <Modal visible={state.visible} transparent animationType="slide" onRequestClose={() => setState({ ...state, visible: false })}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-2xl p-4">
          <Text className="text-lg font-semibold mb-4">{state.title}</Text>
          <FlatList
            data={state.options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setTempValue(item.value)}
                className={`flex-row items-center justify-between p-3 rounded-xl mb-2 ${
                  tempValue === item.value ? 'bg-slate-100' : 'bg-white'
                }`}
              >
                <Text className="text-base">{item.label}</Text>
                {tempValue === item.value && <Text className="text-primary font-semibold">已选</Text>}
              </Pressable>
            )}
          />
          <View className="flex-row justify-end mt-2 space-x-3">
            <Pressable
              className="px-4 py-2 rounded-xl bg-gray-200"
              onPress={() => setState({ ...state, visible: false })}
            >
              <Text>取消</Text>
            </Pressable>
            <Pressable
              className="px-4 py-2 rounded-xl bg-primary"
              onPress={() => {
                state.onConfirm?.(tempValue);
                setState({ ...state, visible: false });
              }}
            >
              <Text className="text-white">确定</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
