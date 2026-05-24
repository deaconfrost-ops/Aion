import { Injectable } from '@nestjs/common';
import type { DomainEvent, EventBus, EventHandler } from '@aion/module-kit';

/**
 * In-process event bus — the default cross-module channel. Modules emit/consume
 * by event name and never import each other across a layer boundary. Swap this
 * for a Redis/queue-backed bus later without touching any module code.
 */
@Injectable()
export class InProcessEventBus implements EventBus {
  private readonly handlers = new Map<string, EventHandler[]>();

  async emit<T>(event: Omit<DomainEvent<T>, 'at'>): Promise<void> {
    const full: DomainEvent<T> = { ...event, at: new Date().toISOString() };
    const subs = this.handlers.get(full.name) ?? [];
    await Promise.all(subs.map((h) => h(full as DomainEvent)));
  }

  on<T>(name: string, handler: EventHandler<T>): void {
    const list = this.handlers.get(name) ?? [];
    list.push(handler as EventHandler);
    this.handlers.set(name, list);
  }
}
