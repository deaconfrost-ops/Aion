import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { currentTenantOrNull } from './tenant-context.js';

/** Models that are NOT tenant-scoped (global tables). */
const GLOBAL_MODELS = new Set(['Tenant', 'User', 'PayrollRuleset']);

/**
 * Prisma client with a tenant-isolation middleware: it injects `tenantId` from
 * the request context into every create/read/update/delete, so module code never
 * hand-writes a tenant filter and can't accidentally leak across tenants.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    this.$use(async (params, next) => {
      const ctx = currentTenantOrNull();
      const model = params.model;

      if (ctx && model && !GLOBAL_MODELS.has(model)) {
        if (['findMany', 'findFirst', 'count', 'updateMany', 'deleteMany'].includes(params.action)) {
          params.args ??= {};
          params.args.where = { ...params.args.where, tenantId: ctx.tenantId };
        }
        if (['create'].includes(params.action)) {
          params.args.data = { ...params.args.data, tenantId: ctx.tenantId };
        }
      }
      return next(params);
    });

    await this.$connect();
  }
}
