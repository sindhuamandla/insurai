import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../Auth/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  const expectedRoles = route.data['roles'] as string[];
  if (expectedRoles && expectedRoles.length > 0) {
    const userRole = authService.getRole();
    if (!userRole || !expectedRoles.includes(userRole)) {
      // Redirect based on role if unauthorized for specific page, or just home
      return router.parseUrl('/');
    }
  }

  return true;
};
