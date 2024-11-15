import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { TmdbService } from '../services/tmdb.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  recentMovies: any[] = []; // Filmes Recentes
  upcomingMovies: any[] = []; // Filmes Em Breve
  nowPlayingMovies: any[] = []; // Filmes Em Cartaz
  tvShows: any[] = []; // Séries
  selectedSegment: string = '1'; // Segmento selecionado (inicialmente "Filmes Recentes")
  searchResults: any[] = []; // Resultados da pesquisa
  searchQuery: string = ''; // Armazena o texto da pesquisa

  constructor(
    public tmdbService: TmdbService,
    private router: Router // Adicionar Router no construtor
  ) {}

  ngOnInit() {
    this.loadMovies(this.selectedSegment); // Carregar filmes ao iniciar a página
  }

  // Método para carregar filmes dependendo da categoria selecionada
  loadMovies(segment: string) {
    if (segment === '1') {
      this.loadRecentMovies();
    } else if (segment === '2') {
      this.loadUpcomingMovies();
    } else if (segment === '3') {
      this.loadNowPlayingMovies();
    } else if (segment === '4') {
      this.loadTvShows();
    }
  }

  // Carregar filmes recentes
  loadRecentMovies() {
    this.tmdbService.getRecentMovies().subscribe((data: any) => {
      this.recentMovies = data.results;
    });
  }

  // Carregar filmes que irão lançar
  loadUpcomingMovies() {
    this.tmdbService.getUpcomingMovies().subscribe((data: any) => {
      this.upcomingMovies = data.results;
    });
  }

  // Carregar filmes que estão em cartaz
  loadNowPlayingMovies() {
    this.tmdbService.getNowPlayingMovies().subscribe((data: any) => {
      this.nowPlayingMovies = data.results;
    });
  }

  // Carregar séries
  loadTvShows() {
    this.tmdbService.getTvShows().subscribe((data: any) => {
      this.tvShows = data.results;
    });
  }

  // Método para mudar o segmento selecionado
  onSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    this.loadMovies(this.selectedSegment); // Atualiza os filmes de acordo com a seleção
  }

  // Método para ir aos detalhes do filme
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]); // Navegar para a página de detalhes do filme
  }

  searchMovies() {
    if (this.searchQuery.trim() !== '') {
      this.tmdbService.searchMovies(this.searchQuery).subscribe((data: any) => {
        this.searchResults = data.results;
  
        // Ordena os resultados pela popularidade, do mais popular para o menos popular
        this.searchResults.sort((a, b) => b.popularity - a.popularity);
      });
    } else {
      this.searchResults = [];
    }
  }
  
}
