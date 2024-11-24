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
  isLoading: boolean = true;
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
      const reviewsSnapshot = await this.firestore
        .collection('reviews', (ref) =>
          ref.where('userId', '==', userId).where('rating', '>=', 4)
        )
        .get()
        .toPromise();
  
      if (!reviewsSnapshot || reviewsSnapshot.empty) {
        console.error('Nenhuma avaliação encontrada no Firestore.');
        return;
      }
  
      const reviews = reviewsSnapshot.docs.map((doc) => doc.data() as any);
      console.log('Avaliações encontradas:', reviews);
  
      if (reviews.length === 0) {
        alert('Nenhuma avaliação encontrada para gerar recomendações.');
        return;
      }
  
      for (const review of reviews) {
        const mediaId = review.movieId || review.tvId; 
        const mediaType = review.movieId ? 'movie' : 'tv';
  
        if (!mediaId) continue;
  
        let mediaDetails;
        if (mediaType === 'movie') {
          mediaDetails = await this.tmdbService.getMovieDetails(mediaId).toPromise();
        } else {
          mediaDetails = await this.tmdbService.getTvDetails(mediaId).toPromise();
        }
  
        const genreIds = mediaDetails.genres.map((genre: any) => genre.id);
        const mediaTitle = mediaDetails.title || mediaDetails.name; 
        const mediaOverview = mediaDetails.overview;
        const mediaDirector = mediaDetails.director; 
        const mediaCast = mediaDetails.cast; 
  

        let similarMediaResponse;
        if (mediaType === 'movie') {
          similarMediaResponse = await this.tmdbService.getSimilarMovies(mediaId).toPromise();
        } else {
          similarMediaResponse = await this.tmdbService.getSimilarTvShows(mediaId).toPromise();
        }
  
        if (similarMediaResponse && Array.isArray(similarMediaResponse.results)) {
          const relevantMedia = similarMediaResponse.results.filter((media: any) => {
            const isGenreSimilar = media.genre_ids.some((genreId: number) => genreIds.includes(genreId));
            const isTitleOrOverviewSimilar =
              media.title?.toLowerCase().includes(mediaTitle.toLowerCase()) ||
              media.overview?.toLowerCase().includes(mediaOverview.toLowerCase());
  
            const isDirectorSimilar = media.director && media.director === mediaDirector;
            const isCastSimilar = media.cast && media.cast.some((cast: any) => mediaCast.includes(cast.name));
  
            return isGenreSimilar || isTitleOrOverviewSimilar || isDirectorSimilar || isCastSimilar;
          });
  
          this.recommendedMovies.push({
            mediaId: mediaDetails.id,
            title: mediaDetails.title || mediaDetails.name,  
            overview: mediaDetails.overview,
            recommendedMovies: relevantMedia.slice(0, 4),  
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
  
    if (media.media_type === 'movie' || media.title) {
      this.router.navigate(['/movie-details', media.id]);
    } else if (media.media_type === 'tv' || media.name) {
      this.router.navigate(['/tv-details', media.id]);
    } else {
      console.error('Tipo de mídia desconhecido para a mídia:', media);
    }
  }
}
