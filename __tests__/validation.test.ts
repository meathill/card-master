import { filterVisibleSkills, truncateText, validateFeedback } from '@/utils/validation';

describe('truncateText', () => {
  it('limits text to the provided max length', () => {
    expect(truncateText('123456', 3)).toBe('123');
  });

  it('returns the same text when within limit', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });
});

describe('validateFeedback', () => {
  it('requires content', () => {
    expect(validateFeedback('')).toEqual({ valid: false, error: '请填写内容' });
  });

  it('rejects long content', () => {
    const overLimit = 'a'.repeat(1001);
    expect(validateFeedback(overLimit)).toEqual({ valid: false, error: '内容不能超过1000字' });
  });

  it('accepts valid content', () => {
    expect(validateFeedback('谢谢')).toEqual({ valid: true, error: null });
  });
});

describe('filterVisibleSkills', () => {
  it('keeps skills with title or content', () => {
    const skills = [
      { title: 'A', content: '', level: 'A' },
      { title: '', content: 'desc', level: 'B' },
      { title: '', content: '', level: 'C' },
    ];

    expect(filterVisibleSkills(skills)).toEqual([
      { title: 'A', content: '', level: 'A' },
      { title: '', content: 'desc', level: 'B' },
    ]);
  });
});
