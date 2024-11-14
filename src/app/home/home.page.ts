import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { TmdbService } from '../services/tmdb.service'; // ajuste o caminho conforme necessário

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  recentMovies: any[] = []; // Definindo a propriedade recentMovies

  constructor(
    public tmdbService: TmdbService,
    private router: Router // Adicionar Router no construtor
  ) {}

  ngOnInit() {
    this.loadRecentMovies();
  }

  // Método para carregar filmes recentes
  loadRecentMovies() {
    this.tmdbService.getRecentMovies().subscribe((data: any) => {
      this.recentMovies = data.results;
    });
  }

  // Método para ir aos detalhes do filme
  goToMovieDetails(movieId: number) {
    // Usando o router para navegar para a página de detalhes do filme
    this.router.navigate(['/movie-details', movieId]);
  }
}
