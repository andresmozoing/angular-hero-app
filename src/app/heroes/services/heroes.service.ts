import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }


  getHeroes():Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroById( id: string ): Observable<Hero|undefined> {
    return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit=6`);
  }

  addHero( hero : Hero) : Observable<Hero> {
    let url = this.baseUrl + '/heroes'
    return this.http.post<Hero>(url,hero)
  }

  updateHero( hero : Hero) : Observable<Hero> {
    if (!hero.id){
      throw Error("Hero id is required")
    }
    let url = this.baseUrl + '/heroes/' + hero.id
    return this.http.patch<Hero>(url,hero)
  }

  deleteHeroById( id : string) : Observable<boolean> {

    let url = this.baseUrl + '/heroes/' + id

    return this.http.delete(url)
      .pipe(
        catchError(err => of(false)),
        map(resp => true)
      )
  }


}
