import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { TmdbService } from '../services/tmdb.service'; // Ajuste o caminho conforme necessário
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa o Firebase Auth
import { Auth } from 'firebase/auth'; // Para a versão modular do Firebase v10+

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
  currentUser: any = null; // Usar qualquer tipo compatível com a versão mais recente do Firebase

  constructor(
    public tmdbService: TmdbService,
    public router: Router, // Adicionar Router no construtor
    private afAuth: AngularFireAuth // Adicionar Firebase Auth
  ) {}

  ngOnInit() {
    this.loadMovies(this.selectedSegment); // Carregar filmes ao iniciar a página
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user; // Atualizar o estado do usuário
    });
  }

  // Método para carregar filmes dependendo da categoria selecionada
  loadMovies(segment: string) {
    if (segment === '1') {
      this.loadRecentMovies();
    } else if (segment === '2') {
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
      // Ordena as séries pela popularidade, do mais popular para o menos popular
      this.tvShows.sort((a, b) => b.popularity - a.popularity);
    });
  }

  // Método para mudar o segmento selecionado
  onSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    this.loadMovies(this.selectedSegment); // Atualiza os filmes de acordo com a seleção
  }

  // Navegar para detalhes do filme
  goToDetails(itemId: number, mediaType: string) {
    if (mediaType === 'movie') {
      this.router.navigate(['/movie-details', itemId]); // Navegar para a página de detalhes do filme
    } else if (mediaType === 'tv') {
      this.router.navigate(['/tv-details', itemId]); // Navegar para a página de detalhes da série
    }
  }

  // Função de logout
  logout() {
    this.afAuth.signOut().then(() => {
      this.currentUser = null; // Limpar o usuário logado
      this.router.navigate(['/login']); // Redirecionar para a página de login (se necessário)
    });
  }

  // Função para navegar até as avaliações
  goToRatings() {
    this.router.navigate(['/ratings']); // Navegar para a página de avaliações
  }
  goToRecommendations() {
    this.router.navigate(['/recommendations']); // Navegar para a página de avaliações
  }

  openMenu() {
    const menu = document.querySelector('ion-menu');
    menu?.open();
  }

  closeMenu() {
    const menu = document.querySelector('ion-menu');
    menu?.close();
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
