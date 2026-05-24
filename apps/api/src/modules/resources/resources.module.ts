import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const resourcesManifest: ModuleManifest = defineModule({
  key: 'resources',
  title: 'Bookable Resources',
  layer: 'shared',
  dependsOn: [],
  entitlement: 'module.resources',
  permissions: [
    { key: 'resources:resource:read', description: 'View resources', defaultRoles: ['owner', 'manager', 'employee'] },
    { key: 'resources:resource:write', description: 'Manage resources', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'resources', label: 'Resources', href: '/resources', requires: 'resources:resource:read' }],
});

/**
 * SHARED/resources — generic bookable physical things: salon chairs/stations,
 * clinic rooms, restaurant tables, gym equipment. A "chair" is just a Resource
 * of type `station`; the salon niche adds the stylist-assignment rules on top.
 * Typically paired with `scheduling`.
 */
@Module({})
export class ResourcesModule {}
