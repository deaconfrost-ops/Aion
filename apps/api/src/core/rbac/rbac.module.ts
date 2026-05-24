import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const rbacManifest: ModuleManifest = defineModule({
  key: 'rbac',
  title: 'Roles & Permissions',
  layer: 'core',
  dependsOn: [],
  permissions: [],
});

/**
 * CORE/rbac — Owner/Manager/Employee roles + the permission registry. Every
 * module registers its `permissions` here at boot; routes are checked per
 * request against `(tenantId, userId) → role → permissions`.
 * TODO(Phase 1): PermissionsGuard + role assignment.
 */
@Module({})
export class RbacModule {}
