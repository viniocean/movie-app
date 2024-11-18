import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
  movie: any;
  rating: number = 0; // Avaliação atual do usuário (de 1 a 5)
  stars: boolean[] = [false, false, false, false, false]; // Estado das estrelas (para destacar as estrelas selecionadas)
  comment: string = ''; // Comentário opcional
  savedRating: number = 0; // Avaliação salva
  savedComment: string = ''; // Comentário salvo

  constructor(
    public route: ActivatedRoute,
    public tmdbService: TmdbService
  ) {}

  ngOnInit() {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.tmdbService.getMovieDetails(movieId).subscribe(response => {
      this.movie = response;
      this.loadSavedRating(movieId); // Carregar avaliação salva, se houver
    }, error => {
      console.error('Erro ao carregar detalhes do filme:', error);
    });
  }

  // Carregar avaliação e comentário do localStorage
  loadSavedRating(movieId: number) {
    const savedData = localStorage.getItem(`movie_${movieId}_rating`);
    if (savedData) {
      const { rating, comment } = JSON.parse(savedData);
      this.savedRating = rating;
      this.savedComment = comment;
    }
  }

  // Método para lidar com a seleção de estrelas
  rateMovie(starIndex: number) {
    this.rating = starIndex;
    this.stars = this.stars.map((_, index) => index < starIndex); // Marca as estrelas até o índice selecionado
  }

  // Método para salvar a avaliação no localStorage
  saveRating(movieId: number) {
    const data = {
      rating: this.rating,
      comment: this.comment
    };
    localStorage.setItem(`movie_${movieId}_rating`, JSON.stringify(data));
    this.savedRating = this.rating;
    this.savedComment = this.comment;
  }

  // Método para enviar a avaliação do filme
  submitRating() {
    if (this.rating > 0) {
      console.log(`Avaliação enviada para o filme ${this.movie.title}: ${this.rating} estrelas.`);
      console.log(`Comentário: ${this.comment}`);
      
      // Salvar avaliação no localStorage
      this.saveRating(this.movie.id);
    } else {
      alert('Por favor, selecione uma avaliação antes de enviar.');
    }
  }
}
