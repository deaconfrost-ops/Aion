import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import { RecipeService } from './recipe.service.js';

/**
 * MenuItems (e.g. "Margherita", "Pepperoni") and their pricing. Each menu item
 * has a Recipe; selling price vs. plate cost gives the margin surfaced in
 * analytics' food-cost widget.
 */
@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recipes: RecipeService,
  ) {}

  /** Margin % = (price − plate cost) / price. */
  async margin(menuItemId: string, price: number): Promise<number> {
    const cost = await this.recipes.plateCost(menuItemId);
    return price > 0 ? (price - cost) / price : 0;
  }
}
