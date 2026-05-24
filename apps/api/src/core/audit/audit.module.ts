import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const auditManifest: ModuleManifest = defineModule({
  key: 'audit',
  title: 'Audit Log',
  layer: 'core',
  dependsOn: [],
  permissions: [{ key: 'audit:log:read', description: 'View audit log', defaultRoles: ['owner'] }],
});

/**
 * CORE/audit — append-only log of every mutating action, captured by an
 * interceptor so modules don't have to remember to log.
 * TODO(Phase 1): AuditInterceptor writing (tenantId, userId, action, before/after).
 */
@Module({})
export class AuditModule {}
