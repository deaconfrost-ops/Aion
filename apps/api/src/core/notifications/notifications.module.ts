import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const notificationsManifest: ModuleManifest = defineModule({
  key: 'notifications',
  title: 'Notifications',
  layer: 'core',
  dependsOn: [],
  permissions: [],
  events: { emits: [], consumes: [] },
});

/**
 * CORE/notifications — email / SMS / in-app / push fan-out used by every module.
 * Other modules request a notification; channel selection + delivery live here.
 * TODO(Phase 1): email + in-app channels; SMS (Twilio) + push later.
 */
@Module({})
export class NotificationsModule {}
