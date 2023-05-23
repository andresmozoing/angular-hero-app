import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map, of, tap } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth-service.service';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanActivate , CanMatch{

  constructor(private authGuard :AuthGuard,
              private authService : AuthService,
              private router : Router) { }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean>  {
    console.log("canMatch de Public");
    return this.checkOutStatus()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("canActivate de Public");
    return this.checkOutStatus()
  }

  private checkOutStatus () : boolean | Observable<boolean>{
    return  this.authService.checkAutentication()
      .pipe(
        tap(isAuthenticated => {
          console.log("isAuthenticated de public " , isAuthenticated);

          if (isAuthenticated){
            this.router.navigate(['./']);
          }
        }),
        map(isAuthenticated =>  isAuthenticated = !isAuthenticated)
      )
    //console.log("isAuth es " , isAuth);

    // if (isAuth){ //Si ya esta logueado, no quiero que vuelva al auth
    //   console.log("Va a retornar FALSE, no lo deja entrar");

    //   return of(false)
    // }else{
    //   console.log("Va a retornar TRUE, no lo deja entrar");

    //   return of(true)
    // }
  }
}
