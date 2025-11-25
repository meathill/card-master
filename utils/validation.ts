export type Skill = {
  title: string;
  content: string;
  level: string;
};

export function truncateText(value: string, maxLength: number): string {
  if (maxLength <= 0) return '';
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

export function validateFeedback(content: string): { valid: boolean; error: string | null } {
  const normalized = content.trim();

  if (!normalized.length) {
    return { valid: false, error: '请填写内容' };
  }

  if (normalized.length > 1000) {
    return { valid: false, error: '内容不能超过1000字' };
  }

  return { valid: true, error: null };
}

export function filterVisibleSkills(skills: Skill[]): Skill[] {
  return skills.filter((skill) => skill.title.trim().length > 0 || skill.content.trim().length > 0);
}
