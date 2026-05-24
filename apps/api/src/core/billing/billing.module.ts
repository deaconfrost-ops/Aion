import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const billingManifest: ModuleManifest = defineModule({
  key: 'billing',
  title: 'Billing & Subscriptions',
  layer: 'core',
  dependsOn: [],
  permissions: [
    { key: 'billing:subscription:manage', description: 'Manage subscription', defaultRoles: ['owner'] },
  ],
  navigation: [{ key: 'billing', label: 'Billing', href: '/billing', requires: 'billing:subscription:manage' }],
});

/**
 * CORE/billing — Stripe subscriptions → the tenant's entitlement set. Those
 * entitlements are what ModuleRegistry intersects against to decide which
 * paid modules a tenant may actually enable.
 * TODO(Phase 1): Stripe customer/subscription sync + webhook → entitlements.
 */
@Module({})
export class BillingModule {}
