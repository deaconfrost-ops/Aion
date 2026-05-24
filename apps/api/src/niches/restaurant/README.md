# niches/restaurant

The reference niche. Demonstrates the whole AION thesis: a niche is a thin layer of
domain-specific logic over shared modules.

## What's restaurant-only (lives here)

- **MenuItem** — a sellable dish with a price (`menu.service.ts`).
- **Recipe / Bill of Materials** — the ingredients a menu item consumes, each line pointing
  at a shared `inventory` Item (`recipe.service.ts`). *Pizza → 200g flour + 150g sauce + …*
- **Plate cost & margin** — rolled up from inventory unit costs.
- **Orders** — order types (dine-in/takeout/delivery) and the close-order flow
  (`orders.service.ts`).

## What it reuses (shared modules, unchanged)

| Need                         | Shared module |
|------------------------------|---------------|
| Stock of flour/cheese/etc.   | `inventory`   |
| Suppliers + purchase orders  | `providers`   |
| Tables                       | `resources`   |
| Customers / loyalty          | `crm`         |
| Staff + Quebec payroll       | `hr-payroll`  |
| Food-cost %, revenue         | `analytics`   |

## The cross-module chain (no deep imports — events only)

```
OrdersService.closeOrder()
  → explode recipes into inventory lines
  → emit  sale.completed
        → inventory decrements stock per line
        → emit stock.low  (item below reorder point)
              → providers drafts a PO to the preferred supplier
```

Swap this niche for a tools-and-equipment retailer and the inventory→providers half is
byte-for-byte identical — only the Recipe step disappears. That reuse is the architecture's
acceptance test.

> **Ingredients do not graduate to a shared module.** They're reused only by `food-broker`,
> which imports the same recipe/BoM concept; everyone else gets plain `inventory`.
