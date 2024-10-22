import { Component, OnInit } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // Propriedades que armazenarão os filmes
  recentMovies: any[] = [];
  upcomingMovies: any[] = [];
  nowPlayingMovies: any[] = [];
  popularTVShows: any[] = [];

  constructor(public tmdbService: TmdbService) {}  // TmdbService é agora público para ser acessível no HTML

  // Método de inicialização
  ngOnInit() {
    // Verifique se a API está retornando os filmes recentes
    this.tmdbService.getRecentMovies().subscribe(response => {
      console.log('Filmes Recentes:', response);
      this.recentMovies = response.results;
    }, error => {
      console.error('Erro ao carregar filmes recentes:', error);
    });
  
    // Verifique se a API está retornando os filmes que estão por vir
    this.tmdbService.getUpcomingMovies().subscribe(response => {
      console.log('Filmes Em Breve:', response);
      this.upcomingMovies = response.results;
    }, error => {
      console.error('Erro ao carregar filmes em breve:', error);
    });
  
    // Verifique se a API está retornando os filmes em cartaz
    this.tmdbService.getNowPlayingMovies().subscribe(response => {
      console.log('Filmes Em Cartaz:', response);
      this.nowPlayingMovies = response.results;
    }, error => {
      console.error('Erro ao carregar filmes em cartaz:', error);
    });
  
    // Verifique se a API está retornando as séries populares
    this.tmdbService.getPopularTVShows().subscribe(response => {
      console.log('Séries Populares:', response);
      this.popularTVShows = response.results;
    }, error => {
      console.error('Erro ao carregar séries populares:', error);
    });
  }
  
}
