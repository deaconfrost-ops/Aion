import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const hrPayrollManifest: ModuleManifest = defineModule({
  key: 'hr-payroll',
  title: 'HR & Payroll',
  layer: 'shared',
  dependsOn: [],
  entitlement: 'module.hr-payroll',
  permissions: [
    { key: 'hr:employee:read', description: 'View employees', defaultRoles: ['owner', 'manager'] },
    { key: 'hr:employee:write', description: 'Manage employees', defaultRoles: ['owner', 'manager'] },
    { key: 'hr:schedule:write', description: 'Edit schedules/shifts', defaultRoles: ['owner', 'manager'] },
    { key: 'hr:timeclock:self', description: 'Clock in/out, request time off', defaultRoles: ['employee', 'manager', 'owner'] },
    { key: 'hr:payroll:run', description: 'Run pay periods', defaultRoles: ['owner'] },
  ],
  navigation: [
    { key: 'team', label: 'Team', href: '/team', requires: 'hr:employee:read' },
    { key: 'payroll', label: 'Payroll', href: '/payroll', requires: 'hr:payroll:run' },
  ],
  widgets: [{ key: 'attendance', title: 'Attendance today', component: 'hr.AttendanceToday' }],
});

/**
 * SHARED/hr-payroll — employees, schedules/shifts, time tracking, clock in/out,
 * time-off, pay runs and payslips. Available to every niche.
 *
 * QUEBEC PAYROLL: the deduction engine takes a *pluggable jurisdiction ruleset*.
 * Quebec rules (QPP, QPIP, EI, federal + QC income tax, vacation pay 4%/6%,
 * CNESST) are held as DATED, VERSIONED config in the `PayrollRuleset` table —
 * never hard-coded constants — so rate changes are data, not code. Detailed
 * rules will be supplied later (DEVELOPMENT_PLAN Phase 3).
 */
@Module({})
export class HrPayrollModule {}
