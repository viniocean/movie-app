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
  rating: number = 0; // Avaliação atual do usuário (de 1 a 5)
  stars: boolean[] = [false, false, false, false, false]; // Estado das estrelas (para destacar as estrelas selecionadas)
  comment: string = ''; // Comentário opcional
  savedRating: number = 0; // Avaliação salva
  savedComment: string = ''; // Comentário salvo
  reviews: any[] = []; // Avaliações de outros usuários

  constructor(
    public route: ActivatedRoute,
    public tmdbService: TmdbService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth  // Serviço de autenticação Firebase
  ) {}

  ngOnInit() {
    const tvId = Number(this.route.snapshot.paramMap.get('id'));
    this.tmdbService.getTvDetails(tvId).subscribe(response => {
      this.tv = response;
      this.loadSavedRating(tvId); // Carregar avaliação salva, se houver
      this.loadReviews(tvId); // Carregar avaliações dos usuários
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
      // Verificar se o usuário está logado
      const user = await this.afAuth.currentUser;
      if (!user) {
        alert('Você precisa estar logado para enviar uma avaliação.');
        return;
      }

      const tvId = this.tv.id;
      const reviewData = {
        tvId,
        name: this.tv.name,
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
        this.saveRating(tvId);  // Salvar a avaliação no localStorage, se necessário
        this.loadReviews(tvId);  // Recarregar as avaliações
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        alert('Ocorreu um erro ao enviar sua avaliação. Tente novamente mais tarde.');
      }
    } else {
      alert('Por favor, selecione uma avaliação antes de enviar.');
    }
  }
}
