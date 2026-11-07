/**
 * Dates are written the American way: "November 7th, 2026". Read in UTC, because a post's
 * date is a plain day (2026-11-07 parses as midnight UTC) and must not slip a day with
 * the machine's time zone.
 */
const ordinal = (n: number) => {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]}`;
};

const month = (d: Date, style: 'long' | 'short') => d.toLocaleDateString('en-US', { month: style, timeZone: 'UTC' });

/** November 7th, 2026 */
export const longDate = (d: Date) => `${month(d, 'long')} ${ordinal(d.getUTCDate())}, ${d.getUTCFullYear()}`;

/** Nov 7th, 2026 */
export const shortDate = (d: Date) => `${month(d, 'short')} ${ordinal(d.getUTCDate())}, ${d.getUTCFullYear()}`;

/** Nov 2026 */
export const monthYear = (d: Date) => `${month(d, 'short')} ${d.getUTCFullYear()}`;
