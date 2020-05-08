import { Injectable, Type } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private msgService: MessageService, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log(`Fetched Heroes`)),
      catchError(this.handleErrors<Hero[]>('getHeroes', [])));
  }


  getHeroesById(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`Fetched Hero with Id : ${id}`)),
      catchError(
        this.handleErrors<Hero>('getHeroesById ${id}')
      ));
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`Updated Hero with Id : ${hero.id}`)),
      catchError(
        this.handleErrors<any>('updateHero ${hero.id}')
      ));
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(newHero => this.log(`Added New Hero with Id: ${newHero.id}`)),
      catchError(this.handleErrors<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const deleteUrl = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(deleteUrl, this.httpOptions).pipe(
      tap(_ => this.log(`Hero with id : ${id} is deleted.`)),
      catchError(this.handleErrors<Hero>('deleteHero'))
    );
  }

  searchHero(term: string): Observable<Hero[]> {
    if (!term.trim()) { return of([]); }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(data => {
        data.length ? this.log(`Data Fetched for the term ${term}`) : this.log(`No data Fetched for the term ${term}`);
      }),
      catchError(this.handleErrors<Hero[]>('searchHero'))
    );
  }
  handleErrors<T>(operation = 'operation', result?: T) {
    return (error: any) => {
      console.error(error);
      this.log(`${operation} failed with error : ${error.message} `);
      return of(result as T);
    };
  }

  log(msg): void {
    this.msgService.add(msg);
  }
}

