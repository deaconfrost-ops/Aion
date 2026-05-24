import type { Type } from '@nestjs/common';
import type { ModuleKey, ModuleManifest } from '@aion/module-kit';

// CORE
import { AuthModule, authManifest } from '../core/auth/auth.module.js';
import { TenancyModule, tenancyManifest } from '../core/tenancy/tenancy.module.js';
import { RbacModule, rbacManifest } from '../core/rbac/rbac.module.js';
import { BillingModule, billingManifest } from '../core/billing/billing.module.js';
import {
  NotificationsModule,
  notificationsManifest,
} from '../core/notifications/notifications.module.js';
import { AuditModule, auditManifest } from '../core/audit/audit.module.js';
import { AiModule, aiManifest } from '../core/ai/ai.module.js';

// SHARED
import { InventoryModule, inventoryManifest } from '../modules/inventory/inventory.module.js';
import { ProvidersModule, providersManifest } from '../modules/providers/providers.module.js';
import { SchedulingModule, schedulingManifest } from '../modules/scheduling/scheduling.module.js';
import { ResourcesModule, resourcesManifest } from '../modules/resources/resources.module.js';
import { CrmModule, crmManifest } from '../modules/crm/crm.module.js';
import { HrPayrollModule, hrPayrollManifest } from '../modules/hr-payroll/hr-payroll.module.js';
import { ReviewsModule, reviewsManifest } from '../modules/reviews/reviews.module.js';
import { AnalyticsModule, analyticsManifest } from '../modules/analytics/analytics.module.js';

// NICHES
import { RestaurantModule, restaurantManifest } from '../niches/restaurant/restaurant.module.js';
import { SalonModule, salonManifest } from '../niches/salon/salon.module.js';
import { GymModule, gymManifest } from '../niches/gym/gym.module.js';
import { CleaningModule, cleaningManifest } from '../niches/cleaning/cleaning.module.js';
import { ClinicModule, clinicManifest } from '../niches/clinic/clinic.module.js';
import {
  FoodBrokerModule,
  foodBrokerManifest,
} from '../niches/food-broker/food-broker.module.js';

interface ModuleEntry {
  manifest: ModuleManifest;
  nestModule: Type;
}

/**
 * The single source of truth pairing each module's manifest (data) with its
 * NestJS module (runtime). The registry uses manifests to resolve which modules
 * a tenant runs; the gate uses this table to know which module owns a route.
 */
export const MODULE_TABLE: ModuleEntry[] = [
  // core
  { manifest: authManifest, nestModule: AuthModule },
  { manifest: tenancyManifest, nestModule: TenancyModule },
  { manifest: rbacManifest, nestModule: RbacModule },
  { manifest: billingManifest, nestModule: BillingModule },
  { manifest: notificationsManifest, nestModule: NotificationsModule },
  { manifest: auditManifest, nestModule: AuditModule },
  { manifest: aiManifest, nestModule: AiModule },
  // shared
  { manifest: inventoryManifest, nestModule: InventoryModule },
  { manifest: providersManifest, nestModule: ProvidersModule },
  { manifest: schedulingManifest, nestModule: SchedulingModule },
  { manifest: resourcesManifest, nestModule: ResourcesModule },
  { manifest: crmManifest, nestModule: CrmModule },
  { manifest: hrPayrollManifest, nestModule: HrPayrollModule },
  { manifest: reviewsManifest, nestModule: ReviewsModule },
  { manifest: analyticsManifest, nestModule: AnalyticsModule },
  // niches
  { manifest: restaurantManifest, nestModule: RestaurantModule },
  { manifest: salonManifest, nestModule: SalonModule },
  { manifest: gymManifest, nestModule: GymModule },
  { manifest: cleaningManifest, nestModule: CleaningModule },
  { manifest: clinicManifest, nestModule: ClinicModule },
  { manifest: foodBrokerManifest, nestModule: FoodBrokerModule },
];

export const ALL_MANIFESTS: ModuleManifest[] = MODULE_TABLE.map((e) => e.manifest);

export const ALL_NEST_MODULES: Type[] = MODULE_TABLE.map((e) => e.nestModule);

export const NEST_MODULE_BY_KEY: Record<ModuleKey, Type> = Object.fromEntries(
  MODULE_TABLE.map((e) => [e.manifest.key, e.nestModule]),
) as Record<ModuleKey, Type>;
