import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const reviewsManifest: ModuleManifest = defineModule({
  key: 'reviews',
  title: 'Review Management',
  layer: 'shared',
  dependsOn: [],
  entitlement: 'module.reviews',
  permissions: [
    { key: 'reviews:review:read', description: 'View reviews', defaultRoles: ['owner', 'manager'] },
    { key: 'reviews:request:send', description: 'Send review requests', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'reviews', label: 'Reviews', href: '/reviews', requires: 'reviews:review:read' }],
});

/**
 * SHARED/reviews — automatic review requests, Google review sync, monitoring,
 * negative-feedback filtering, analytics. Used by salon, restaurant, gym.
 */
@Module({})
export class ReviewsModule {}
