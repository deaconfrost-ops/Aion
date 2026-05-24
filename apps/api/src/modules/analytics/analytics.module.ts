import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const analyticsManifest: ModuleManifest = defineModule({
  key: 'analytics',
  title: 'Analytics',
  layer: 'shared',
  dependsOn: [],
  entitlement: 'module.analytics',
  permissions: [{ key: 'analytics:report:read', description: 'View analytics', defaultRoles: ['owner', 'manager'] }],
  navigation: [{ key: 'analytics', label: 'Analytics', href: '/analytics', requires: 'analytics:report:read' }],
  widgets: [{ key: 'revenue-trend', title: 'Revenue trend', component: 'analytics.RevenueTrend' }],
});

/**
 * SHARED/analytics — cross-module metrics (revenue, retention, booking trends,
 * employee productivity, lead conversion, food-cost %), interactive charts and
 * exports. Reads from other modules via published query interfaces, never deep
 * imports. Available to every niche.
 */
@Module({})
export class AnalyticsModule {}
