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
    return this.http.get(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=pt-BR&`);
  }


   searchMovies(query: string): Observable<any> {
      return this.http.get<any>(
        `${this.apiUrl}/search/multi?api_key=${this.apiKey}&language=pt-BR& &query=${query}`
      );
    }

  getUpcomingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}&language=pt-BR&`);
  }

  getNowPlayingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=pt-BR&`);
  }

  getTvShows(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/popular?api_key=${this.apiKey}&language=pt-BR&`);
  }

   getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=pt-BR&`);
   }
  getImageUrl(path: string): string {
    return `${this.imageBaseUrl}${path}&language=pt-BR&`;
  }
}
