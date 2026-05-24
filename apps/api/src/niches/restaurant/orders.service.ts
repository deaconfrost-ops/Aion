import { Injectable } from '@nestjs/common';
import { Events } from '@aion/module-kit';
import { InProcessEventBus } from '../../common/event-bus.js';
import { currentTenant } from '../../common/tenant-context.js';
import { RecipeService } from './recipe.service.js';

export type OrderType = 'dine_in' | 'takeout' | 'delivery';

export interface OrderLineInput {
  menuItemId: string;
  count: number;
}

/**
 * Orders — the niche's write path and the trigger for the whole cross-module
 * chain. When an order closes, it explodes each menu item into the inventory
 * lines its recipe consumes and emits ONE `sale.completed` event. Inventory
 * decrements stock; if anything crosses its reorder point, providers drafts a
 * PO. Orders knows nothing about stock levels or suppliers — only its recipes.
 */
@Injectable()
export class OrdersService {
  constructor(
    private readonly recipes: RecipeService,
    private readonly bus: InProcessEventBus,
  ) {}

  async closeOrder(type: OrderType, lines: OrderLineInput[]): Promise<void> {
    const { tenantId } = currentTenant();

    const inventoryLines = (
      await Promise.all(lines.map((l) => this.recipes.explodeToInventoryLines(l.menuItemId, l.count)))
    ).flat();

    // TODO(Phase 2): persist RestOrder + RestOrderLine (type, totals) first.
    void type;

    await this.bus.emit({
      name: Events.SaleCompleted,
      tenantId,
      source: 'restaurant',
      payload: { lines: inventoryLines },
    });
  }
}
