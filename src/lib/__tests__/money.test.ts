import { centsToInput, formatMoney, parseMoneyToCents } from '../money';

describe('parseMoneyToCents', () => {
  it('parses plain decimals', () => {
    expect(parseMoneyToCents('12.34')).toBe(1234);
  });

  it('strips currency symbols and separators', () => {
    expect(parseMoneyToCents('$1,234.56')).toBe(123456);
  });

  it('treats zero as a valid amount', () => {
    expect(parseMoneyToCents('0')).toBe(0);
  });

  it('returns null for empty or invalid input', () => {
    expect(parseMoneyToCents('')).toBeNull();
    expect(parseMoneyToCents('abc')).toBeNull();
    expect(parseMoneyToCents('-5')).toBe(500);
  });
});

describe('centsToInput', () => {
  it('formats cents with two decimals', () => {
    expect(centsToInput(4000)).toBe('40.00');
    expect(centsToInput(1234)).toBe('12.34');
  });
});

describe('formatMoney', () => {
  it('formats USD by default', () => {
    expect(formatMoney(4000)).toBe('$40.00');
  });
});
