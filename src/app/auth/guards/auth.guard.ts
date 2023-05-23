import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {

  constructor(private authService: AuthService,
              private router : Router) { }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    console.log('Can Match');
    console.log({ route, segments });

    return this.checkOutStatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log('Can activate');
    console.log({ route, state });

    return this.checkOutStatus();
  }

  private checkOutStatus(): Observable<boolean> | boolean {
    return this.authService.checkAutentication()
      .pipe(
        tap(isAuthenticated => {
          if (!isAuthenticated){
            this.router.navigate(['auth/login']);
          }
        })
      )
  }
}
