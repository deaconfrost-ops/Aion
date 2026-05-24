import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const aiManifest: ModuleManifest = defineModule({
  key: 'ai',
  title: 'AI Engine',
  layer: 'core',
  dependsOn: [],
  permissions: [],
  events: {
    emits: [],
    // The automation engine reacts to domain events from other modules.
    consumes: ['appointment.no_show', 'sale.completed'],
  },
});

/**
 * CORE/ai — provider-agnostic LLM client (Claude default), prompt-template
 * registry, and the automation engine that turns domain events into AI actions
 * (no-show recovery, rebooking, upsell, lead follow-up).
 * TODO(Phase 1): AiClient abstraction + prompt registry; automations in Phase 5.
 */
@Module({})
export class AiModule {}
