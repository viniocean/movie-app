import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TmdbService } from '../services/tmdb.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
})
export class RecommendationsPage implements OnInit, OnDestroy {
  recommendedMovies: any[] = [];
  private authSubscription: Subscription | null = null;

  constructor(
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public tmdbService: TmdbService,
    public router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.afAuth.authState.subscribe((user) => {
      if (user && user.uid) {
        this.loadRecommendedMovies(user.uid);
      } else {
        alert('Faça login para ver recomendações!');
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadRecommendedMovies(userId: string) {
    try {
      // Carregar todas as avaliações do usuário para pegar as que têm nota alta (4 ou mais)
      const reviewsSnapshot = await this.firestore
        .collection('reviews', (ref) =>
          ref.where('userId', '==', userId).where('rating', '>=', 4)
        )
        .get()
        .toPromise();
  
      if (!reviewsSnapshot || reviewsSnapshot.empty) {
        console.error('Nenhuma avaliação encontrada no Firestore.');
        alert('Nenhuma avaliação de filme ou série encontrada para gerar recomendações.');
        return;
      }
  
      const reviews = reviewsSnapshot.docs.map((doc) => doc.data() as any);
      console.log('Avaliações encontradas:', reviews);
  
      // Verificar se a lista de avaliações está vazia
      if (reviews.length === 0) {
        alert('Nenhuma avaliação encontrada para gerar recomendações.');
        return;
      }
  
      // Iterar sobre as avaliações e carregar recomendações
      for (const review of reviews) {
        const mediaId = review.movieId || review.tvId;  // Ajustado para lidar com filmes e séries
        const mediaType = review.movieId ? 'movie' : 'tv'; // Verificar se é filme ou série
  
        if (!mediaId) continue;
  
        // Pegar detalhes do filme ou série usando o ID
        let mediaDetails;
        if (mediaType === 'movie') {
          mediaDetails = await this.tmdbService.getMovieDetails(mediaId).toPromise();
        } else {
          mediaDetails = await this.tmdbService.getTvDetails(mediaId).toPromise();
        }
  
        const genreIds = mediaDetails.genres.map((genre: any) => genre.id);
        const mediaTitle = mediaDetails.title || mediaDetails.name;  // Título do filme ou série
        const mediaOverview = mediaDetails.overview;
        const mediaDirector = mediaDetails.director;  // Diretor do filme (se disponível)
        const mediaCast = mediaDetails.cast;  // Elenco do filme ou série (se disponível)
  
        // Agora buscamos as recomendações com base no tipo de mídia (filme ou série)
        let similarMediaResponse;
        if (mediaType === 'movie') {
          similarMediaResponse = await this.tmdbService.getSimilarMovies(mediaId).toPromise();
        } else {
          similarMediaResponse = await this.tmdbService.getSimilarTvShows(mediaId).toPromise();
        }
  
        if (similarMediaResponse && Array.isArray(similarMediaResponse.results)) {
          // Refinar as recomendações com base em mais critérios
          const relevantMedia = similarMediaResponse.results.filter((media: any) => {
            const isGenreSimilar = media.genre_ids.some((genreId: number) => genreIds.includes(genreId));
            const isTitleOrOverviewSimilar =
              media.title?.toLowerCase().includes(mediaTitle.toLowerCase()) ||
              media.overview?.toLowerCase().includes(mediaOverview.toLowerCase());
  
            // Verificar se o filme/série tem o mesmo diretor ou elenco
            const isDirectorSimilar = media.director && media.director === mediaDirector;
            const isCastSimilar = media.cast && media.cast.some((cast: any) => mediaCast.includes(cast.name));
  
            return isGenreSimilar || isTitleOrOverviewSimilar || isDirectorSimilar || isCastSimilar;
          });
  
          // Adicionar ao array de filmes/séries recomendados
          this.recommendedMovies.push({
            mediaId: mediaDetails.id,
            title: mediaDetails.title || mediaDetails.name,  // Para filmes ou séries
            overview: mediaDetails.overview,
            recommendedMovies: relevantMedia.slice(0, 4),  // Limita a 4 recomendações
            mediaType: mediaType,
          });
  
          console.log('Mídia recomendada para', mediaDetails.title || mediaDetails.name, relevantMedia.slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      alert('Erro ao carregar recomendações. Tente novamente mais tarde.');
    }
  }
  

  viewMovieDetails(media: any) {
    if (!media) {
      console.error('Mídia inválida passada para viewMovieDetails:', media);
      return;
    }
  
    // Verifica o tipo de mídia e navega para a página apropriada
    if (media.media_type === 'movie' || media.title) {
      this.router.navigate(['/movie-details', media.id]);
    } else if (media.media_type === 'tv' || media.name) {
      this.router.navigate(['/tv-details', media.id]);
    } else {
      console.error('Tipo de mídia desconhecido para a mídia:', media);
    }
  }
}
