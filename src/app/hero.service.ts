import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  constructor(private messageService: MessageService,
    private http: HttpClient) { 

  }

 /** GET heroes from the server */
getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.addMessage('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
}

  getHeroes2() : Observable<Hero[]> {
    const heroes = of(HEROES);
    this.addMessage('HeroService: fetched heroes');
    return heroes;
  }

  getHeroes3() : Observable<Hero[]> {
    const heroes = new Observable<Hero[]>((subscriber) => {
        subscriber.next(HEROES);
    });
    this.addMessage('HeroService: fetched heroes');
    return heroes;
  }

   /** GET hero by id. Will 404 if id not found */
getHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${id}`;
  return this.http.get<Hero>(url).pipe(
    tap(_ => this.addMessage(`fetched hero id=${id}`)),
    catchError(this.handleError<Hero>(`getHero id=${id}`))
  );
}

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.addMessage(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

  private addMessage(message : string) {
    if(message) {
      this.messageService.add(message);
    }
  }
}
