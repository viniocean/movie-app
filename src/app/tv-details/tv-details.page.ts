import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-tv-details',
  templateUrl: './tv-details.page.html',
  styleUrls: ['./tv-details.page.scss'],
})
export class TvDetailsPage implements OnInit {
  tv: any;
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
    const tvId = Number(this.route.snapshot.paramMap.get('id'));
    this.tmdbService.getTvDetails(tvId).subscribe(response => {
      this.tv = response;
      this.loadSavedRating(tvId); 
      this.loadReviews(tvId); 
    }, error => {
      console.error('Erro ao carregar detalhes da série:', error);
    });
  }

  loadSavedRating(tvId: number) {
    const savedData = localStorage.getItem(`tv_${tvId}_rating`);
    if (savedData) {
      const { rating, comment } = JSON.parse(savedData);
      this.savedRating = rating;
      this.savedComment = comment;
    }
  }

  loadReviews(tvId: number) {
    this.firestore.collection('reviews', ref => ref.where('tvId', '==', tvId))
      .get()
      .subscribe(querySnapshot => {
        this.reviews = querySnapshot.docs.map(doc => doc.data());
      });
  }

  rateTv(starIndex: number) {
    this.rating = starIndex;
    this.stars = this.stars.map((_, index) => index < starIndex);
  }

  saveRating(tvId: number) {
    const data = {
      rating: this.rating,
      comment: this.comment
    };
    localStorage.setItem(`tv_${tvId}_rating`, JSON.stringify(data));
    this.savedRating = this.rating;
    this.savedComment = this.comment;
  }

  async submitRating() {
    if (this.rating > 0) {
      const user = await this.afAuth.currentUser;
      if (!user) {
        alert('Você precisa estar logado para enviar uma avaliação.');
        return;
      }
  
      const tvId = this.tv?.id || 'ID desconhecido';
      const tvTitle = this.tv?.title || 'Título desconhecido'; // Valor padrão
      const reviewData = {
        tvId,
        title: this.tv?.name || this.tv?.title || 'Título desconhecido', // Alterado de tvTitle para title
        rating: this.rating,
        comment: this.comment || 'Sem comentário',
        userId: user.uid,
        username: user.displayName || 'Usuário Anônimo',
        timestamp: new Date()
      };
  
      try {
        await this.firestore.collection('reviews').add(reviewData);
        alert('Avaliação enviada com sucesso!');
        this.saveRating(tvId);
        this.loadReviews(tvId);
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        alert('Ocorreu um erro ao enviar sua avaliação. Tente novamente mais tarde.');
      }
    } else {
      alert('Por favor, selecione uma avaliação antes de enviar.');
    }
  }
}
