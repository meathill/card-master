import { Qualities, SkillLevels } from "@/constants";

export type Quality = (typeof Qualities)[number];
export type SkillLevel = (typeof SkillLevels)[number];

export type CardData = {
  name: string;
  subtitle: string;
  quality: Quality;
  imageUri?: string;
  skills: Skill[];
};

export type Skill = {
  title: string;
  content: string;
  level: string;
};


export type SelectionOption = { label: string; value: string };

export type SelectionState = {
  title: string;
  options: SelectionOption[];
  value: string;
  visible: boolean;
  onConfirm?: (value: string) => void;
};
