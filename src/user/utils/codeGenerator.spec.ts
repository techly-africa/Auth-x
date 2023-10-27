import { generateOTP } from './codeGenerator';

describe('generateOTP', () => {
    it('should generate a string of the specified length', () => {
        const n = 6;
        const otp = generateOTP(n);
        expect(otp).toHaveLength(n);
    });

    it('should only contain digits', () => {
        const n = 6;
        const otp = generateOTP(n);
        const regex = /^[0-9]+$/;
        expect(regex.test(otp)).toBe(true);
    });

    it('should generate a different OTP on subsequent calls', () => {
        const n = 6;
        const otp1 = generateOTP(n);
        const otp2 = generateOTP(n);
        expect(otp1).not.toEqual(otp2);
    });
});
