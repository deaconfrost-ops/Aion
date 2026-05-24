import { Module } from '@nestjs/common';
import { defineModule, Events, type ModuleManifest } from '@aion/module-kit';

export const schedulingManifest: ModuleManifest = defineModule({
  key: 'scheduling',
  title: 'Scheduling & Appointments',
  layer: 'shared',
  dependsOn: [],
  entitlement: 'module.scheduling',
  permissions: [
    { key: 'scheduling:appointment:read', description: 'View calendar', defaultRoles: ['owner', 'manager', 'employee'] },
    { key: 'scheduling:appointment:write', description: 'Book/edit appointments', defaultRoles: ['owner', 'manager', 'employee'] },
  ],
  navigation: [{ key: 'calendar', label: 'Calendar', href: '/calendar', requires: 'scheduling:appointment:read' }],
  widgets: [{ key: 'upcoming', title: 'Upcoming appointments', component: 'scheduling.Upcoming' }],
  events: { emits: [Events.AppointmentBooked, Events.AppointmentNoShow], consumes: [] },
});

/**
 * SHARED/scheduling — calendar, appointments, recurring slots, buffer times,
 * public booking page, reminders. Pairs with `resources` to book a specific
 * chair/room/employee. Used by salon, gym, clinic.
 */
@Module({})
export class SchedulingModule {}
