const expect = require('expect')

const {isRealString} = require('./../utils/validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(true)).toBe(false);
    expect(isRealString(2)).toBe(false);
    expect(isRealString({})).toBe(false);
    expect(isRealString(function(){})).toBe(false);
  });
  it('should reject string with only space', () => {
    expect(isRealString('    ')).toBe(false);
  });
  it('should allow string with non-space characters', () => {
    expect(isRealString('  afd  adsf')).toBe(true);
  });
});
