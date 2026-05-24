import { Injectable } from '@nestjs/common';
import { Events, type DomainEvent } from '@aion/module-kit';
import { PrismaService } from '../../common/prisma.service.js';
import { InProcessEventBus } from '../../common/event-bus.js';

interface StockLowPayload {
  inventoryItemId: string;
  onHand: number;
}

/**
 * Purchasing behaviour. Subscribes to `stock.low` from inventory, finds the
 * preferred supplier for that item, and drafts a purchase order — the
 * "contact provider X for item Y" flow from the brief. Owner approval and
 * receiving (which re-emits to inventory) are added in Phase 2.
 */
@Injectable()
export class ProvidersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bus: InProcessEventBus,
  ) {
    this.bus.on<StockLowPayload>(Events.StockLow, (e) => this.onStockLow(e));
  }

  private async onStockLow(event: DomainEvent<StockLowPayload>): Promise<void> {
    // TODO(Phase 2): look up preferred ProvItemSupplier for the item, create a
    // draft ProvPurchaseOrder, then emit PurchaseOrderDrafted for notifications.
    void this.prisma;
    void event.payload.inventoryItemId;
  }

  async draftPurchaseOrder(): Promise<void> {
    void Events.PurchaseOrderDrafted;
  }
}
