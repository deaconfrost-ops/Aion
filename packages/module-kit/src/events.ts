import type { ModuleKey } from './keys.js';

/** Envelope every cross-module event travels in. Always tenant-scoped. */
export interface DomainEvent<T = unknown> {
  name: string;          // e.g. 'sale.completed'
  tenantId: string;
  source: ModuleKey;     // module that emitted it
  payload: T;
  at: string;            // ISO timestamp
}

export type EventHandler<T = unknown> = (event: DomainEvent<T>) => void | Promise<void>;

/**
 * Minimal event-bus interface modules use to talk across layer boundaries
 * without deep imports. The API provides an in-process implementation now;
 * it can be swapped for Redis/queue later without touching module code.
 */
export interface EventBus {
  emit<T>(event: Omit<DomainEvent<T>, 'at'>): Promise<void>;
  on<T>(name: string, handler: EventHandler<T>): void;
}

/** Well-known event names used across modules (extend per module). */
export const Events = {
  SaleCompleted: 'sale.completed',
  StockMoved: 'stock.moved',
  StockLow: 'stock.low',
  PurchaseOrderDrafted: 'purchase_order.drafted',
  PurchaseOrderReceived: 'purchase_order.received',
  AppointmentBooked: 'appointment.booked',
  AppointmentNoShow: 'appointment.no_show',
} as const;
