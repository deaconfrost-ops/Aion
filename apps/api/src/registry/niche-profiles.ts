import { DEFAULT_ROLES, type NicheKey, type NicheProfile } from '@aion/module-kit';

/**
 * Niche profiles — each is a thin composition listing the shared modules it
 * enables plus its own niche module. This is the only place the "what does a
 * restaurant get?" question is answered.
 */
export const NICHE_PROFILES: Record<NicheKey, NicheProfile> = {
  restaurant: {
    key: 'restaurant',
    title: 'Restaurant',
    enables: ['inventory', 'providers', 'resources', 'crm', 'hr-payroll', 'analytics'],
    nicheModule: 'restaurant',
    defaultRoles: DEFAULT_ROLES,
  },
  salon: {
    key: 'salon',
    title: 'Salon / Hairdresser',
    enables: ['resources', 'scheduling', 'crm', 'hr-payroll', 'reviews', 'analytics'],
    nicheModule: 'salon',
    defaultRoles: DEFAULT_ROLES,
  },
  gym: {
    key: 'gym',
    title: 'Gym',
    enables: ['scheduling', 'crm', 'hr-payroll', 'analytics'],
    nicheModule: 'gym',
    defaultRoles: DEFAULT_ROLES,
  },
  cleaning: {
    key: 'cleaning',
    title: 'Cleaning Company',
    enables: ['scheduling', 'crm', 'hr-payroll', 'inventory', 'analytics'],
    nicheModule: 'cleaning',
    defaultRoles: DEFAULT_ROLES,
  },
  clinic: {
    key: 'clinic',
    title: 'Clinic',
    enables: ['scheduling', 'resources', 'crm', 'hr-payroll', 'inventory', 'analytics'],
    nicheModule: 'clinic',
    defaultRoles: DEFAULT_ROLES,
  },
  'food-broker': {
    key: 'food-broker',
    title: 'Food Broker / Warehouse',
    enables: ['inventory', 'providers', 'crm', 'analytics'],
    nicheModule: 'food-broker',
    defaultRoles: DEFAULT_ROLES,
  },
};
