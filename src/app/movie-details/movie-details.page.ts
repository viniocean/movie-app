import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
  movie: any;
  rating: number = 0;
  stars: boolean[] = [false, false, false, false, false];
  comment: string = ''; 
  savedRating: number = 0; 
  savedComment: string = '';
  reviews: any[] = []; 

  constructor(
    public route: ActivatedRoute,
    public tmdbService: TmdbService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth 
  ) {}

  ngOnInit() {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.tmdbService.getMovieDetails(movieId).subscribe(response => {
      this.movie = response;
      this.loadSavedRating(movieId); 
      this.loadReviews(movieId); 
    }, error => {
      console.error('Erro ao carregar detalhes do filme:', error);
    });

    
  }

  

  loadSavedRating(movieId: number) {
    const savedData = localStorage.getItem(`movie_${movieId}_rating`);
    if (savedData) {
      const { rating, comment } = JSON.parse(savedData);
      this.savedRating = rating;
      this.savedComment = comment;
    }
  }

  loadReviews(movieId: number) {
    this.firestore.collection('reviews', ref => ref.where('movieId', '==', movieId))
      .get()
      .subscribe(querySnapshot => {
        this.reviews = querySnapshot.docs.map(doc => doc.data());
      });
  }

  rateMovie(starIndex: number) {
    this.rating = starIndex;
    this.stars = this.stars.map((_, index) => index < starIndex);
  }

  saveRating(movieId: number) {
    const data = {
      rating: this.rating,
      comment: this.comment
    };
    localStorage.setItem(`movie_${movieId}_rating`, JSON.stringify(data));
    this.savedRating = this.rating;
    this.savedComment = this.comment;
  }

  async submitRating() {
    if (this.rating > 0) {
      // Verificar se o usuário está logado
      const user = await this.afAuth.currentUser;
      if (!user) {
        alert('Você precisa estar logado para enviar uma avaliação.');
        return;
      }

      const movieId = this.movie.id;
      const reviewData = {
        movieId,
        title: this.movie.title,
        rating: this.rating,
        comment: this.comment,
        userId: user.uid,  // ID do usuário
        username: user.displayName || 'Usuário Anônimo', // Nome do usuário, se disponível
        timestamp: new Date()
        
      };

      // Enviar avaliação para o Firestore
      try {
        await this.firestore.collection('reviews').add(reviewData);
        alert('Avaliação enviada com sucesso!');
        this.saveRating(movieId);  // Salvar a avaliação no localStorage, se necessário
        this.loadReviews(movieId);  // Recarregar as avaliações
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        alert('Ocorreu um erro ao enviar sua avaliação. Tente novamente mais tarde.');
      }
    } else {
      alert('Por favor, selecione uma avaliação antes de enviar.');
    }
  }
}
