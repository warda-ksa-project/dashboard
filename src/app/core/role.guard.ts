import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Roles } from '../conts';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as Roles[];
  const userRole = localStorage.getItem('role') as Roles;

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return true;
  }

  // لو Trader حاول يدخل Admin URL
  if (userRole === Roles.trader) {
    router.navigate(['/dashboard-trader']);
  } else {
    router.navigate(['/dashboard-admin']);
  }

  return false;
};
