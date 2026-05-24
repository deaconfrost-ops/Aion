import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const foodBrokerManifest: ModuleManifest = defineModule({
  key: 'food-broker',
  title: 'Food Broker / Warehouse',
  layer: 'niche',
  dependsOn: ['inventory', 'providers', 'crm', 'analytics'],
  entitlement: 'niche.food-broker',
  permissions: [
    { key: 'food-broker:catalog:write', description: 'Manage wholesale catalog', defaultRoles: ['owner', 'manager'] },
    { key: 'food-broker:order:write', description: 'Manage B2B orders', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'catalog', label: 'Catalog', href: '/catalog', requires: 'food-broker:catalog:write' }],
});

/**
 * NICHE/food-broker — wholesale catalog, ingredient/product lots, B2B orders.
 * The one other niche that reuses the restaurant Ingredients/BoM concept (a case
 * pack is a "recipe" of units); inventory + providers carry the rest. TODO(Phase 5).
 */
@Module({})
export class FoodBrokerModule {}
