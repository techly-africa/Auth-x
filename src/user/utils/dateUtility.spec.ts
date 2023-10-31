import { getExpiry, isTokenExpired } from './dateUtility';

describe('getExpiry', () => {
  it('should return a Date object 3 minutes in the future', () => {
    const now = new Date();
    const expectedExpiry = new Date(now.getTime() + 3 * 60 * 1000);
    const result = getExpiry();
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeCloseTo(expectedExpiry.getTime(), -1);
  });
});

describe('isTokenExpired', () => {
  it('should return true if the expiry date is in the past', () => {
    const pastDate = new Date('2023-10-26T12:00:00Z');
    const result = isTokenExpired(pastDate);
    expect(result).toBe(true);
  });
});
