import { CardData } from "@/types";

export const Qualities = ['N', 'R', 'SR', 'SSR', 'UR'] as const;
export const SkillLevels = ['D', 'C', 'B', 'A', 'S'] as const;

export function createDefaultCard(): CardData {
  return {
    name: '卡牌名称',
    subtitle: '卡牌副标题或称号',
    quality: 'SSR',
    imageUri: undefined,
    skills: [
      { title: '', content: '', level: 'A' },
      { title: '', content: '', level: 'A' }
    ]
  };
}
