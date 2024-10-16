import { generateInvitationCode } from '../../../src/utils/generate-inv-code.util';

describe('Generate Invitation Code Utility', () => {
  it('should generate a code of the specified length', () => {
    const code = generateInvitationCode();
    expect(code.length).toBe(6); // Default length

    const customLengthCode = generateInvitationCode(10);
    expect(customLengthCode.length).toBe(10);
  });

  it('should generate unique codes', () => {
    const code1 = generateInvitationCode();
    const code2 = generateInvitationCode();
    expect(code1).not.toBe(code2);
  });

  it('should only contain alphanumeric characters', () => {
    const code = generateInvitationCode();
    expect(code).toMatch(/^[A-Za-z0-9]+$/);
  });
});