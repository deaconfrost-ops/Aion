/**
 * Cross-cutting domain types shared by web + api (DTOs, enums mirrored from
 * Prisma, API response shapes). Module-specific types live with their module.
 */

/** Money is always integer minor units (cents) to avoid float drift. */
export type Cents = number;

export interface Money {
  cents: Cents;
  currency: 'CAD' | 'USD';
}

/** A quantity always carries its unit. */
export interface Quantity {
  value: number;
  unit: string; // 'g', 'ml', 'each'
}

export interface ApiError {
  statusCode: number;
  message: string;
  code?: string;
}
