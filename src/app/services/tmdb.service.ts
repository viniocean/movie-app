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
    return this.http.get<any>(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=pt-BR`);
  }

  searchMovies(query: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/search/multi?api_key=${this.apiKey}&language=pt-BR&query=${query}`
    );
  }

  getUpcomingMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}&language=pt-BR`);
  }

  getNowPlayingMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=pt-BR`);
  }

  getTvShows(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/popular?api_key=${this.apiKey}&language=pt-BR`);
  }

  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=pt-BR`);
  }

  getTvDetails(tvId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/${tvId}?api_key=${this.apiKey}&language=pt-BR`);
  }

  getMovieCredits(movieId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/movie/${movieId}/credits?api_key=${this.apiKey}&language=pt-BR`
    );
  }

  getImageUrl(path: string): string {
    return `${this.imageBaseUrl}${path}`;
  }

  getMovieTitle(movieId: number): Observable<any> {
    return this.getMovieDetails(movieId); 
  }
  getSimilarMovies(movieId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/movie/${movieId}/similar?api_key=${this.apiKey}&language=pt-BR`
    );
  }

  getSimilarTvShows(tvShowId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/tv/${tvShowId}/similar?api_key=${this.apiKey}&language=pt-BR`
    );
  }

  getMoviesByGenre(genreIds: number[], limit: number): Promise<any[]> {
    const genreQuery = genreIds.join(',');
    return this.http
      .get<any>(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreQuery}&sort_by=popularity.desc&page=1&api_key=${this.apiKey}`)
      .toPromise()
      .then(response => response.results.slice(0, limit));
  }
}
