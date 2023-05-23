import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { environments } from '../../../environments/environments';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private user? : User
  private baseUrl = environments.baseUrl

  constructor(private http: HttpClient) { }

  get currentUser() : User|undefined {
    if (!this.user){
      return undefined
    }
    else{
      return structuredClone(this.user)
    }
  }

  public login (email : string , password : string) : Observable<User> {
    return this.http.get<User>(this.baseUrl + '/users/1')
      .pipe(
        tap( user => {this.user = user}),
        tap( user => {localStorage.setItem('token','dFKsdsfASFEFa23')})
      )
  }

  public logout(){
    localStorage.clear()
  }

  public checkAutentication() : Observable<boolean> {
    if (!localStorage.getItem('token')){
      return of(false)
    }
    else{
      //Verifico q el token sea valido
      const token = localStorage.getItem('token')

      return this.http.get<User>(this.baseUrl + '/users/1')
        .pipe(
          tap(user => this.user = user),
          map(user => !!user),
          catchError(err => of(false))
        )
    }
  }

}
