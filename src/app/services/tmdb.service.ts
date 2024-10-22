import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '81d8f9656ac86071dc215abb0aa90854';
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  constructor(private http: HttpClient) {}

  getRecentMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}`);
  }

  getUpcomingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}`);
  }

  getNowPlayingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}`);
  }

  getPopularTVShows(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/popular?api_key=${this.apiKey}`);
  }

   getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}`);
   }
  getImageUrl(path: string): string {
    return `${this.imageBaseUrl}${path}`;
  }
}
