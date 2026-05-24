import { Injectable } from '@nestjs/common';
import { Events, type DomainEvent } from '@aion/module-kit';
import { PrismaService } from '../../common/prisma.service.js';
import { InProcessEventBus } from '../../common/event-bus.js';

/** Payload emitted by a niche when something is sold/consumed. */
interface SaleCompletedPayload {
  lines: Array<{ inventoryItemId: string; quantity: number }>;
}

/**
 * Core inventory behaviour. The interesting cross-module bit: it subscribes to
 * `sale.completed` (emitted by any niche) and decrements stock per line, then
 * emits `stock.low` when an item crosses its reorder point — which `providers`
 * picks up to draft a purchase order. No niche-specific code lives here.
 */
@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bus: InProcessEventBus,
  ) {
    this.bus.on<SaleCompletedPayload>(Events.SaleCompleted, (e) => this.onSale(e));
  }

  private async onSale(event: DomainEvent<SaleCompletedPayload>): Promise<void> {
    for (const line of event.payload.lines) {
      await this.adjustStock(line.inventoryItemId, -line.quantity, 'sale');
    }
  }

  /** Apply a signed stock delta, record the move, and warn if below reorder point. */
  async adjustStock(itemId: string, delta: number, reason: string): Promise<void> {
    // TODO(Phase 2): wrap in a transaction; persist InvStockMove; update InvStockLevel.
    // const item = await this.prisma.invItem.update({ ... });
    // if (item.onHand <= item.reorderPoint) {
    //   await this.bus.emit({ name: Events.StockLow, tenantId, source: 'inventory',
    //     payload: { inventoryItemId: itemId, onHand: item.onHand } });
    // }
    void this.prisma;
    void { itemId, delta, reason };
  }
}
