import { Injectable } from '@nestjs/common';
import { InventoryService } from '../../modules/inventory/inventory.service.js';
import { PrismaService } from '../../common/prisma.service.js';

/** One line of a recipe: how much of an inventory item a menu item consumes. */
export interface RecipeLine {
  inventoryItemId: string;
  quantity: number; // in the inventory item's unit (e.g. grams)
}

/**
 * Recipes = the Bill of Materials for a menu item. This is the restaurant-only
 * concept that ties the niche to shared inventory:
 *   pizza "Margherita" → [200g flour, 150g san-marzano, 125g mozzarella, …]
 * Each line points at an inventory Item; plate cost rolls up from those items'
 * unit costs. Reused by the food-broker niche; never promoted to a shared module.
 */
@Injectable()
export class RecipeService {
  constructor(
    private readonly inventory: InventoryService,
    private readonly prisma: PrismaService,
  ) {}

  /** Total ingredient cost of one plate = Σ(line.qty × inventory item unit cost). */
  async plateCost(menuItemId: string): Promise<number> {
    // TODO(Phase 2): load RestRecipeLine[] for the menu item, fetch each
    // InvItem.unitCost, return the weighted sum (money in minor units).
    void this.inventory;
    void this.prisma;
    void menuItemId;
    return 0;
  }

  /** Expand a sold menu item into the inventory lines it consumes (qty × count). */
  async explodeToInventoryLines(
    menuItemId: string,
    count: number,
  ): Promise<RecipeLine[]> {
    // TODO(Phase 2): map RestRecipeLine[] → [{ inventoryItemId, quantity: q*count }]
    void menuItemId;
    void count;
    return [];
  }
}
